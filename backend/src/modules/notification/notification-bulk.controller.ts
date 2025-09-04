import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../../enums/user-type.enum';
import { NotificationBulkService } from './notification-bulk.service';
import {
  NotificationType,
  NotificationCategory,
  NotificationPriority,
  NotificationChannel,
} from '../../types/notification.types';
import type {
  BulkNotificationData,
  BulkNotificationResult,
} from '../../types/notification.types';

@ApiTags('Notificações em Lote')
@Controller('notification-bulk')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserType.LIBRARIAN, UserType.ADMIN)
@ApiBearerAuth()
export class NotificationBulkController {
  constructor(
    private readonly bulkService: NotificationBulkService,
  ) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enviar notificações em lote' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notificações enviadas em lote' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos' })
  async sendBulkNotifications(@Body() data: BulkNotificationData): Promise<BulkNotificationResult> {
    return this.bulkService.sendBulkNotifications(data);
  }

  @Post('schedule')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Agendar notificações em lote' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notificações agendadas em lote' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos' })
  async scheduleBulkNotifications(
    @Body() body: {
      data: BulkNotificationData;
      scheduledFor: string; // ISO date string
    },
  ): Promise<BulkNotificationResult> {
    const scheduledFor = new Date(body.scheduledFor);
    return this.bulkService.scheduleBulkNotifications(body.data, scheduledFor);
  }

  @Post('send-to-group')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enviar notificações para grupo de usuários' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notificações enviadas para grupo' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos' })
  async sendToUserGroup(
    @Body() body: {
      groupCriteria: {
        userType?: string;
        department?: string;
        course?: string;
        level?: string;
        active?: boolean;
        hasLoans?: boolean;
        hasFines?: boolean;
        lastActivityDays?: number;
      };
      notificationData: Omit<BulkNotificationData, 'userIds'>;
    },
  ): Promise<BulkNotificationResult> {
    return this.bulkService.sendToUserGroup(body.groupCriteria, body.notificationData);
  }

  @Post('send-to-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enviar notificações para todos os usuários ativos' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notificações enviadas para todos os usuários' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos' })
  async sendToAllUsers(
    @Body() notificationData: Omit<BulkNotificationData, 'userIds'>,
  ): Promise<BulkNotificationResult> {
    return this.bulkService.sendToAllUsers(notificationData);
  }

  @Post('send-to-users-with-loans')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enviar notificações para usuários com empréstimos ativos' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notificações enviadas para usuários com empréstimos' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos' })
  async sendToUsersWithLoans(
    @Body() notificationData: Omit<BulkNotificationData, 'userIds'>,
  ): Promise<BulkNotificationResult> {
    return this.bulkService.sendToUsersWithLoans(notificationData);
  }

  @Post('send-to-users-with-fines')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enviar notificações para usuários com multas pendentes' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notificações enviadas para usuários com multas' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos' })
  async sendToUsersWithFines(
    @Body() notificationData: Omit<BulkNotificationData, 'userIds'>,
  ): Promise<BulkNotificationResult> {
    return this.bulkService.sendToUsersWithFines(notificationData);
  }

  @Post('statistics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obter estatísticas de operações em lote' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Estatísticas de operações em lote' })
  async getBulkOperationStatistics(): Promise<{
    totalBulkOperations: number;
    totalNotificationsSent: number;
    averageSuccessRate: number;
    byChannel: Record<string, number>;
    byType: Record<string, number>;
  }> {
    return this.bulkService.getBulkOperationStatistics();
  }
}
