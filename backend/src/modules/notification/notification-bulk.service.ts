import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  BulkNotificationData,
  BulkNotificationResult,
  NotificationType,
  NotificationCategory,
  NotificationPriority,
  NotificationChannel,
  INotification,
} from '../../types/notification.types';

@Injectable()
export class NotificationBulkService {
  private readonly logger = new Logger(NotificationBulkService.name);
  private prisma: PrismaClient;
  private readonly BATCH_SIZE = 100; // Processar em lotes de 100

  constructor(private readonly eventEmitter: EventEmitter2) {
    this.prisma = new PrismaClient();
  }

  // ==================== BULK NOTIFICATION CREATION ====================

  async sendBulkNotifications(data: BulkNotificationData): Promise<BulkNotificationResult> {
    this.validateBulkData(data);

    const result: BulkNotificationResult = {
      success: true,
      totalSent: 0,
      totalFailed: 0,
      errors: [],
      notificationIds: [],
    };

    this.logger.log(`Iniciando envio em lote para ${data.userIds.length} usuários`);

    // Processar em lotes para evitar sobrecarga
    const batches = this.createBatches(data.userIds, this.BATCH_SIZE);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      this.logger.log(`Processando lote ${i + 1}/${batches.length} (${batch.length} usuários)`);

      const batchResult = await this.processBatch(batch, data);
      
      result.totalSent += batchResult.totalSent;
      result.totalFailed += batchResult.totalFailed;
      result.errors.push(...batchResult.errors);
      result.notificationIds.push(...batchResult.notificationIds);

      // Pequena pausa entre lotes para não sobrecarregar o sistema
      if (i < batches.length - 1) {
        await this.delay(100);
      }
    }

    this.logger.log(`Envio em lote concluído: ${result.totalSent} enviadas, ${result.totalFailed} falharam`);

    // Emitir evento de conclusão
    this.eventEmitter.emit('bulk.notifications.completed', {
      totalSent: result.totalSent,
      totalFailed: result.totalFailed,
      notificationIds: result.notificationIds,
    });

