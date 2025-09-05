import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  INotification,
  INotificationTemplate,
  IUserNotificationPreferences,
  INotificationCampaign,
  CreateNotificationDto,
  UpdateNotificationDto,
  CreateNotificationTemplateDto,
  UpdateNotificationTemplateDto,
  CreateUserNotificationPreferencesDto,
  UpdateUserNotificationPreferencesDto,
  CreateNotificationCampaignDto,
  UpdateNotificationCampaignDto,
  NotificationQuery,
  BulkNotificationData,
  BulkNotificationResult,
  TemplateVariable,
  ProcessedTemplate,
  NotificationMetrics,
  CampaignMetrics,
  UserEngagementMetrics,
  NotificationType,
  NotificationCategory,
  NotificationPriority,
  NotificationStatus,
  NotificationChannel,
  DeliveryStatus,
  CampaignStatus,
  AnalyticsEvent,
} from '../../types/notification.types';

@Injectable()
export class AdvancedNotificationService {
  private readonly logger = new Logger(AdvancedNotificationService.name);
  private prisma: PrismaClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.prisma = new PrismaClient();
  }

  // ==================== NOTIFICATION CRUD ====================

  async createNotification(dto: CreateNotificationDto): Promise<INotification> {
    try {
      // Validar se o usuário existe
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      // Verificar preferências do usuário
      const preferences = await this.getUserNotificationPreferences(dto.userId);
      if (preferences && !this.isChannelEnabled(preferences, dto.channel)) {
        throw new BadRequestException(`Canal ${dto.channel} não está habilitado para este usuário`);
      }

      // Processar template se fornecido
      let processedTitle = dto.title;
      let processedMessage = dto.message;

      if (dto.templateId) {
        const template = await this.getNotificationTemplate(dto.templateId);
        if (template) {
          const processed = await this.processTemplate(template, dto.data || {});
          processedTitle = processed.title;
          processedMessage = processed.message;
        }
      }

      // Verificar se está em horário de silêncio
      if (preferences && this.isInQuietHours(preferences)) {
        // Agendar para depois do horário de silêncio
        const scheduledFor = this.getNextAvailableTime(preferences);
        dto.scheduledFor = scheduledFor;
      }

      const notification = await this.prisma.notification.create({
        data: {
          userId: dto.userId,
          title: processedTitle,
          message: processedMessage,
          type: dto.type,
          category: dto.category,
          priority: dto.priority || NotificationPriority.MEDIUM,
          channel: dto.channel,
          templateId: dto.templateId,
          data: dto.data,
          scheduledFor: dto.scheduledFor,
          expiresAt: dto.expiresAt,
          maxRetries: dto.maxRetries || 3,
          metadata: dto.metadata,
          status: dto.scheduledFor ? NotificationStatus.SCHEDULED : NotificationStatus.PENDING,
        },
      });

      // Emitir evento para processamento
      this.eventEmitter.emit('notification.created', {
        notificationId: notification.id,
        userId: notification.userId,
        channel: notification.channel,
        priority: notification.priority,
      });

      this.logger.log(`Notificação criada: ${notification.id}`);
      return notification as INotification;
    } catch (error) {
      this.logger.error(`Erro ao criar notificação: ${error.message}`);
      throw error;
    }
  }

  async getNotification(id: string): Promise<INotification> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notificação não encontrada');
    }

    return notification as INotification;
  }

  async updateNotification(id: string, dto: UpdateNotificationDto): Promise<INotification> {
    const notification = await this.getNotification(id);

    const updatedNotification = await this.prisma.notification.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Notificação atualizada: ${id}`);
    return updatedNotification as INotification;
  }

  async deleteNotification(id: string): Promise<void> {
    await this.getNotification(id);

    await this.prisma.notification.update({
      where: { id },
      data: {
        status: NotificationStatus.CANCELLED,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Notificação cancelada: ${id}`);
  }

  async getNotifications(query: NotificationQuery): Promise<INotification[]> {
    const where: any = {};

    if (query.userId) where.userId = query.userId;
    if (query.type) where.type = query.type;
    if (query.category) where.category = query.category;
    if (query.priority) where.priority = query.priority;
    if (query.status) where.status = query.status;
    if (query.channel) where.channel = query.channel;
    if (query.isRead !== undefined) {
      where.readAt = query.isRead ? { not: null } : null;
    }

    if (query.scheduledFor) {
      where.scheduledFor = {};
      if (query.scheduledFor.from) where.scheduledFor.gte = query.scheduledFor.from;
      if (query.scheduledFor.to) where.scheduledFor.lte = query.scheduledFor.to;
    }

    if (query.createdAt) {
      where.createdAt = {};
      if (query.createdAt.from) where.createdAt.gte = query.createdAt.from;
      if (query.createdAt.to) where.createdAt.lte = query.createdAt.to;
    }

    const notifications = await this.prisma.notification.findMany({
      where,
      orderBy: {
        [query.orderBy || 'createdAt']: query.orderDirection || 'desc',
      },
      take: query.limit || 50,
      skip: query.offset || 0,
    });

    return notifications as INotification[];
  }

  // ==================== TEMPLATE MANAGEMENT ====================

  async createNotificationTemplate(dto: CreateNotificationTemplateDto): Promise<INotificationTemplate> {
    const template = await this.prisma.notificationTemplate.create({
      data: {
        name: dto.name,
        title: dto.title,
        message: dto.message,
        type: dto.type,
        category: dto.category,
        channel: dto.channel,
        variables: dto.variables,
        isActive: dto.isActive ?? true,
        isSystem: dto.isSystem ?? false,
        metadata: dto.metadata,
      },
    });

    this.logger.log(`Template de notificação criado: ${template.id}`);
    return template as INotificationTemplate;
  }

  async getNotificationTemplate(id: string): Promise<INotificationTemplate> {
    const template = await this.prisma.notificationTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Template de notificação não encontrado');
    }

    return template as INotificationTemplate;
  }

  async getNotificationTemplates(
    type?: NotificationType,
    category?: NotificationCategory,
    channel?: NotificationChannel,
  ): Promise<INotificationTemplate[]> {
    const where: any = { isActive: true };

    if (type) where.type = type;
    if (category) where.category = category;
    if (channel) where.channel = channel;

    const templates = await this.prisma.notificationTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return templates as INotificationTemplate[];
  }

  async updateNotificationTemplate(id: string, dto: UpdateNotificationTemplateDto): Promise<INotificationTemplate> {
    const template = await this.getNotificationTemplate(id);

    const updatedTemplate = await this.prisma.notificationTemplate.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Template de notificação atualizado: ${id}`);
    return updatedTemplate as INotificationTemplate;
  }

  async deleteNotificationTemplate(id: string): Promise<void> {
    const template = await this.getNotificationTemplate(id);

    if (template.isSystem) {
      throw new BadRequestException('Templates do sistema não podem ser excluídos');
    }

    await this.prisma.notificationTemplate.update({
      where: { id },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Template de notificação desativado: ${id}`);
  }

  // ==================== USER PREFERENCES ====================

  async createUserNotificationPreferences(dto: CreateUserNotificationPreferencesDto): Promise<IUserNotificationPreferences> {
    const preferences = await this.prisma.userNotificationPreferences.create({
      data: {
        userId: dto.userId,
        emailEnabled: dto.emailEnabled ?? true,
        smsEnabled: dto.smsEnabled ?? false,
        pushEnabled: dto.pushEnabled ?? true,
        inAppEnabled: dto.inAppEnabled ?? true,
        webhookEnabled: dto.webhookEnabled ?? false,
        webhookUrl: dto.webhookUrl,
        quietHoursStart: dto.quietHoursStart,
        quietHoursEnd: dto.quietHoursEnd,
        timezone: dto.timezone ?? 'America/Sao_Paulo',
        language: dto.language ?? 'pt-BR',
        categories: dto.categories ?? {},
        channels: dto.channels ?? {},
        frequency: dto.frequency ?? 'IMMEDIATE',
        digestEnabled: dto.digestEnabled ?? false,
        digestFrequency: dto.digestFrequency ?? 'DAILY',
        digestTime: dto.digestTime ?? '09:00',
      },
    });

    this.logger.log(`Preferências de notificação criadas para usuário: ${dto.userId}`);
    return preferences as IUserNotificationPreferences;
  }

  async getUserNotificationPreferences(userId: string): Promise<IUserNotificationPreferences | null> {
    const preferences = await this.prisma.userNotificationPreferences.findUnique({
      where: { userId },
    });

    return preferences as IUserNotificationPreferences | null;
  }

  async updateUserNotificationPreferences(
    userId: string,
    dto: UpdateUserNotificationPreferencesDto,
  ): Promise<IUserNotificationPreferences> {
    const preferences = await this.getUserNotificationPreferences(userId);

    if (!preferences) {
      return this.createUserNotificationPreferences({ userId, ...dto });
    }

    const updatedPreferences = await this.prisma.userNotificationPreferences.update({
      where: { userId },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Preferências de notificação atualizadas para usuário: ${userId}`);
    return updatedPreferences as IUserNotificationPreferences;
  }

  // ==================== BULK NOTIFICATIONS ====================

  async sendBulkNotifications(data: BulkNotificationData): Promise<BulkNotificationResult> {
    const result: BulkNotificationResult = {
      success: true,
      totalSent: 0,
      totalFailed: 0,
      errors: [],
      notificationIds: [],
    };

    this.logger.log(`Iniciando envio em lote para ${data.userIds.length} usuários`);

    for (const userId of data.userIds) {
      try {
        const notification = await this.createNotification({
          userId,
          title: data.title,
          message: data.message,
          type: data.type,
          category: data.category,
          priority: data.priority,
          channel: data.channel,
          templateId: data.templateId,
          data: data.data,
          scheduledFor: data.scheduledFor,
          expiresAt: data.expiresAt,
          maxRetries: data.maxRetries,
          metadata: data.metadata,
        });

        result.notificationIds.push(notification.id);
        result.totalSent++;
      } catch (error) {
        result.totalFailed++;
        result.errors.push({
          userId,
          error: error.message,
        });
        this.logger.error(`Erro ao enviar notificação para usuário ${userId}: ${error.message}`);
      }
    }

    this.logger.log(`Envio em lote concluído: ${result.totalSent} enviadas, ${result.totalFailed} falharam`);
    return result;
  }

  // ==================== TEMPLATE PROCESSING ====================

  async processTemplate(template: INotificationTemplate, variables: Record<string, any>): Promise<ProcessedTemplate> {
    let processedTitle = template.title;
    let processedMessage = template.message;

    // Substituir variáveis no título e mensagem
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      const stringValue = this.formatVariable(value);
      
      processedTitle = processedTitle.replace(new RegExp(placeholder, 'g'), stringValue);
      processedMessage = processedMessage.replace(new RegExp(placeholder, 'g'), stringValue);
    }

    return {
      title: processedTitle,
      message: processedMessage,
      variables,
    };
  }

  private formatVariable(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'object') {
      if (value instanceof Date) {
        return value.toLocaleDateString('pt-BR');
      }
      return JSON.stringify(value);
    }

    return String(value);
  }

  // ==================== UTILITY METHODS ====================

  private isChannelEnabled(preferences: IUserNotificationPreferences, channel: NotificationChannel): boolean {
    const channelMap = {
      [NotificationChannel.EMAIL]: preferences.emailEnabled,
      [NotificationChannel.SMS]: preferences.smsEnabled,
      [NotificationChannel.PUSH]: preferences.pushEnabled,
      [NotificationChannel.IN_APP]: preferences.inAppEnabled,
      [NotificationChannel.WEBHOOK]: preferences.webhookEnabled,
    };

    return channelMap[channel] ?? true;
  }

  private isInQuietHours(preferences: IUserNotificationPreferences): boolean {
    if (!preferences.quietHoursStart || !preferences.quietHoursEnd) {
      return false;
    }

    const now = new Date();
    const currentTime = now.toLocaleTimeString('pt-BR', { 
      hour12: false, 
      timeZone: preferences.timezone 
    });

    return currentTime >= preferences.quietHoursStart && currentTime <= preferences.quietHoursEnd;
  }

  private getNextAvailableTime(preferences: IUserNotificationPreferences): Date {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const [hours, minutes] = preferences.quietHoursEnd!.split(':');
    tomorrow.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    return tomorrow;
  }

  // ==================== ANALYTICS ====================

  async getNotificationMetrics(
    from?: Date,
    to?: Date,
    type?: NotificationType,
    channel?: NotificationChannel,
  ): Promise<NotificationMetrics> {
    const where: any = {};

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = from;
      if (to) where.createdAt.lte = to;
    }

    if (type) where.type = type;
    if (channel) where.channel = channel;

    const [
      totalSent,
      totalDelivered,
      totalOpened,
      totalClicked,
      totalFailed,
    ] = await Promise.all([
      this.prisma.notification.count({ where: { ...where, status: NotificationStatus.SENT } }),
      this.prisma.notification.count({ where: { ...where, deliveryStatus: DeliveryStatus.DELIVERED } }),
      this.prisma.notificationAnalytics.count({ where: { ...where, event: AnalyticsEvent.OPENED } }),
      this.prisma.notificationAnalytics.count({ where: { ...where, event: AnalyticsEvent.CLICKED } }),
      this.prisma.notification.count({ where: { ...where, status: NotificationStatus.FAILED } }),
    ]);

    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;
    const openRate = totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0;
    const clickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0;
    const failureRate = totalSent > 0 ? (totalFailed / totalSent) * 100 : 0;

    return {
      totalSent,
      totalDelivered,
      totalOpened,
      totalClicked,
      totalFailed,
      deliveryRate,
      openRate,
      clickRate,
      failureRate,
      averageDeliveryTime: 0, // Implementar cálculo baseado em timestamps
    };
  }

  async trackNotificationEvent(
    notificationId: string,
    userId: string,
    event: AnalyticsEvent,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.prisma.notificationAnalytics.create({
      data: {
        notificationId,
        userId,
        event,
        metadata,
        timestamp: new Date(),
      },
    });

    this.logger.log(`Evento de notificação rastreado: ${event} para notificação ${notificationId}`);
  }

  // ==================== CLEANUP ====================

  async cleanupExpiredNotifications(): Promise<number> {
    const result = await this.prisma.notification.updateMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
        status: {
          not: NotificationStatus.EXPIRED,
        },
      },
      data: {
        status: NotificationStatus.EXPIRED,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`${result.count} notificações expiradas foram marcadas`);
    return result.count;
  }

  async cleanupOldAnalytics(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.prisma.notificationAnalytics.deleteMany({
      where: {
        timestamp: {
          lt: cutoffDate,
        },
      },
    });

    this.logger.log(`${result.count} registros de analytics antigos foram removidos`);
    return result.count;
  }
}
