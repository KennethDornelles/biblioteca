import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { NotificationJobData, NotificationJobResult, NotificationType } from '../interfaces/queue.interfaces';
import { NotificationService } from '../../notification/notification.service';

@Processor('notification')
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private readonly notificationService: NotificationService) {}

  @Process('send-notification')
  async handleSendNotification(job: Job<NotificationJobData>): Promise<NotificationJobResult> {
    const { data } = job;
    const startTime = Date.now();

    this.logger.log(`Processing notification job ${job.id}: ${data.type} to user ${data.userId}`);

    try {
      // Atualizar progresso do job
      await job.progress(25);

      // Validar dados da notificação
      this.validateNotificationData(data);

      await job.progress(50);

      // Enviar notificação baseada no tipo
      let result: NotificationJobResult;

      switch (data.type) {
        case NotificationType.PUSH:
          result = await this.sendPushNotification(data);
          break;
        case NotificationType.SMS:
          result = await this.sendSMSNotification(data);
          break;
        case NotificationType.IN_APP:
          result = await this.sendInAppNotification(data);
          break;
        case NotificationType.WEBHOOK:
          result = await this.sendWebhookNotification(data);
          break;
        default:
          throw new Error(`Tipo de notificação não suportado: ${data.type}`);
      }

      await job.progress(100);

      const processingTime = Date.now() - startTime;
      this.logger.log(`Notification job ${job.id} completed successfully in ${processingTime}ms`);

      return result;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      this.logger.error(`Notification job ${job.id} failed after ${processingTime}ms: ${error.message}`);

      // Retry logic é gerenciada pelo Bull
      throw error;
    }
  }

  private validateNotificationData(data: NotificationJobData): void {
    if (!data.userId || data.userId.trim().length === 0) {
      throw new Error('ID do usuário é obrigatório');
    }

    if (!data.title || data.title.trim().length === 0) {
      throw new Error('Título é obrigatório');
    }

    if (!data.message || data.message.trim().length === 0) {
      throw new Error('Mensagem é obrigatória');
    }

    if (data.expiresAt && data.expiresAt <= new Date()) {
      throw new Error('Data de expiração deve ser futura');
    }
  }

  private async sendPushNotification(data: NotificationJobData): Promise<NotificationJobResult> {
    try {
      const notificationId = await this.notificationService.sendPushNotification(
        data.userId,
        data.title,
        data.message,
        data.data
      );

      return {
        success: true,
        notificationId,
        sentAt: new Date(),
        deliveryStatus: 'delivered',
      };
    } catch (error) {
      this.logger.error(`Failed to send push notification: ${error.message}`);
      throw error;
    }
  }

  private async sendSMSNotification(data: NotificationJobData): Promise<NotificationJobResult> {
    try {
      const notificationId = await this.notificationService.sendSMSNotification(
        data.userId,
        data.message,
        data.data
      );

      return {
        success: true,
        notificationId,
        sentAt: new Date(),
        deliveryStatus: 'delivered',
      };
    } catch (error) {
      this.logger.error(`Failed to send SMS notification: ${error.message}`);
      throw error;
    }
  }

  private async sendInAppNotification(data: NotificationJobData): Promise<NotificationJobResult> {
    try {
      const notificationId = await this.notificationService.sendInAppNotification(
        data.userId,
        data.title,
        data.message,
        data.data,
        data.expiresAt
      );

      return {
        success: true,
        notificationId,
        sentAt: new Date(),
        deliveryStatus: 'delivered',
      };
    } catch (error) {
      this.logger.error(`Failed to send in-app notification: ${error.message}`);
      throw error;
    }
  }

  private async sendWebhookNotification(data: NotificationJobData): Promise<NotificationJobResult> {
    try {
      const notificationId = await this.notificationService.sendWebhookNotification(
        data.userId,
        data.title,
        data.message,
        data.data
      );

      return {
        success: true,
        notificationId,
        sentAt: new Date(),
        deliveryStatus: 'delivered',
      };
    } catch (error) {
      this.logger.error(`Failed to send webhook notification: ${error.message}`);
      throw error;
    }
  }
}
