import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma, PrismaClient } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  INotification,
  NotificationStatus,
  NotificationPriority,
  NotificationType,
  NotificationChannel,
  NotificationSchedule,
} from '../../types/notification.types';

@Injectable()
export class NotificationSchedulerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationSchedulerService.name);
  private prisma: PrismaClient;
  private schedulerInterval: NodeJS.Timeout;
  private isRunning = false;

  constructor(private readonly eventEmitter: EventEmitter2) {
    this.prisma = new PrismaClient();
  }

  async onModuleInit() {
    this.logger.log('Iniciando serviço de agendamento de notificações');
    await this.initializeScheduler();
  }

  async onModuleDestroy() {
    this.logger.log('Parando serviço de agendamento de notificações');
    if (this.schedulerInterval) {
      clearInterval(this.schedulerInterval);
    }
  }

  // ==================== SCHEDULER INITIALIZATION ====================

  private async initializeScheduler(): Promise<void> {
    // Iniciar o scheduler principal
    this.schedulerInterval = setInterval(async () => {
      if (!this.isRunning) {
        await this.processScheduledNotifications();
      }
    }, 60000); // Executar a cada minuto

    // Processar notificações pendentes na inicialização
    await this.processScheduledNotifications();
  }

  // ==================== CRON JOBS ====================

  @Cron(CronExpression.EVERY_MINUTE)
  async processScheduledNotifications(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    try {
      await this.processDueNotifications();
    } catch (error) {
      this.logger.error(`Erro ao processar notificações agendadas: ${error.message}`);
    } finally {
      this.isRunning = false;
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async processRecurringNotifications(): Promise<void> {
    try {
      await this.processRecurringSchedules();
    } catch (error) {
      this.logger.error(`Erro ao processar notificações recorrentes: ${error.message}`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpiredNotifications(): Promise<void> {
    try {
      const count = await this.cleanupExpired();
      if (count > 0) {
        this.logger.log(`${count} notificações expiradas foram removidas`);
      }
    } catch (error) {
      this.logger.error(`Erro ao limpar notificações expiradas: ${error.message}`);
    }
  }

  // ==================== SCHEDULING METHODS ====================

  async scheduleNotification(
    notificationId: string,
    scheduledFor: Date,
    recurrence?: {
      type: 'daily' | 'weekly' | 'monthly' | 'yearly';
      interval: number;
      daysOfWeek?: number[];
      dayOfMonth?: number;
      endDate?: Date;
    },
  ): Promise<void> {
    try {
      // Verificar se a notificação existe
      const notification = await this.prisma.notification.findUnique({
        where: { id: notificationId },
      });

      if (!notification) {
        throw new Error(`Notificação ${notificationId} não encontrada`);
      }

      // Atualizar status da notificação
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: NotificationStatus.SCHEDULED,
          scheduledFor,
          updatedAt: new Date(),
        },
      });

      // Criar agendamento recorrente se especificado
      if (recurrence) {
        await this.createRecurringSchedule(notificationId, scheduledFor, recurrence);
      }

      this.logger.log(`Notificação ${notificationId} agendada para ${scheduledFor.toISOString()}`);
    } catch (error) {
      this.logger.error(`Erro ao agendar notificação: ${error.message}`);
      throw error;
    }
  }

  async rescheduleNotification(notificationId: string, newScheduledFor: Date): Promise<void> {
    try {
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: {
          scheduledFor: newScheduledFor,
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Notificação ${notificationId} reagendada para ${newScheduledFor.toISOString()}`);
    } catch (error) {
      this.logger.error(`Erro ao reagendar notificação: ${error.message}`);
      throw error;
    }
  }

  async cancelScheduledNotification(notificationId: string): Promise<void> {
    try {
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: NotificationStatus.CANCELLED,
          scheduledFor: null,
          updatedAt: new Date(),
        },
      });

      // Cancelar agendamentos recorrentes
      await this.cancelRecurringSchedules(notificationId);

      this.logger.log(`Notificação agendada ${notificationId} cancelada`);
    } catch (error) {
      this.logger.error(`Erro ao cancelar notificação agendada: ${error.message}`);
      throw error;
    }
  }

  // ==================== RECURRING SCHEDULES ====================

  private async createRecurringSchedule(
    notificationId: string,
    scheduledFor: Date,
    recurrence: {
      type: 'daily' | 'weekly' | 'monthly' | 'yearly';
      interval: number;
      daysOfWeek?: number[];
      dayOfMonth?: number;
      endDate?: Date;
    },
  ): Promise<void> {
    // Implementar criação de agendamento recorrente
    // Por enquanto, vamos simular com uma tabela de agendamentos
    const scheduleData = {
      notificationId,
      scheduledFor,
      recurrence: JSON.stringify(recurrence),
      isActive: true,
    };

    // Aqui você criaria um registro na tabela de agendamentos recorrentes
    this.logger.log(`Agendamento recorrente criado para notificação ${notificationId}`);
  }

  private async cancelRecurringSchedules(notificationId: string): Promise<void> {
    // Implementar cancelamento de agendamentos recorrentes
    this.logger.log(`Agendamentos recorrentes cancelados para notificação ${notificationId}`);
  }

  // ==================== PROCESSING METHODS ====================

  private async processDueNotifications(): Promise<void> {
    const now = new Date();
    const dueNotifications = await this.prisma.notification.findMany({
      where: {
        status: NotificationStatus.SCHEDULED,
        scheduledFor: {
          lte: now,
        },
      },
      take: 100, // Processar em lotes
    });

    if (dueNotifications.length === 0) {
      return;
    }

    this.logger.log(`Processando ${dueNotifications.length} notificações devidas`);

    for (const notification of dueNotifications) {
      try {
        await this.processNotification(notification);
      } catch (error) {
        this.logger.error(`Erro ao processar notificação ${notification.id}: ${error.message}`);
        await this.handleNotificationError(notification, error);
      }
    }
  }

  private async processNotification(notification: any): Promise<void> {
    // Atualizar status para enviando
    await this.prisma.notification.update({
      where: { id: notification.id },
      data: {
        status: NotificationStatus.SENDING,
        updatedAt: new Date(),
      },
    });

    // Emitir evento para processamento
    this.eventEmitter.emit('notification.send', {
      notificationId: notification.id,
      userId: notification.userId,
      channel: notification.channel,
      priority: notification.priority,
      title: notification.title,
      message: notification.message,
      data: notification.data,
    });

    // Marcar como enviada
    await this.prisma.notification.update({
      where: { id: notification.id },
      data: {
        status: NotificationStatus.SENT,
        sentAt: new Date(),
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Notificação ${notification.id} processada e enviada`);
  }

  private async handleNotificationError(notification: any, error: Error): Promise<void> {
    const retryCount = notification.retryCount + 1;
    const maxRetries = notification.maxRetries;

    if (retryCount >= maxRetries) {
      // Marcar como falhada
      await this.prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: NotificationStatus.FAILED,
          errorMessage: error.message,
          retryCount,
          updatedAt: new Date(),
        },
      });

      this.logger.error(`Notificação ${notification.id} falhou após ${retryCount} tentativas`);
    } else {
      // Reagendar para retry
      const retryDelay = this.calculateRetryDelay(retryCount);
      const retryTime = new Date(Date.now() + retryDelay);

      await this.prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: NotificationStatus.SCHEDULED,
          scheduledFor: retryTime,
          retryCount,
          errorMessage: error.message,
          updatedAt: new Date(),
        },
      });

      this.logger.warn(`Notificação ${notification.id} reagendada para retry em ${retryTime.toISOString()}`);
    }
  }

  private calculateRetryDelay(retryCount: number): number {
    // Backoff exponencial: 1min, 5min, 15min, 30min, 1h
    const delays = [60000, 300000, 900000, 1800000, 3600000];
    return delays[Math.min(retryCount - 1, delays.length - 1)];
  }

  private async processRecurringSchedules(): Promise<void> {
    // Implementar processamento de agendamentos recorrentes
    this.logger.log('Processando agendamentos recorrentes');
  }

  // ==================== UTILITY METHODS ====================

  async getScheduledNotifications(
    userId?: string,
    from?: Date,
    to?: Date,
    limit: number = 50,
  ): Promise<INotification[]> {
    const where: any = {
      status: NotificationStatus.SCHEDULED,
    };

    if (userId) where.userId = userId;
    if (from || to) {
      where.scheduledFor = {};
      if (from) where.scheduledFor.gte = from;
      if (to) where.scheduledFor.lte = to;
    }

    const notifications = await this.prisma.notification.findMany({
      where,
      orderBy: { scheduledFor: 'asc' },
      take: limit,
    });

    return notifications as INotification[];
  }

  async getNextScheduledNotification(userId: string): Promise<INotification | null> {
    const notification = await this.prisma.notification.findFirst({
      where: {
        userId,
        status: NotificationStatus.SCHEDULED,
        scheduledFor: {
          gte: new Date(),
        },
      },
      orderBy: { scheduledFor: 'asc' },
    });

    return notification as INotification | null;
  }

  async getScheduledNotificationsCount(userId?: string): Promise<number> {
    const where: any = {
      status: NotificationStatus.SCHEDULED,
    };

    if (userId) where.userId = userId;

    return this.prisma.notification.count({ where });
  }

  // ==================== BULK OPERATIONS ====================

  async scheduleBulkNotifications(
    notifications: Array<{
      id: string;
      scheduledFor: Date;
    }>,
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    const result: { success: number; failed: number; errors: string[] } = { success: 0, failed: 0, errors: [] };

    for (const { id, scheduledFor } of notifications) {
      try {
        await this.scheduleNotification(id, scheduledFor);
        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push(`${id}: ${error.message}`);
      }
    }

    this.logger.log(`Agendamento em lote: ${result.success} sucessos, ${result.failed} falhas`);
    return result;
  }

  async cancelBulkNotifications(notificationIds: string[]): Promise<{ success: number; failed: number; errors: string[] }> {
    const result: { success: number; failed: number; errors: string[] } = { success: 0, failed: 0, errors: [] };

    for (const id of notificationIds) {
      try {
        await this.cancelScheduledNotification(id);
        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push(`${id}: ${error.message}`);
      }
    }

    this.logger.log(`Cancelamento em lote: ${result.success} sucessos, ${result.failed} falhas`);
    return result;
  }

  // ==================== CLEANUP ====================

  private async cleanupExpired(): Promise<number> {
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

    return result.count;
  }

  // ==================== STATISTICS ====================

  async getSchedulerStatistics(): Promise<{
    totalScheduled: number;
    dueNow: number;
    overdue: number;
    byPriority: Record<string, number>;
    byChannel: Record<string, number>;
    byType: Record<string, number>;
  }> {
    const now = new Date();

    const [
      totalScheduled,
      dueNow,
      overdue,
      byPriority,
      byChannel,
      byType,
    ] = await Promise.all([
      this.prisma.notification.count({
        where: { status: NotificationStatus.SCHEDULED },
      }),
      this.prisma.notification.count({
        where: {
          status: NotificationStatus.SCHEDULED,
          scheduledFor: { lte: now },
        },
      }),
      this.prisma.notification.count({
        where: {
          status: NotificationStatus.SCHEDULED,
          scheduledFor: { lt: new Date(now.getTime() - 300000) }, // 5 minutos atrás
        },
      }),
      this.getScheduledCountByField('priority'),
      this.getScheduledCountByField('channel'),
      this.getScheduledCountByField('type'),
    ]);

    return {
      totalScheduled,
      dueNow,
      overdue,
      byPriority,
      byChannel,
      byType,
    };
  }

  private async getScheduledCountByField(
    field: Prisma.NotificationScalarFieldEnum,
  ): Promise<Record<string, number>> {
    const results = await this.prisma.notification.groupBy({
      by: [field],
      where: { status: NotificationStatus.SCHEDULED },
      _count: { [field]: true },
    });

    return results.reduce((acc, result) => {
      if (result._count) {
        const key = String(result[field]);
        acc[key] = result._count[field];
      }
      return acc;
    }, {});
  }

  // ==================== HEALTH CHECK ====================

  async getSchedulerHealth(): Promise<{
    isRunning: boolean;
    lastProcessed: Date | null;
    queueSize: number;
    overdueCount: number;
    errorRate: number;
  }> {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 3600000);

    const [queueSize, overdueCount, recentErrors] = await Promise.all([
      this.prisma.notification.count({
        where: { status: NotificationStatus.SCHEDULED },
      }),
      this.prisma.notification.count({
        where: {
          status: NotificationStatus.SCHEDULED,
          scheduledFor: { lt: new Date(now.getTime() - 300000) },
        },
      }),
      this.prisma.notification.count({
        where: {
          status: NotificationStatus.FAILED,
          updatedAt: { gte: oneHourAgo },
        },
      }),
    ]);

    const totalProcessed = await this.prisma.notification.count({
      where: {
        status: { in: [NotificationStatus.SENT, NotificationStatus.FAILED] },
        updatedAt: { gte: oneHourAgo },
      },
    });

    const errorRate = totalProcessed > 0 ? (recentErrors / totalProcessed) * 100 : 0;

    return {
      isRunning: this.isRunning,
      lastProcessed: null, // Implementar tracking do último processamento
      queueSize,
      overdueCount,
      errorRate,
    };
  }
}
