import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  IUserNotificationPreferences,
  CreateUserNotificationPreferencesDto,
  UpdateUserNotificationPreferencesDto,
  NotificationChannel,
  NotificationCategory,
  NotificationFrequency,
  DigestFrequency,
} from '../../types/notification.types';

@Injectable()
export class NotificationPreferencesService {
  private readonly logger = new Logger(NotificationPreferencesService.name);
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // ==================== PREFERENCES CRUD ====================

  async createPreferences(dto: CreateUserNotificationPreferencesDto): Promise<IUserNotificationPreferences> {
    try {
      // Verificar se o usuário existe
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      // Verificar se já existem preferências para este usuário
      const existingPreferences = await this.prisma.userNotificationPreferences.findUnique({
        where: { userId: dto.userId },
      });

      if (existingPreferences) {
        throw new BadRequestException('Preferências já existem para este usuário. Use o método de atualização.');
      }

      // Validar dados
      this.validatePreferences(dto);

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
          categories: dto.categories ?? this.getDefaultCategories(),
          channels: dto.channels ?? this.getDefaultChannels(),
          frequency: dto.frequency ?? NotificationFrequency.IMMEDIATE,
          digestEnabled: dto.digestEnabled ?? false,
          digestFrequency: dto.digestFrequency ?? DigestFrequency.DAILY,
          digestTime: dto.digestTime ?? '09:00',
        },
      });

      this.logger.log(`Preferências criadas para usuário: ${dto.userId}`);
      return preferences as IUserNotificationPreferences;
    } catch (error) {
      this.logger.error(`Erro ao criar preferências: ${error.message}`);
      throw error;
    }
  }

  async getPreferences(userId: string): Promise<IUserNotificationPreferences | null> {
    const preferences = await this.prisma.userNotificationPreferences.findUnique({
      where: { userId },
    });

    return preferences as IUserNotificationPreferences | null;
  }

  async getPreferencesOrCreate(userId: string): Promise<IUserNotificationPreferences> {
    let preferences = await this.getPreferences(userId);

    if (!preferences) {
      preferences = await this.createPreferences({ userId });
    }

    return preferences;
  }

  async updatePreferences(
    userId: string,
    dto: UpdateUserNotificationPreferencesDto,
  ): Promise<IUserNotificationPreferences> {
    const existingPreferences = await this.getPreferences(userId);

    if (!existingPreferences) {
      return this.createPreferences({ userId, ...dto });
    }

    // Validar dados
    this.validatePreferences(dto);

    const updatedPreferences = await this.prisma.userNotificationPreferences.update({
      where: { userId },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Preferências atualizadas para usuário: ${userId}`);
    return updatedPreferences as IUserNotificationPreferences;
  }

  async deletePreferences(userId: string): Promise<void> {
    const preferences = await this.getPreferences(userId);

    if (!preferences) {
      throw new NotFoundException('Preferências não encontradas');
    }

    await this.prisma.userNotificationPreferences.delete({
      where: { userId },
    });

    this.logger.log(`Preferências excluídas para usuário: ${userId}`);
  }

  // ==================== CHANNEL MANAGEMENT ====================

  async enableChannel(userId: string, channel: NotificationChannel): Promise<IUserNotificationPreferences> {
    const preferences = await this.getPreferencesOrCreate(userId);

    const channelUpdates: any = {};
    switch (channel) {
      case NotificationChannel.EMAIL:
        channelUpdates.emailEnabled = true;
        break;
      case NotificationChannel.SMS:
        channelUpdates.smsEnabled = true;
        break;
      case NotificationChannel.PUSH:
        channelUpdates.pushEnabled = true;
        break;
      case NotificationChannel.IN_APP:
        channelUpdates.inAppEnabled = true;
        break;
      case NotificationChannel.WEBHOOK:
        channelUpdates.webhookEnabled = true;
        break;
      default:
        throw new BadRequestException(`Canal ${channel} não suportado`);
    }

    return this.updatePreferences(userId, channelUpdates);
  }

  async disableChannel(userId: string, channel: NotificationChannel): Promise<IUserNotificationPreferences> {
    const preferences = await this.getPreferencesOrCreate(userId);

    const channelUpdates: any = {};
    switch (channel) {
      case NotificationChannel.EMAIL:
        channelUpdates.emailEnabled = false;
        break;
      case NotificationChannel.SMS:
        channelUpdates.smsEnabled = false;
        break;
      case NotificationChannel.PUSH:
        channelUpdates.pushEnabled = false;
        break;
      case NotificationChannel.IN_APP:
        channelUpdates.inAppEnabled = false;
        break;
      case NotificationChannel.WEBHOOK:
        channelUpdates.webhookEnabled = false;
        break;
      default:
        throw new BadRequestException(`Canal ${channel} não suportado`);
    }

    return this.updatePreferences(userId, channelUpdates);
  }

  async isChannelEnabled(userId: string, channel: NotificationChannel): Promise<boolean> {
    const preferences = await this.getPreferences(userId);

    if (!preferences) {
      return true; // Padrão é habilitado
    }

    switch (channel) {
      case NotificationChannel.EMAIL:
        return preferences.emailEnabled;
      case NotificationChannel.SMS:
        return preferences.smsEnabled;
      case NotificationChannel.PUSH:
        return preferences.pushEnabled;
      case NotificationChannel.IN_APP:
        return preferences.inAppEnabled;
      case NotificationChannel.WEBHOOK:
        return preferences.webhookEnabled;
      default:
        return true;
    }
  }

  // ==================== CATEGORY MANAGEMENT ====================

  async enableCategory(userId: string, category: NotificationCategory): Promise<IUserNotificationPreferences> {
    const preferences = await this.getPreferencesOrCreate(userId);
    const categories = { ...preferences.categories };
    categories[category] = true;

    return this.updatePreferences(userId, { categories });
  }

  async disableCategory(userId: string, category: NotificationCategory): Promise<IUserNotificationPreferences> {
    const preferences = await this.getPreferencesOrCreate(userId);
    const categories = { ...preferences.categories };
    categories[category] = false;

    return this.updatePreferences(userId, { categories });
  }

  async isCategoryEnabled(userId: string, category: NotificationCategory): Promise<boolean> {
    const preferences = await this.getPreferences(userId);

    if (!preferences) {
      return true; // Padrão é habilitado
    }

    return preferences.categories[category] ?? true;
  }

  // ==================== QUIET HOURS ====================

  async setQuietHours(
    userId: string,
    startTime: string,
    endTime: string,
  ): Promise<IUserNotificationPreferences> {
    this.validateTimeFormat(startTime);
    this.validateTimeFormat(endTime);

    return this.updatePreferences(userId, {
      quietHoursStart: startTime,
      quietHoursEnd: endTime,
    });
  }

  async clearQuietHours(userId: string): Promise<IUserNotificationPreferences> {
    return this.updatePreferences(userId, {
      quietHoursStart: undefined,
      quietHoursEnd: undefined,
    });
  }

  async isInQuietHours(userId: string): Promise<boolean> {
    const preferences = await this.getPreferences(userId);

    if (!preferences || !preferences.quietHoursStart || !preferences.quietHoursEnd) {
      return false;
    }

    const now = new Date();
    const currentTime = now.toLocaleTimeString('pt-BR', { 
      hour12: false, 
      timeZone: preferences.timezone 
    });

    return currentTime >= preferences.quietHoursStart && currentTime <= preferences.quietHoursEnd;
  }

  // ==================== DIGEST SETTINGS ====================

  async enableDigest(
    userId: string,
    frequency: DigestFrequency = DigestFrequency.DAILY,
    time: string = '09:00',
  ): Promise<IUserNotificationPreferences> {
    this.validateTimeFormat(time);

    return this.updatePreferences(userId, {
      digestEnabled: true,
      digestFrequency: frequency,
      digestTime: time,
    });
  }

  async disableDigest(userId: string): Promise<IUserNotificationPreferences> {
    return this.updatePreferences(userId, {
      digestEnabled: false,
    });
  }

  async setDigestFrequency(
    userId: string,
    frequency: DigestFrequency,
  ): Promise<IUserNotificationPreferences> {
    return this.updatePreferences(userId, {
      digestFrequency: frequency,
    });
  }

  async setDigestTime(userId: string, time: string): Promise<IUserNotificationPreferences> {
    this.validateTimeFormat(time);

    return this.updatePreferences(userId, {
      digestTime: time,
    });
  }

  // ==================== WEBHOOK MANAGEMENT ====================

  async setWebhookUrl(userId: string, url: string): Promise<IUserNotificationPreferences> {
    this.validateWebhookUrl(url);

    return this.updatePreferences(userId, {
      webhookUrl: url,
      webhookEnabled: true,
    });
  }

  async removeWebhookUrl(userId: string): Promise<IUserNotificationPreferences> {
    return this.updatePreferences(userId, {
      webhookUrl: undefined,
      webhookEnabled: false,
    });
  }

  // ==================== BULK OPERATIONS ====================

  async getUsersByPreferences(
    channel?: NotificationChannel,
    category?: NotificationCategory,
    frequency?: NotificationFrequency,
  ): Promise<string[]> {
    const where: any = {};

    if (channel) {
      switch (channel) {
        case NotificationChannel.EMAIL:
          where.emailEnabled = true;
          break;
        case NotificationChannel.SMS:
          where.smsEnabled = true;
          break;
        case NotificationChannel.PUSH:
          where.pushEnabled = true;
          break;
        case NotificationChannel.IN_APP:
          where.inAppEnabled = true;
          break;
        case NotificationChannel.WEBHOOK:
          where.webhookEnabled = true;
          break;
      }
    }

    if (frequency) {
      where.frequency = frequency;
    }

    const preferences = await this.prisma.userNotificationPreferences.findMany({
      where,
      select: { userId: true, categories: true },
    });

    let userIds = preferences.map(p => p.userId);

    // Filtrar por categoria se especificado
    if (category) {
      const filteredPreferences = preferences.filter(p => {
        const categories = p.categories as Record<string, boolean>;
        return categories[category] !== false;
      });
      userIds = filteredPreferences.map(p => p.userId);
    }

    return userIds;
  }

  async getUsersInQuietHours(): Promise<string[]> {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('pt-BR', { hour12: false });

    const preferences = await this.prisma.userNotificationPreferences.findMany({
      where: {
        quietHoursStart: { not: null },
        quietHoursEnd: { not: null },
      },
    });

    return preferences
      .filter(p => {
        if (!p.quietHoursStart || !p.quietHoursEnd) return false;
        
        // Converter para o timezone do usuário
        const userTime = now.toLocaleTimeString('pt-BR', { 
          hour12: false, 
          timeZone: p.timezone 
        });
        
        return userTime >= p.quietHoursStart && userTime <= p.quietHoursEnd;
      })
      .map(p => p.userId);
  }

  // ==================== VALIDATION ====================

  private validatePreferences(dto: CreateUserNotificationPreferencesDto | UpdateUserNotificationPreferencesDto): void {
    if (dto.quietHoursStart && dto.quietHoursEnd) {
      this.validateTimeFormat(dto.quietHoursStart);
      this.validateTimeFormat(dto.quietHoursEnd);
    }

    if (dto.digestTime) {
      this.validateTimeFormat(dto.digestTime);
    }

    if (dto.webhookUrl) {
      this.validateWebhookUrl(dto.webhookUrl);
    }

    if (dto.timezone && !this.isValidTimezone(dto.timezone)) {
      throw new BadRequestException('Timezone inválido');
    }

    if (dto.language && !this.isValidLanguage(dto.language)) {
      throw new BadRequestException('Idioma inválido');
    }
  }

  private validateTimeFormat(time: string): void {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      throw new BadRequestException('Formato de hora inválido. Use HH:MM');
    }
  }

  private validateWebhookUrl(url: string): void {
    try {
      new URL(url);
    } catch {
      throw new BadRequestException('URL do webhook inválida');
    }
  }

  private isValidTimezone(timezone: string): boolean {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone });
      return true;
    } catch {
      return false;
    }
  }

  private isValidLanguage(language: string): boolean {
    const validLanguages = ['pt-BR', 'en-US', 'es-ES'];
    return validLanguages.includes(language);
  }

  // ==================== DEFAULTS ====================

  private getDefaultCategories(): Record<string, boolean> {
    return {
      [NotificationCategory.URGENT]: true,
      [NotificationCategory.IMPORTANT]: true,
      [NotificationCategory.INFO]: true,
      [NotificationCategory.WARNING]: true,
      [NotificationCategory.SUCCESS]: true,
      [NotificationCategory.ERROR]: true,
      [NotificationCategory.PROMOTIONAL]: false,
    };
  }

  private getDefaultChannels(): Record<string, boolean> {
    return {
      [NotificationChannel.EMAIL]: true,
      [NotificationChannel.SMS]: false,
      [NotificationChannel.PUSH]: true,
      [NotificationChannel.IN_APP]: true,
      [NotificationChannel.WEBHOOK]: false,
    };
  }

  // ==================== STATISTICS ====================

  async getPreferencesStatistics(): Promise<{
    totalUsers: number;
    usersWithPreferences: number;
    channelStats: Record<string, number>;
    categoryStats: Record<string, number>;
    frequencyStats: Record<string, number>;
  }> {
    const [totalUsers, preferences] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.userNotificationPreferences.findMany(),
    ]);

    const channelStats = {
      email: 0,
      sms: 0,
      push: 0,
      inApp: 0,
      webhook: 0,
    };

    const categoryStats: Record<string, number> = {};
    const frequencyStats: Record<string, number> = {};

    preferences.forEach(pref => {
      // Canal stats
      if (pref.emailEnabled) channelStats.email++;
      if (pref.smsEnabled) channelStats.sms++;
      if (pref.pushEnabled) channelStats.push++;
      if (pref.inAppEnabled) channelStats.inApp++;
      if (pref.webhookEnabled) channelStats.webhook++;

      // Categoria stats
      const categories = pref.categories as Record<string, boolean>;
      Object.entries(categories).forEach(([category, enabled]) => {
        if (enabled) {
          categoryStats[category] = (categoryStats[category] || 0) + 1;
        }
      });

      // Frequência stats
      frequencyStats[pref.frequency] = (frequencyStats[pref.frequency] || 0) + 1;
    });

    return {
      totalUsers,
      usersWithPreferences: preferences.length,
      channelStats,
      categoryStats,
      frequencyStats,
    };
  }
}
