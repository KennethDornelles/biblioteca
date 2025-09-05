import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../../enums/user-type.enum';
import { AdvancedNotificationService } from './advanced-notification.service';
import type {
  CreateNotificationDto,
  UpdateNotificationDto,
  NotificationQuery,
  NotificationResponse,
  NotificationMetrics,
} from '../../types/notification.types';

@ApiTags('Notificações')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(
    private readonly notificationService: AdvancedNotificationService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  @ApiOperation({ summary: 'Criar nova notificação' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Notificação criada com sucesso' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuário não encontrado' })
  async createNotification(@Body() dto: CreateNotificationDto): Promise<NotificationResponse> {
    const notification = await this.notificationService.createNotification(dto);
    return notification as NotificationResponse;
  }

  @Get()
  @ApiOperation({ summary: 'Listar notificações' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de notificações' })
  @ApiQuery({ name: 'userId', required: false, description: 'ID do usuário' })
  @ApiQuery({ name: 'type', required: false, description: 'Tipo da notificação' })
  @ApiQuery({ name: 'category', required: false, description: 'Categoria da notificação' })
  @ApiQuery({ name: 'priority', required: false, description: 'Prioridade da notificação' })
  @ApiQuery({ name: 'status', required: false, description: 'Status da notificação' })
  @ApiQuery({ name: 'channel', required: false, description: 'Canal da notificação' })
  @ApiQuery({ name: 'isRead', required: false, description: 'Se a notificação foi lida' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limite de resultados' })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset para paginação' })
  async getNotifications(@Query() query: NotificationQuery): Promise<NotificationResponse[]> {
    const notifications = await this.notificationService.getNotifications(query);
    return notifications as NotificationResponse[];
  }

  @Get('metrics')
  @UseGuards(RolesGuard)
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  @ApiOperation({ summary: 'Obter métricas de notificações' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Métricas de notificações' })
  @ApiQuery({ name: 'from', required: false, description: 'Data inicial' })
  @ApiQuery({ name: 'to', required: false, description: 'Data final' })
  @ApiQuery({ name: 'type', required: false, description: 'Tipo da notificação' })
  @ApiQuery({ name: 'channel', required: false, description: 'Canal da notificação' })
  async getNotificationMetrics(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('type') type?: string,
    @Query('channel') channel?: string,
  ): Promise<NotificationMetrics> {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;
    
    return this.notificationService.getNotificationMetrics(fromDate, toDate, type as any, channel as any);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter notificação por ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notificação encontrada' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Notificação não encontrada' })
  async getNotification(@Param('id', ParseUUIDPipe) id: string): Promise<NotificationResponse> {
    const notification = await this.notificationService.getNotification(id);
    return notification as NotificationResponse;
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  @ApiOperation({ summary: 'Atualizar notificação' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notificação atualizada com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Notificação não encontrada' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos' })
  async updateNotification(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNotificationDto,
  ): Promise<NotificationResponse> {
    const notification = await this.notificationService.updateNotification(id, dto);
    return notification as NotificationResponse;
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancelar notificação' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Notificação cancelada com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Notificação não encontrada' })
  async cancelNotification(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.notificationService.deleteNotification(id);
  }

  @Post(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marcar notificação como lida' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notificação marcada como lida' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Notificação não encontrada' })
  async markAsRead(@Param('id', ParseUUIDPipe) id: string): Promise<NotificationResponse> {
    const notification = await this.notificationService.updateNotification(id, {
      readAt: new Date(),
    });
    return notification as NotificationResponse;
  }

  @Post(':id/track')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rastrear evento de notificação' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Evento rastreado com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Notificação não encontrada' })
  async trackNotificationEvent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { event: string; metadata?: Record<string, any> },
  ): Promise<void> {
    const notification = await this.notificationService.getNotification(id);
    await this.notificationService.trackNotificationEvent(
      id,
      notification.userId,
      body.event as any,
      body.metadata,
    );
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obter notificações de um usuário' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notificações do usuário' })
  @ApiQuery({ name: 'unreadOnly', required: false, description: 'Apenas não lidas' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limite de resultados' })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset para paginação' })
  async getUserNotifications(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query('unreadOnly') unreadOnly?: boolean,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<NotificationResponse[]> {
    const query: NotificationQuery = {
      userId,
      isRead: unreadOnly ? false : undefined,
      limit: limit ? parseInt(limit.toString()) : 50,
      offset: offset ? parseInt(offset.toString()) : 0,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    };

    const notifications = await this.notificationService.getNotifications(query);
    return notifications as NotificationResponse[];
  }

  @Post('user/:userId/read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marcar todas as notificações do usuário como lidas' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notificações marcadas como lidas' })
  async markAllAsRead(@Param('userId', ParseUUIDPipe) userId: string): Promise<{ count: number }> {
    // Implementar lógica para marcar todas como lidas
    const notifications = await this.notificationService.getNotifications({
      userId,
      isRead: false,
    });

    let count = 0;
    for (const notification of notifications) {
      await this.notificationService.updateNotification(notification.id, {
        readAt: new Date(),
      });
      count++;
    }

    return { count };
  }

  @Get('user/:userId/unread-count')
  @ApiOperation({ summary: 'Obter contagem de notificações não lidas' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Contagem de notificações não lidas' })
  async getUnreadCount(@Param('userId', ParseUUIDPipe) userId: string): Promise<{ count: number }> {
    const notifications = await this.notificationService.getNotifications({
      userId,
      isRead: false,
    });

    return { count: notifications.length };
  }
}