    return result;
  }

  // ==================== BATCH PROCESSING ====================

  private async processBatch(
    userIds: string[],
    data: BulkNotificationData,
  ): Promise<{
    totalSent: number;
    totalFailed: number;
    errors: Array<{ userId: string; error: string }>;
    notificationIds: string[];
  }> {
    const result = {
      totalSent: 0,
      totalFailed: 0,
      errors: [] as Array<{ userId: string; error: string }>,
      notificationIds: [] as string[],
    };

    // Processar usuários em paralelo (com limite)
    const promises = userIds.map(userId => this.processUserNotification(userId, data));
    const results = await Promise.allSettled(promises);

    results.forEach((promiseResult, index) => {
      const userId = userIds[index];
      
      if (promiseResult.status === 'fulfilled') {
        result.totalSent++;
        result.notificationIds.push(promiseResult.value);
      } else {
        result.totalFailed++;
        result.errors.push({
          userId,
          error: promiseResult.reason.message,
        });
      }
    });

    return result;
  }

  private async processUserNotification(userId: string, data: BulkNotificationData): Promise<string> {
    try {
      // Verificar se o usuário existe
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true },
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar preferências do usuário
      const preferences = await this.prisma.userNotificationPreferences.findUnique({
        where: { userId },
      });

      if (preferences && !this.isChannelEnabledForUser(preferences, data.channel)) {
        throw new Error(`Canal ${data.channel} não está habilitado para este usuário`);
      }

      // Processar template se fornecido
      let processedTitle = data.title;
      let processedMessage = data.message;

      if (data.templateId) {
        const template = await this.prisma.notificationTemplate.findUnique({
          where: { id: data.templateId },
        });

        if (template) {
          const processed = await this.processTemplate(template, {
            ...data.data,
            userName: user.name,
            userEmail: user.email,
          });
          processedTitle = processed.title;
          processedMessage = processed.message;
        }
      }

      // Criar notificação
      const notification = await this.prisma.notification.create({
        data: {
          userId,
          title: processedTitle,
          message: processedMessage,
          type: data.type,
          category: data.category,
          priority: data.priority || NotificationPriority.MEDIUM,
          channel: data.channel,
          templateId: data.templateId,
          data: data.data,
          scheduledFor: data.scheduledFor,
          expiresAt: data.expiresAt,
          maxRetries: data.maxRetries || 3,
          metadata: data.metadata,
        },
      });

      // Emitir evento para processamento
      this.eventEmitter.emit('notification.created', {
        notificationId: notification.id,
        userId: notification.userId,
        channel: notification.channel,
        priority: notification.priority,
      });

      return notification.id;
    } catch (error) {
      this.logger.error(`Erro ao processar notificação para usuário ${userId}: ${error.message}`);
      throw error;
    }
  }

  // ==================== USER SELECTION ====================

  async sendToUserGroup(
    groupCriteria: {
      userType?: string;
      department?: string;
      course?: string;
      level?: string;
      active?: boolean;
      hasLoans?: boolean;
      hasFines?: boolean;
      lastActivityDays?: number;
    },
    notificationData: Omit<BulkNotificationData, 'userIds'>,
  ): Promise<BulkNotificationResult> {
    const userIds = await this.getUsersByCriteria(groupCriteria);
    
    if (userIds.length === 0) {
      throw new BadRequestException('Nenhum usuário encontrado com os critérios especificados');
    }

    return this.sendBulkNotifications({
      ...notificationData,
      userIds,
    });
  }

  async sendToAllUsers(notificationData: Omit<BulkNotificationData, 'userIds'>): Promise<BulkNotificationResult> {
    const userIds = await this.getAllActiveUserIds();
    
    return this.sendBulkNotifications({
      ...notificationData,
      userIds,
    });
  }

  async sendToUsersWithLoans(notificationData: Omit<BulkNotificationData, 'userIds'>): Promise<BulkNotificationResult> {
    const userIds = await this.getUsersWithActiveLoans();
    
    return this.sendBulkNotifications({
      ...notificationData,
      userIds,
    });
  }

  async sendToUsersWithFines(notificationData: Omit<BulkNotificationData, 'userIds'>): Promise<BulkNotificationResult> {
    const userIds = await this.getUsersWithPendingFines();
    
    return this.sendBulkNotifications({
      ...notificationData,
      userIds,
    });
  }

  // ==================== SCHEDULED BULK NOTIFICATIONS ====================

  async scheduleBulkNotifications(
    data: BulkNotificationData,
    scheduledFor: Date,
  ): Promise<BulkNotificationResult> {
    this.validateBulkData(data);
    this.validateScheduledTime(scheduledFor);

    const result: BulkNotificationResult = {
      success: true,
      totalSent: 0,
      totalFailed: 0,
      errors: [],
      notificationIds: [],
    };

    this.logger.log(`Agendando ${data.userIds.length} notificações para ${scheduledFor.toISOString()}`);

    // Processar em lotes
    const batches = this.createBatches(data.userIds, this.BATCH_SIZE);

    for (const batch of batches) {
      const batchResult = await this.processScheduledBatch(batch, data, scheduledFor);
      
      result.totalSent += batchResult.totalSent;
      result.totalFailed += batchResult.totalFailed;
      result.errors.push(...batchResult.errors);
      result.notificationIds.push(...batchResult.notificationIds);
    }

    this.logger.log(`Agendamento em lote concluído: ${result.totalSent} agendadas, ${result.totalFailed} falharam`);
    return result;
  }

  private async processScheduledBatch(
    userIds: string[],
    data: BulkNotificationData,
    scheduledFor: Date,
  ): Promise<{
    totalSent: number;
    totalFailed: number;
    errors: Array<{ userId: string; error: string }>;
    notificationIds: string[];
  }> {
    const result = {
      totalSent: 0,
      totalFailed: 0,
      errors: [] as Array<{ userId: string; error: string }>,
      notificationIds: [] as string[],
    };

    const promises = userIds.map(userId => this.processScheduledUserNotification(userId, data, scheduledFor));
    const results = await Promise.allSettled(promises);

    results.forEach((promiseResult, index) => {
      const userId = userIds[index];
      
      if (promiseResult.status === 'fulfilled') {
        result.totalSent++;
        result.notificationIds.push(promiseResult.value);
      } else {
        result.totalFailed++;
        result.errors.push({
          userId,
          error: promiseResult.reason.message,
        });
      }
    });

    return result;
  }

  private async processScheduledUserNotification(
    userId: string,
    data: BulkNotificationData,
    scheduledFor: Date,
  ): Promise<string> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true },
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Processar template se fornecido
      let processedTitle = data.title;
      let processedMessage = data.message;

      if (data.templateId) {
        const template = await this.prisma.notificationTemplate.findUnique({
          where: { id: data.templateId },
        });

        if (template) {
          const processed = await this.processTemplate(template, {
            ...data.data,
            userName: user.name,
            userEmail: user.email,
          });
          processedTitle = processed.title;
          processedMessage = processed.message;
        }
      }

      const notification = await this.prisma.notification.create({
        data: {
          userId,
          title: processedTitle,
          message: processedMessage,
          type: data.type,
          category: data.category,
          priority: data.priority || NotificationPriority.MEDIUM,
          channel: data.channel,
          templateId: data.templateId,
          data: data.data,
          scheduledFor,
          expiresAt: data.expiresAt,
          maxRetries: data.maxRetries || 3,
          metadata: data.metadata,
        },
      });

      return notification.id;
    } catch (error) {
      this.logger.error(`Erro ao agendar notificação para usuário ${userId}: ${error.message}`);
      throw error;
    }
  }

  // ==================== UTILITY METHODS ====================

  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private validateBulkData(data: BulkNotificationData): void {
    if (!data.userIds || data.userIds.length === 0) {
      throw new BadRequestException('Lista de usuários não pode estar vazia');
    }

    if (data.userIds.length > 10000) {
      throw new BadRequestException('Máximo de 10.000 usuários por operação em lote');
    }

    if (!data.title || data.title.trim().length === 0) {
      throw new BadRequestException('Título é obrigatório');
    }

    if (!data.message || data.message.trim().length === 0) {
      throw new BadRequestException('Mensagem é obrigatória');
    }
  }

  private validateScheduledTime(scheduledFor: Date): void {
    const now = new Date();
    const oneYearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    if (scheduledFor <= now) {
      throw new BadRequestException('Data de agendamento deve ser futura');
    }

    if (scheduledFor > oneYearFromNow) {
      throw new BadRequestException('Data de agendamento não pode ser mais de 1 ano no futuro');
    }
  }

  private isChannelEnabledForUser(preferences: any, channel: NotificationChannel): boolean {
    const channelMap = {
      [NotificationChannel.EMAIL]: preferences.emailEnabled,
      [NotificationChannel.SMS]: preferences.smsEnabled,
      [NotificationChannel.PUSH]: preferences.pushEnabled,
      [NotificationChannel.IN_APP]: preferences.inAppEnabled,
      [NotificationChannel.WEBHOOK]: preferences.webhookEnabled,
    };

    return channelMap[channel] ?? true;
  }

  private async processTemplate(template: any, variables: Record<string, any>): Promise<{
    title: string;
    message: string;
  }> {
    let processedTitle = template.title;
    let processedMessage = template.message;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      const stringValue = this.formatVariable(value);
      
      processedTitle = processedTitle.replace(new RegExp(placeholder, 'g'), stringValue);
      processedMessage = processedMessage.replace(new RegExp(placeholder, 'g'), stringValue);
    }

    return {
      title: processedTitle,
      message: processedMessage,
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

  // ==================== USER QUERY METHODS ====================

  private async getUsersByCriteria(criteria: any): Promise<string[]> {
    const where: any = {};

    if (criteria.userType) where.type = criteria.userType;
    if (criteria.department) where.department = criteria.department;
    if (criteria.course) where.course = criteria.course;
    if (criteria.level) where.level = criteria.level;
    if (criteria.active !== undefined) where.active = criteria.active;

    if (criteria.hasLoans) {
      where.loans = { some: { status: 'ACTIVE' } };
    }

    if (criteria.hasFines) {
      where.fines = { some: { status: 'PENDING' } };
    }

    if (criteria.lastActivityDays) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - criteria.lastActivityDays);
      where.updatedAt = { gte: cutoffDate };
    }

    const users = await this.prisma.user.findMany({
      where,
      select: { id: true },
    });

    return users.map(user => user.id);
  }

  private async getAllActiveUserIds(): Promise<string[]> {
    const users = await this.prisma.user.findMany({
      where: { active: true },
      select: { id: true },
    });

    return users.map(user => user.id);
  }

  private async getUsersWithActiveLoans(): Promise<string[]> {
    const users = await this.prisma.user.findMany({
      where: {
        loans: {
          some: { status: 'ACTIVE' },
        },
        active: true,
      },
      select: { id: true },
      distinct: ['id'],
    });

    return users.map(user => user.id);
  }

  private async getUsersWithPendingFines(): Promise<string[]> {
    const users = await this.prisma.user.findMany({
      where: {
        fines: {
          some: { status: 'PENDING' },
        },
        active: true,
      },
      select: { id: true },
      distinct: ['id'],
    });

    return users.map(user => user.id);
  }

  // ==================== STATISTICS ====================

  async getBulkOperationStatistics(): Promise<{
    totalBulkOperations: number;
    totalNotificationsSent: number;
    averageSuccessRate: number;
    byChannel: Record<string, number>;
    byType: Record<string, number>;
  }> {
    // Implementar estatísticas de operações em lote
    return {
      totalBulkOperations: 0,
      totalNotificationsSent: 0,
      averageSuccessRate: 0,
      byChannel: {},
      byType: {},
    };
  }
}
