import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  INotificationTemplate,
  CreateNotificationTemplateDto,
  UpdateNotificationTemplateDto,
  ProcessedTemplate,
  TemplateVariable,
  NotificationType,
  NotificationCategory,
  NotificationChannel,
} from '../../types/notification.types';

@Injectable()
export class NotificationTemplateService {
  private readonly logger = new Logger(NotificationTemplateService.name);
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // ==================== TEMPLATE CRUD ====================

  async createTemplate(dto: CreateNotificationTemplateDto): Promise<INotificationTemplate> {
    try {
      // Validar se o nome já existe
      const existingTemplate = await this.prisma.notificationTemplate.findUnique({
        where: { name: dto.name },
      });

      if (existingTemplate) {
        throw new BadRequestException('Já existe um template com este nome');
      }

      // Validar variáveis no template
      this.validateTemplateVariables(dto.title, dto.message, dto.variables);

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

      this.logger.log(`Template criado: ${template.id} - ${template.name}`);
      return template as INotificationTemplate;
    } catch (error) {
      this.logger.error(`Erro ao criar template: ${error.message}`);
      throw error;
    }
  }

  async getTemplate(id: string): Promise<INotificationTemplate> {
    const template = await this.prisma.notificationTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Template não encontrado');
    }

    return template as INotificationTemplate;
  }

  async getTemplateByName(name: string): Promise<INotificationTemplate> {
    const template = await this.prisma.notificationTemplate.findUnique({
      where: { name },
    });

    if (!template) {
      throw new NotFoundException('Template não encontrado');
    }

    return template as INotificationTemplate;
  }

  async getTemplates(
    type?: NotificationType,
    category?: NotificationCategory,
    channel?: NotificationChannel,
    isActive?: boolean,
  ): Promise<INotificationTemplate[]> {
    const where: any = {};

    if (type) where.type = type;
    if (category) where.category = category;
    if (channel) where.channel = channel;
    if (isActive !== undefined) where.isActive = isActive;

    const templates = await this.prisma.notificationTemplate.findMany({
      where,
      orderBy: [
        { isSystem: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return templates as INotificationTemplate[];
  }

  async updateTemplate(id: string, dto: UpdateNotificationTemplateDto): Promise<INotificationTemplate> {
    const template = await this.getTemplate(id);

    // Verificar se é template do sistema
    if (template.isSystem && dto.isSystem === false) {
      throw new BadRequestException('Templates do sistema não podem ser convertidos para templates personalizados');
    }

    // Validar nome único se estiver sendo alterado
    if (dto.name && dto.name !== template.name) {
      const existingTemplate = await this.prisma.notificationTemplate.findUnique({
        where: { name: dto.name },
      });

      if (existingTemplate) {
        throw new BadRequestException('Já existe um template com este nome');
      }
    }

    // Validar variáveis se título ou mensagem estiverem sendo alterados
    if (dto.title || dto.message) {
      const title = dto.title || template.title;
      const message = dto.message || template.message;
      const variables = dto.variables || template.variables;
      
      this.validateTemplateVariables(title, message, variables);
    }

    const updatedTemplate = await this.prisma.notificationTemplate.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Template atualizado: ${id}`);
    return updatedTemplate as INotificationTemplate;
  }

  async deleteTemplate(id: string): Promise<void> {
    const template = await this.getTemplate(id);

    if (template.isSystem) {
      throw new BadRequestException('Templates do sistema não podem ser excluídos');
    }

    // Verificar se há notificações usando este template
    const notificationCount = await this.prisma.notification.count({
      where: { templateId: id },
    });

    if (notificationCount > 0) {
      throw new BadRequestException(
        `Não é possível excluir o template. Existem ${notificationCount} notificações usando este template.`
      );
    }

    await this.prisma.notificationTemplate.delete({
      where: { id },
    });

    this.logger.log(`Template excluído: ${id}`);
  }

  async duplicateTemplate(id: string, newName: string): Promise<INotificationTemplate> {
    const originalTemplate = await this.getTemplate(id);

    // Verificar se o novo nome já existe
    const existingTemplate = await this.prisma.notificationTemplate.findUnique({
      where: { name: newName },
    });

    if (existingTemplate) {
      throw new BadRequestException('Já existe um template com este nome');
    }

    const duplicatedTemplate = await this.prisma.notificationTemplate.create({
      data: {
        name: newName,
        title: originalTemplate.title,
        message: originalTemplate.message,
        type: originalTemplate.type,
        category: originalTemplate.category,
        channel: originalTemplate.channel,
        variables: originalTemplate.variables,
        isActive: true,
        isSystem: false, // Templates duplicados sempre são personalizados
        metadata: originalTemplate.metadata,
      },
    });

    this.logger.log(`Template duplicado: ${id} -> ${duplicatedTemplate.id}`);
    return duplicatedTemplate as INotificationTemplate;
  }

  // ==================== TEMPLATE PROCESSING ====================

  async processTemplate(templateId: string, variables: Record<string, any>): Promise<ProcessedTemplate> {
    const template = await this.getTemplate(templateId);
    return this.processTemplateContent(template, variables);
  }

  async processTemplateByName(templateName: string, variables: Record<string, any>): Promise<ProcessedTemplate> {
    const template = await this.getTemplateByName(templateName);
    return this.processTemplateContent(template, variables);
  }

  private processTemplateContent(template: INotificationTemplate, variables: Record<string, any>): ProcessedTemplate {
    let processedTitle = template.title;
    let processedMessage = template.message;

    // Validar se todas as variáveis necessárias foram fornecidas
    this.validateRequiredVariables(template.variables, variables);

    // Substituir variáveis no título e mensagem
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      const stringValue = this.formatVariable(value);
      
      processedTitle = processedTitle.replace(new RegExp(placeholder, 'g'), stringValue);
      processedMessage = processedMessage.replace(new RegExp(placeholder, 'g'), stringValue);
    }

    // Verificar se ainda existem placeholders não substituídos
    this.validateNoUnreplacedPlaceholders(processedTitle, processedMessage);

    return {
      title: processedTitle,
      message: processedMessage,
      variables,
    };
  }

  // ==================== TEMPLATE VALIDATION ====================

  private validateTemplateVariables(title: string, message: string, variables: string[]): void {
    const titlePlaceholders = this.extractPlaceholders(title);
    const messagePlaceholders = this.extractPlaceholders(message);
    const allPlaceholders = [...new Set([...titlePlaceholders, ...messagePlaceholders])];

    // Verificar se todas as variáveis definidas são usadas
    for (const variable of variables) {
      if (!allPlaceholders.includes(variable)) {
        this.logger.warn(`Variável '${variable}' definida mas não usada no template`);
      }
    }

    // Verificar se todas as variáveis usadas estão definidas
    for (const placeholder of allPlaceholders) {
      if (!variables.includes(placeholder)) {
        throw new BadRequestException(
          `Variável '${placeholder}' é usada no template mas não está definida na lista de variáveis`
        );
      }
    }
  }

  private validateRequiredVariables(requiredVariables: string[], providedVariables: Record<string, any>): void {
    for (const variable of requiredVariables) {
      if (!(variable in providedVariables)) {
        throw new BadRequestException(`Variável obrigatória '${variable}' não foi fornecida`);
      }
    }
  }

  private validateNoUnreplacedPlaceholders(title: string, message: string): void {
    const unreplacedPlaceholders = [
      ...this.extractPlaceholders(title),
      ...this.extractPlaceholders(message),
    ];

    if (unreplacedPlaceholders.length > 0) {
      throw new BadRequestException(
        `Placeholders não substituídos encontrados: ${unreplacedPlaceholders.join(', ')}`
      );
    }
  }

  private extractPlaceholders(text: string): string[] {
    const placeholderRegex = /\{\{([^}]+)\}\}/g;
    const placeholders: string[] = [];
    let match;

    while ((match = placeholderRegex.exec(text)) !== null) {
      placeholders.push(match[1].trim());
    }

    return placeholders;
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

  // ==================== TEMPLATE UTILITIES ====================

  async getTemplateVariables(templateId: string): Promise<string[]> {
    const template = await this.getTemplate(templateId);
    return template.variables;
  }

  async getTemplateUsage(templateId: string): Promise<{
    totalNotifications: number;
    activeNotifications: number;
    lastUsed?: Date;
  }> {
    const [totalNotifications, activeNotifications, lastUsedNotification] = await Promise.all([
      this.prisma.notification.count({
        where: { templateId },
      }),
      this.prisma.notification.count({
        where: { 
          templateId,
          status: {
            in: ['PENDING', 'SCHEDULED', 'SENDING'],
          },
        },
      }),
      this.prisma.notification.findFirst({
        where: { templateId },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
    ]);

    return {
      totalNotifications,
      activeNotifications,
      lastUsed: lastUsedNotification?.createdAt,
    };
  }

  async getTemplatesByUsage(limit: number = 10): Promise<Array<INotificationTemplate & { usageCount: number }>> {
    const templates = await this.prisma.notificationTemplate.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { notifications: true },
        },
      },
      orderBy: {
        notifications: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    return templates.map(template => ({
      ...template,
      usageCount: template._count.notifications,
    })) as Array<INotificationTemplate & { usageCount: number }>;
  }

  // ==================== SYSTEM TEMPLATES ====================

  async initializeSystemTemplates(): Promise<void> {
    const systemTemplates = [
      {
        name: 'loan_created',
        title: 'Empréstimo Realizado',
        message: 'Olá {{userName}}, seu empréstimo do material "{{materialTitle}}" foi confirmado. Data de devolução: {{dueDate}}.',
        type: NotificationType.LOAN,
        category: NotificationCategory.SUCCESS,
        channel: NotificationChannel.EMAIL,
        variables: ['userName', 'materialTitle', 'dueDate'],
      },
      {
        name: 'loan_reminder',
        title: 'Lembrete de Devolução',
        message: 'Olá {{userName}}, seu empréstimo do material "{{materialTitle}}" vence em {{daysUntilDue}} dias. Considere renovar ou devolver.',
        type: NotificationType.REMINDER,
        category: NotificationCategory.WARNING,
        channel: NotificationChannel.EMAIL,
        variables: ['userName', 'materialTitle', 'daysUntilDue'],
      },
      {
        name: 'loan_overdue',
        title: 'Empréstimo em Atraso',
        message: 'Olá {{userName}}, seu empréstimo do material "{{materialTitle}}" está {{daysOverdue}} dias em atraso. Multa aplicada: R$ {{fineAmount}}.',
        type: NotificationType.LOAN,
        category: NotificationCategory.ERROR,
        channel: NotificationChannel.EMAIL,
        variables: ['userName', 'materialTitle', 'daysOverdue', 'fineAmount'],
      },
      {
        name: 'reservation_available',
        title: 'Reserva Disponível',
        message: 'Olá {{userName}}, o material "{{materialTitle}}" que você reservou está disponível para retirada. Você tem 48 horas para retirar.',
        type: NotificationType.RESERVATION,
        category: NotificationCategory.INFO,
        channel: NotificationChannel.EMAIL,
        variables: ['userName', 'materialTitle'],
      },
      {
        name: 'fine_created',
        title: 'Multa Aplicada',
        message: 'Olá {{userName}}, uma multa de R$ {{amount}} foi aplicada por {{daysOverdue}} dias de atraso no empréstimo do material "{{materialTitle}}".',
        type: NotificationType.FINE,
        category: NotificationCategory.WARNING,
        channel: NotificationChannel.EMAIL,
        variables: ['userName', 'amount', 'daysOverdue', 'materialTitle'],
      },
      {
        name: 'welcome',
        title: 'Bem-vindo à Biblioteca',
        message: 'Olá {{userName}}, seja bem-vindo(a) à biblioteca universitária! Seu cadastro foi ativado com sucesso.',
        type: NotificationType.WELCOME,
        category: NotificationCategory.SUCCESS,
        channel: NotificationChannel.EMAIL,
        variables: ['userName'],
      },
      {
        name: 'password_reset',
        title: 'Redefinição de Senha',
        message: 'Olá {{userName}}, você solicitou a redefinição de sua senha. Clique no link para redefinir: {{resetLink}}.',
        type: NotificationType.PASSWORD_RESET,
        category: NotificationCategory.SECURITY,
        channel: NotificationChannel.EMAIL,
        variables: ['userName', 'resetLink'],
      },
    ];

    for (const templateData of systemTemplates) {
      const existingTemplate = await this.prisma.notificationTemplate.findUnique({
        where: { name: templateData.name },
      });

      if (!existingTemplate) {
        await this.prisma.notificationTemplate.create({
          data: {
            ...templateData,
            isSystem: true,
            isActive: true,
          },
        });
        this.logger.log(`Template do sistema criado: ${templateData.name}`);
      }
    }

    this.logger.log('Templates do sistema inicializados');
  }
}
