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
import { NotificationPreferencesService } from './notification-preferences.service';
import {
  NotificationChannel,
  NotificationCategory,
  NotificationFrequency,
  DigestFrequency,
} from '../../types/notification.types';
import type {
  CreateUserNotificationPreferencesDto,
  UpdateUserNotificationPreferencesDto,
  UserNotificationPreferencesResponse,
} from '../../types/notification.types';

@ApiTags('Preferências de Notificação')
@Controller('notification-preferences')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationPreferencesController {
  constructor(
    private readonly preferencesService: NotificationPreferencesService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  @ApiOperation({ summary: 'Criar preferências de notificação para usuário' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Preferências criadas com sucesso' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuário não encontrado' })
  async createPreferences(@Body() dto: CreateUserNotificationPreferencesDto): Promise<UserNotificationPreferencesResponse> {
    const preferences = await this.preferencesService.createPreferences(dto);
    return preferences as UserNotificationPreferencesResponse;
  }

  @Get('statistics')
  @UseGuards(RolesGuard)
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  @ApiOperation({ summary: 'Obter estatísticas de preferências' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Estatísticas de preferências' })
  async getPreferencesStatistics(): Promise<{
    totalUsers: number;
    usersWithPreferences: number;
    channelStats: Record<string, number>;
    categoryStats: Record<string, number>;
    frequencyStats: Record<string, number>;
  }> {
    return this.preferencesService.getPreferencesStatistics();
  }

  @Get('users-by-criteria')
  @UseGuards(RolesGuard)
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  @ApiOperation({ summary: 'Obter usuários por critérios de preferências' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de IDs de usuários' })
  @ApiQuery({ name: 'channel', required: false, description: 'Canal de notificação' })
  @ApiQuery({ name: 'category', required: false, description: 'Categoria de notificação' })
  @ApiQuery({ name: 'frequency', required: false, description: 'Frequência de notificação' })
  async getUsersByPreferences(
    @Query('channel') channel?: NotificationChannel,
    @Query('category') category?: NotificationCategory,
    @Query('frequency') frequency?: NotificationFrequency,
  ): Promise<{ userIds: string[] }> {
    const userIds = await this.preferencesService.getUsersByPreferences(channel, category, frequency);
    return { userIds };
  }

  @Get('users-in-quiet-hours')
  @UseGuards(RolesGuard)
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  @ApiOperation({ summary: 'Obter usuários em horário de silêncio' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de IDs de usuários em horário de silêncio' })
  async getUsersInQuietHours(): Promise<{ userIds: string[] }> {
    const userIds = await this.preferencesService.getUsersInQuietHours();
    return { userIds };
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Obter preferências de notificação do usuário' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Preferências do usuário' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Preferências não encontradas' })
  async getPreferences(@Param('userId', ParseUUIDPipe) userId: string): Promise<UserNotificationPreferencesResponse | null> {
    const preferences = await this.preferencesService.getPreferences(userId);
    return preferences as UserNotificationPreferencesResponse | null;
  }

  @Get(':userId/or-create')
  @ApiOperation({ summary: 'Obter ou criar preferências de notificação do usuário' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Preferências do usuário' })
  async getPreferencesOrCreate(@Param('userId', ParseUUIDPipe) userId: string): Promise<UserNotificationPreferencesResponse> {
    const preferences = await this.preferencesService.getPreferencesOrCreate(userId);
    return preferences as UserNotificationPreferencesResponse;
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Atualizar preferências de notificação do usuário' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Preferências atualizadas com sucesso' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos' })
  async updatePreferences(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateUserNotificationPreferencesDto,
  ): Promise<UserNotificationPreferencesResponse> {
    const preferences = await this.preferencesService.updatePreferences(userId, dto);
    return preferences as UserNotificationPreferencesResponse;
  }

  @Delete(':userId')
  @UseGuards(RolesGuard)
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir preferências de notificação do usuário' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Preferências excluídas com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Preferências não encontradas' })
  async deletePreferences(@Param('userId', ParseUUIDPipe) userId: string): Promise<void> {
    await this.preferencesService.deletePreferences(userId);
  }

  // ==================== CHANNEL MANAGEMENT ====================

  @Post(':userId/channels/:channel/enable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Habilitar canal de notificação para usuário' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Canal habilitado com sucesso' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Canal não suportado' })
  async enableChannel(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('channel') channel: NotificationChannel,
  ): Promise<UserNotificationPreferencesResponse> {
    const preferences = await this.preferencesService.enableChannel(userId, channel);
    return preferences as UserNotificationPreferencesResponse;
  }

  @Post(':userId/channels/:channel/disable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desabilitar canal de notificação para usuário' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Canal desabilitado com sucesso' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Canal não suportado' })
  async disableChannel(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('channel') channel: NotificationChannel,
  ): Promise<UserNotificationPreferencesResponse> {
    const preferences = await this.preferencesService.disableChannel(userId, channel);
    return preferences as UserNotificationPreferencesResponse;
  }

  @Get(':userId/channels/:channel/status')
  @ApiOperation({ summary: 'Verificar status do canal para usuário' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Status do canal' })
  async getChannelStatus(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('channel') channel: NotificationChannel,
  ): Promise<{ enabled: boolean }> {
    const enabled = await this.preferencesService.isChannelEnabled(userId, channel);
    return { enabled };
  }

  // ==================== CATEGORY MANAGEMENT ====================

  @Post(':userId/categories/:category/enable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Habilitar categoria de notificação para usuário' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Categoria habilitada com sucesso' })
  async enableCategory(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('category') category: NotificationCategory,
  ): Promise<UserNotificationPreferencesResponse> {
    const preferences = await this.preferencesService.enableCategory(userId, category);
    return preferences as UserNotificationPreferencesResponse;
  }

  @Post(':userId/categories/:category/disable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desabilitar categoria de notificação para usuário' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Categoria desabilitada com sucesso' })
  async disableCategory(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('category') category: NotificationCategory,
  ): Promise<UserNotificationPreferencesResponse> {
    const preferences = await this.preferencesService.disableCategory(userId, category);
    return preferences as UserNotificationPreferencesResponse;
  }

  @Get(':userId/categories/:category/status')
  @ApiOperation({ summary: 'Verificar status da categoria para usuário' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Status da categoria' })
  async getCategoryStatus(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('category') category: NotificationCategory,
  ): Promise<{ enabled: boolean }> {
    const enabled = await this.preferencesService.isCategoryEnabled(userId, category);
    return { enabled };
  }

  // ==================== QUIET HOURS ====================

  @Post(':userId/quiet-hours')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Definir horário de silêncio para usuário' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Horário de silêncio definido com sucesso' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Formato de hora inválido' })
  async setQuietHours(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() body: { startTime: string; endTime: string },
  ): Promise<UserNotificationPreferencesResponse> {
    const preferences = await this.preferencesService.setQuietHours(userId, body.startTime, body.endTime);
    return preferences as UserNotificationPreferencesResponse;
  }

  @Delete(':userId/quiet-hours')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover horário de silêncio do usuário' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Horário de silêncio removido com sucesso' })
  async clearQuietHours(@Param('userId', ParseUUIDPipe) userId: string): Promise<UserNotificationPreferencesResponse> {
    const preferences = await this.preferencesService.clearQuietHours(userId);
    return preferences as UserNotificationPreferencesResponse;
  }

  @Get(':userId/quiet-hours/status')
  @ApiOperation({ summary: 'Verificar se usuário está em horário de silêncio' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Status do horário de silêncio' })
  async getQuietHoursStatus(@Param('userId', ParseUUIDPipe) userId: string): Promise<{ inQuietHours: boolean }> {
    const inQuietHours = await this.preferencesService.isInQuietHours(userId);
    return { inQuietHours };
  }

  // ==================== DIGEST SETTINGS ====================

  @Post(':userId/digest/enable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Habilitar digest de notificações para usuário' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Digest habilitado com sucesso' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Formato de hora inválido' })
  async enableDigest(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() body: { frequency?: DigestFrequency; time?: string },
  ): Promise<UserNotificationPreferencesResponse> {
    const preferences = await this.preferencesService.enableDigest(
      userId,
      body.frequency,
      body.time,
    );
    return preferences as UserNotificationPreferencesResponse;
  }

  @Post(':userId/digest/disable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desabilitar digest de notificações para usuário' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Digest desabilitado com sucesso' })
  async disableDigest(@Param('userId', ParseUUIDPipe) userId: string): Promise<UserNotificationPreferencesResponse> {
    const preferences = await this.preferencesService.disableDigest(userId);
    return preferences as UserNotificationPreferencesResponse;
  }

  @Put(':userId/digest/frequency')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Alterar frequência do digest para usuário' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Frequência do digest alterada com sucesso' })
  async setDigestFrequency(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() body: { frequency: DigestFrequency },
  ): Promise<UserNotificationPreferencesResponse> {
    const preferences = await this.preferencesService.setDigestFrequency(userId, body.frequency);
    return preferences as UserNotificationPreferencesResponse;
  }

  @Put(':userId/digest/time')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Alterar horário do digest para usuário' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Horário do digest alterado com sucesso' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Formato de hora inválido' })
  async setDigestTime(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() body: { time: string },
  ): Promise<UserNotificationPreferencesResponse> {
    const preferences = await this.preferencesService.setDigestTime(userId, body.time);
    return preferences as UserNotificationPreferencesResponse;
  }

  // ==================== WEBHOOK MANAGEMENT ====================

  @Post(':userId/webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Definir URL do webhook para usuário' })
  @ApiResponse({ status: HttpStatus.OK, description: 'URL do webhook definida com sucesso' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'URL inválida' })
  async setWebhookUrl(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() body: { url: string },
  ): Promise<UserNotificationPreferencesResponse> {
    const preferences = await this.preferencesService.setWebhookUrl(userId, body.url);
    return preferences as UserNotificationPreferencesResponse;
  }

  @Delete(':userId/webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover URL do webhook do usuário' })
  @ApiResponse({ status: HttpStatus.OK, description: 'URL do webhook removida com sucesso' })
  async removeWebhookUrl(@Param('userId', ParseUUIDPipe) userId: string): Promise<UserNotificationPreferencesResponse> {
    const preferences = await this.preferencesService.removeWebhookUrl(userId);
    return preferences as UserNotificationPreferencesResponse;
  }
}
