import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, DevicePlatform } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  PushNotificationPayload,
  DeviceToken,
  NotificationChannel,
  NotificationPriority,
} from '../../types/notification.types';

// Simulação do Firebase Admin SDK (em produção, instalar: npm install firebase-admin)
interface FirebaseMessaging {
  send(message: any): Promise<string>;
  sendMulticast(message: any): Promise<any>;
  sendToDevice(registrationToken: string, payload: any): Promise<any>;
}

@Injectable()
export class PushNotificationService {
  private readonly logger = new Logger(PushNotificationService.name);
  private prisma: PrismaClient;
  private firebaseMessaging: FirebaseMessaging;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.prisma = new PrismaClient();
    this.initializeFirebase();
  }

  // ==================== FIREBASE INITIALIZATION ====================

  private async initializeFirebase(): Promise<void> {
    try {
      // Em produção, inicializar o Firebase Admin SDK
      // const admin = require('firebase-admin');
      // const serviceAccount = require('path/to/serviceAccountKey.json');
      
      // admin.initializeApp({
      //   credential: admin.credential.cert(serviceAccount),
      // });

      // this.firebaseMessaging = admin.messaging();

      // Simulação para desenvolvimento
      this.firebaseMessaging = {
        send: async (message) => {
          this.logger.log(`[SIMULATED] Enviando push notification: ${JSON.stringify(message)}`);
          return `mock_message_id_${Date.now()}`;
        },
        sendMulticast: async (message) => {
          this.logger.log(`[SIMULATED] Enviando push multicast: ${JSON.stringify(message)}`);
          return {
            successCount: message.tokens.length,
            failureCount: 0,
            responses: message.tokens.map(() => ({ success: true, messageId: `mock_${Date.now()}` })),
          };
        },
        sendToDevice: async (token, payload) => {
          this.logger.log(`[SIMULATED] Enviando para dispositivo: ${token}`);
          return { success: true, messageId: `mock_${Date.now()}` };
        },
      };

      this.logger.log('Firebase Cloud Messaging inicializado');
    } catch (error) {
      this.logger.error(`Erro ao inicializar Firebase: ${error.message}`);
      throw error;
    }
  }

  // ==================== DEVICE TOKEN MANAGEMENT ====================

  async registerDeviceToken(
    userId: string,
    token: string,
    platform: 'ios' | 'android' | 'web',
  ): Promise<DeviceToken> {
    try {
      // Verificar se o token já existe
      const existingToken = await this.prisma.deviceToken.findFirst({
        where: { token },
      });

      const platformUpper = platform.toUpperCase() as DevicePlatform;

      if (existingToken) {
        // Atualizar o token existente
        const updatedToken = await this.prisma.deviceToken.update({
          where: { id: existingToken.id },
          data: {
            userId,
            platform: platformUpper,
            isActive: true,
            lastUsed: new Date(),
            updatedAt: new Date(),
          },
        });

        this.logger.log(`Token de dispositivo atualizado: ${token}`);
        return updatedToken as DeviceToken;
      } else {
        // Criar novo token
        const newToken = await this.prisma.deviceToken.create({
          data: {
            userId,
            token,
            platform: platformUpper,
            isActive: true,
            lastUsed: new Date(),
          },
        });

        this.logger.log(`Novo token de dispositivo registrado: ${token}`);
        return newToken as DeviceToken;
      }
    } catch (error) {
      this.logger.error(`Erro ao registrar token de dispositivo: ${error.message}`);
      throw error;
    }
  }

  async unregisterDeviceToken(token: string): Promise<void> {
    try {
      await this.prisma.deviceToken.updateMany({
        where: { token },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Token de dispositivo desregistrado: ${token}`);
    } catch (error) {
      this.logger.error(`Erro ao desregistrar token: ${error.message}`);
      throw error;
    }
  }

  async getUserDeviceTokens(userId: string): Promise<DeviceToken[]> {
    const tokens = await this.prisma.deviceToken.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: { lastUsed: 'desc' },
    });

    return tokens as DeviceToken[];
  }

  async getActiveDeviceTokens(userIds?: string[]): Promise<DeviceToken[]> {
    const where: any = { isActive: true };
    
    if (userIds && userIds.length > 0) {
      where.userId = { in: userIds };
    }

    const tokens = await this.prisma.deviceToken.findMany({
      where,
      orderBy: { lastUsed: 'desc' },
    });

    return tokens as DeviceToken[];
  }

  // ==================== PUSH NOTIFICATION SENDING ====================

  async sendPushNotification(
    userId: string,
    payload: PushNotificationPayload,
    priority: NotificationPriority = NotificationPriority.MEDIUM,
  ): Promise<string> {
    try {
      const deviceTokens = await this.getUserDeviceTokens(userId);

      if (deviceTokens.length === 0) {
        throw new BadRequestException('Usuário não possui tokens de dispositivo registrados');
      }

      const results = await Promise.allSettled(
        deviceTokens.map(token => this.sendToDevice(token.token, payload, priority))
      );

      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;

      this.logger.log(`Push notification enviada para usuário ${userId}: ${successful} sucessos, ${failed} falhas`);

      // Emitir evento de notificação enviada
      this.eventEmitter.emit('push.notification.sent', {
        userId,
        payload,
        successful,
        failed,
        deviceTokens: deviceTokens.length,
      });

      return `push_${Date.now()}_${userId}`;
    } catch (error) {
      this.logger.error(`Erro ao enviar push notification: ${error.message}`);
      throw error;
    }
  }

  async sendBulkPushNotifications(
    userIds: string[],
    payload: PushNotificationPayload,
    priority: NotificationPriority = NotificationPriority.MEDIUM,
  ): Promise<{
    success: number;
    failed: number;
    errors: Array<{ userId: string; error: string }>;
  }> {
    const result = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ userId: string; error: string }>,
    };

    this.logger.log(`Enviando push notifications em lote para ${userIds.length} usuários`);

    for (const userId of userIds) {
      try {
        await this.sendPushNotification(userId, payload, priority);
        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          userId,
          error: error.message,
        });
      }
    }

    this.logger.log(`Push notifications em lote concluídas: ${result.success} sucessos, ${result.failed} falhas`);
    return result;
  }

  async sendToDevice(
    token: string,
    payload: PushNotificationPayload,
    priority: NotificationPriority = NotificationPriority.MEDIUM,
  ): Promise<string> {
    try {
      const message = this.buildFirebaseMessage(token, payload, priority);
      const messageId = await this.firebaseMessaging.send(message);

      // Atualizar último uso do token
      await this.prisma.deviceToken.updateMany({
        where: { token },
        data: { lastUsed: new Date() },
      });

      this.logger.log(`Push notification enviada para dispositivo ${token}: ${messageId}`);
      return messageId;
    } catch (error) {
      this.logger.error(`Erro ao enviar para dispositivo ${token}: ${error.message}`);

      // Se o token for inválido, marcar como inativo
      if (this.isInvalidTokenError(error)) {
        await this.prisma.deviceToken.updateMany({
          where: { token },
          data: { isActive: false },
        });
        this.logger.warn(`Token inválido desativado: ${token}`);
      }

      throw error;
    }
  }

  async sendToMultipleDevices(
    tokens: string[],
    payload: PushNotificationPayload,
    priority: NotificationPriority = NotificationPriority.MEDIUM,
  ): Promise<{
    successCount: number;
    failureCount: number;
    responses: Array<{ success: boolean; messageId?: string; error?: string }>;
  }> {
    try {
      if (tokens.length === 0) {
        return { successCount: 0, failureCount: 0, responses: [] };
      }

      const message = this.buildFirebaseMulticastMessage(tokens, payload, priority);
      const result = await this.firebaseMessaging.sendMulticast(message);

      // Atualizar tokens bem-sucedidos
      const successfulTokens = tokens.filter((_, index) => result.responses[index]?.success);
      if (successfulTokens.length > 0) {
        await this.prisma.deviceToken.updateMany({
          where: { token: { in: successfulTokens } },
          data: { lastUsed: new Date() },
        });
      }

      // Desativar tokens com falha
      const failedTokens = tokens.filter((_, index) => !result.responses[index]?.success);
      if (failedTokens.length > 0) {
        await this.prisma.deviceToken.updateMany({
          where: { token: { in: failedTokens } },
          data: { isActive: false },
        });
      }

      this.logger.log(`Push multicast enviado: ${result.successCount} sucessos, ${result.failureCount} falhas`);
      return result;
    } catch (error) {
      this.logger.error(`Erro ao enviar push multicast: ${error.message}`);
      throw error;
    }
  }

  // ==================== MESSAGE BUILDING ====================

  private buildFirebaseMessage(
    token: string,
    payload: PushNotificationPayload,
    priority: NotificationPriority,
  ): any {
    const message: any = {
      token,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data || {},
      android: {
        priority: this.mapPriorityToAndroid(priority),
        notification: {
          icon: payload.icon || 'ic_notification',
          color: '#FF6B35',
          sound: payload.sound || 'default',
          clickAction: payload.clickAction,
          tag: payload.tag,
        },
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title: payload.title,
              body: payload.body,
            },
            sound: payload.sound || 'default',
            badge: payload.badge ? parseInt(payload.badge) : undefined,
            'content-available': payload.silent ? 1 : 0,
            'mutable-content': 1,
          },
        },
      },
      webpush: {
        notification: {
          title: payload.title,
          body: payload.body,
          icon: payload.icon || '/icon-192x192.png',
          badge: payload.badge || '/badge-72x72.png',
          requireInteraction: payload.requireInteraction || false,
          silent: payload.silent || false,
          vibrate: payload.vibrate || [200, 100, 200],
          actions: payload.actions || [],
        },
      },
    };

    return message;
  }

  private buildFirebaseMulticastMessage(
    tokens: string[],
    payload: PushNotificationPayload,
    priority: NotificationPriority,
  ): any {
    const message = this.buildFirebaseMessage(tokens[0], payload, priority);
    message.tokens = tokens;
    delete message.token;

    return message;
  }

  private mapPriorityToAndroid(priority: NotificationPriority): string {
    switch (priority) {
      case NotificationPriority.LOW:
        return 'normal';
      case NotificationPriority.MEDIUM:
        return 'normal';
      case NotificationPriority.HIGH:
        return 'high';
      case NotificationPriority.URGENT:
        return 'high';
      case NotificationPriority.CRITICAL:
        return 'high';
      default:
        return 'normal';
    }
  }

  // ==================== ERROR HANDLING ====================

  private isInvalidTokenError(error: any): boolean {
    const invalidTokenErrors = [
      'registration-token-not-registered',
      'invalid-registration-token',
      'messaging/registration-token-not-registered',
      'messaging/invalid-registration-token',
    ];

    return invalidTokenErrors.some(errorType => 
      error.message?.includes(errorType) || error.code?.includes(errorType)
    );
  }

  // ==================== TOPIC MANAGEMENT ====================

  async subscribeToTopic(userId: string, topic: string): Promise<void> {
    try {
      const deviceTokens = await this.getUserDeviceTokens(userId);
      
      if (deviceTokens.length === 0) {
        throw new BadRequestException('Usuário não possui tokens de dispositivo');
      }

      const tokens = deviceTokens.map(token => token.token);
      
      // Em produção, usar Firebase Admin SDK para subscription
      // await this.firebaseMessaging.subscribeToTopic(tokens, topic);
      
      this.logger.log(`Usuário ${userId} inscrito no tópico ${topic}`);
      
      // Emitir evento
      this.eventEmitter.emit('push.topic.subscribed', {
        userId,
        topic,
        deviceCount: tokens.length,
      });
    } catch (error) {
      this.logger.error(`Erro ao inscrever no tópico: ${error.message}`);
      throw error;
    }
  }

  async unsubscribeFromTopic(userId: string, topic: string): Promise<void> {
    try {
      const deviceTokens = await this.getUserDeviceTokens(userId);
      
      if (deviceTokens.length === 0) {
        return;
      }

      const tokens = deviceTokens.map(token => token.token);
      
      // Em produção, usar Firebase Admin SDK para unsubscription
      // await this.firebaseMessaging.unsubscribeFromTopic(tokens, topic);
      
      this.logger.log(`Usuário ${userId} desinscrito do tópico ${topic}`);
      
      // Emitir evento
      this.eventEmitter.emit('push.topic.unsubscribed', {
        userId,
        topic,
        deviceCount: tokens.length,
      });
    } catch (error) {
      this.logger.error(`Erro ao desinscrever do tópico: ${error.message}`);
      throw error;
    }
  }

  async sendToTopic(
    topic: string,
    payload: PushNotificationPayload,
    priority: NotificationPriority = NotificationPriority.MEDIUM,
  ): Promise<string> {
    try {
      const message = {
        topic,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data || {},
        android: {
          priority: this.mapPriorityToAndroid(priority),
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title: payload.title,
                body: payload.body,
              },
            },
          },
        },
      };

      const messageId = await this.firebaseMessaging.send(message);
      
      this.logger.log(`Push notification enviada para tópico ${topic}: ${messageId}`);
      
      // Emitir evento
      this.eventEmitter.emit('push.topic.message.sent', {
        topic,
        payload,
        messageId,
      });

      return messageId;
    } catch (error) {
      this.logger.error(`Erro ao enviar para tópico ${topic}: ${error.message}`);
      throw error;
    }
  }

  // ==================== STATISTICS ====================

  async getPushNotificationStatistics(): Promise<{
    totalTokens: number;
    activeTokens: number;
    byPlatform: Record<string, number>;
    recentActivity: number;
  }> {
    const [
      totalTokens,
      activeTokens,
      platformStats,
      recentActivity,
    ] = await Promise.all([
      this.prisma.deviceToken.count(),
      this.prisma.deviceToken.count({ where: { isActive: true } }),
      this.prisma.deviceToken.groupBy({
        by: ['platform'],
        _count: { platform: true },
        where: { isActive: true },
      }),
      this.prisma.deviceToken.count({
        where: {
          lastUsed: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24 horas
          },
        },
      }),
    ]);

    const byPlatform = platformStats.reduce((acc, stat) => {
      acc[stat.platform] = stat._count.platform;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalTokens,
      activeTokens,
      byPlatform,
      recentActivity,
    };
  }

  // ==================== CLEANUP ====================

  async cleanupInactiveTokens(daysInactive: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

    const result = await this.prisma.deviceToken.updateMany({
      where: {
        lastUsed: {
          lt: cutoffDate,
        },
        isActive: true,
      },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`${result.count} tokens inativos foram desativados`);
    return result.count;
  }
}
