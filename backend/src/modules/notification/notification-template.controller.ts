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
import { NotificationTemplateService } from './notification-template.service';
import {
  NotificationType,
  NotificationCategory,
  NotificationChannel,
} from '../../types/notification.types';
import type {
  CreateNotificationTemplateDto,
  UpdateNotificationTemplateDto,
  NotificationTemplateResponse,
  ProcessedTemplate,
} from '../../types/notification.types';

@ApiTags('Templates de Notificação')
@Controller('notification-templates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationTemplateController {
  constructor(
    private readonly templateService: NotificationTemplateService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  @ApiOperation({ summary: 'Criar novo template de notificação' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Template criado com sucesso' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Nome do template já existe' })
  async createTemplate(@Body() dto: CreateNotificationTemplateDto): Promise<NotificationTemplateResponse> {
    const template = await this.templateService.createTemplate(dto);
    return template as NotificationTemplateResponse;
  }

  @Get()
  @ApiOperation({ summary: 'Listar templates de notificação' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de templates' })
  @ApiQuery({ name: 'type', required: false, description: 'Tipo da notificação' })
  @ApiQuery({ name: 'category', required: false, description: 'Categoria da notificação' })
  @ApiQuery({ name: 'channel', required: false, description: 'Canal da notificação' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Se o template está ativo' })
  async getTemplates(
    @Query('type') type?: NotificationType,
    @Query('category') category?: NotificationCategory,
    @Query('channel') channel?: NotificationChannel,
    @Query('isActive') isActive?: boolean,
  ): Promise<NotificationTemplateResponse[]> {
    const templates = await this.templateService.getTemplates(type, category, channel, isActive);
    return templates as NotificationTemplateResponse[];
  }

  @Get('usage')
  @UseGuards(RolesGuard)
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  @ApiOperation({ summary: 'Obter templates mais utilizados' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Templates ordenados por uso' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limite de resultados' })
  async getTemplatesByUsage(
    @Query('limit') limit?: number,
  ): Promise<Array<NotificationTemplateResponse & { usageCount: number }>> {
    const templates = await this.templateService.getTemplatesByUsage(limit ? parseInt(limit.toString()) : 10);
    return templates as Array<NotificationTemplateResponse & { usageCount: number }>;
  }

  @Get('system/initialize')
  @UseGuards(RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiOperation({ summary: 'Inicializar templates do sistema' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Templates do sistema inicializados' })
  async initializeSystemTemplates(): Promise<{ message: string }> {
    await this.templateService.initializeSystemTemplates();
    return { message: 'Templates do sistema inicializados com sucesso' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter template por ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Template encontrado' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Template não encontrado' })
  async getTemplate(@Param('id', ParseUUIDPipe) id: string): Promise<NotificationTemplateResponse> {
    const template = await this.templateService.getTemplate(id);
    return template as NotificationTemplateResponse;
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Obter template por nome' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Template encontrado' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Template não encontrado' })
  async getTemplateByName(@Param('name') name: string): Promise<NotificationTemplateResponse> {
    const template = await this.templateService.getTemplateByName(name);
    return template as NotificationTemplateResponse;
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  @ApiOperation({ summary: 'Atualizar template de notificação' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Template atualizado com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Template não encontrado' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos' })
  async updateTemplate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNotificationTemplateDto,
  ): Promise<NotificationTemplateResponse> {
    const template = await this.templateService.updateTemplate(id, dto);
    return template as NotificationTemplateResponse;
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir template de notificação' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Template excluído com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Template não encontrado' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Template do sistema não pode ser excluído' })
  async deleteTemplate(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.templateService.deleteTemplate(id);
  }

  @Post(':id/duplicate')
  @UseGuards(RolesGuard)
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  @ApiOperation({ summary: 'Duplicar template de notificação' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Template duplicado com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Template não encontrado' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Nome do template já existe' })
  async duplicateTemplate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { newName: string },
  ): Promise<NotificationTemplateResponse> {
    const template = await this.templateService.duplicateTemplate(id, body.newName);
    return template as NotificationTemplateResponse;
  }

  @Get(':id/variables')
  @ApiOperation({ summary: 'Obter variáveis do template' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de variáveis do template' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Template não encontrado' })
  async getTemplateVariables(@Param('id', ParseUUIDPipe) id: string): Promise<{ variables: string[] }> {
    const variables = await this.templateService.getTemplateVariables(id);
    return { variables };
  }

  @Get(':id/usage')
  @UseGuards(RolesGuard)
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  @ApiOperation({ summary: 'Obter estatísticas de uso do template' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Estatísticas de uso do template' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Template não encontrado' })
  async getTemplateUsage(@Param('id', ParseUUIDPipe) id: string): Promise<{
    totalNotifications: number;
    activeNotifications: number;
    lastUsed?: Date;
  }> {
    return this.templateService.getTemplateUsage(id);
  }

  @Post(':id/process')
  @ApiOperation({ summary: 'Processar template com variáveis' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Template processado com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Template não encontrado' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Variáveis inválidas' })
  async processTemplate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { variables: Record<string, any> },
  ): Promise<ProcessedTemplate> {
    return this.templateService.processTemplate(id, body.variables);
  }

  @Post('name/:name/process')
  @ApiOperation({ summary: 'Processar template por nome com variáveis' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Template processado com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Template não encontrado' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Variáveis inválidas' })
  async processTemplateByName(
    @Param('name') name: string,
    @Body() body: { variables: Record<string, any> },
  ): Promise<ProcessedTemplate> {
    return this.templateService.processTemplateByName(name, body.variables);
  }
}
