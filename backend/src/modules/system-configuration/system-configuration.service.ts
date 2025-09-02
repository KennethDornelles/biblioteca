import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaClient, SystemConfiguration, Prisma } from '@prisma/client';
import { CreateSystemConfigurationDto } from './dto/create-system-configuration.dto';
import { UpdateSystemConfigurationDto } from './dto/update-system-configuration.dto';
import { SystemConfigurationFiltersDto } from './dto/system-configuration-filters.dto';
import { PaginatedSystemConfigurationsDto } from './dto/paginated-system-configurations.dto';
import { SystemConfigurationResponseDto } from './dto/system-configuration-response.dto';
import { ConfigurationByCategory, SystemSettings } from '../../types/system-configuration.types';

@Injectable()
export class SystemConfigurationService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(createSystemConfigurationDto: CreateSystemConfigurationDto): Promise<SystemConfigurationResponseDto> {
    // Verificar se a chave já existe
    const existingConfig = await this.prisma.systemConfiguration.findUnique({
      where: { key: createSystemConfigurationDto.key }
    });

    if (existingConfig) {
      throw new ConflictException('Chave de configuração já existe');
    }

    // Validar o tipo de dados
    this.validateConfigurationType(createSystemConfigurationDto.value, createSystemConfigurationDto.type);

    // Criar a configuração
    const configuration = await this.prisma.systemConfiguration.create({
      data: {
        key: createSystemConfigurationDto.key,
        value: createSystemConfigurationDto.value,
        description: createSystemConfigurationDto.description,
        type: createSystemConfigurationDto.type,
        category: createSystemConfigurationDto.category,
        editable: createSystemConfigurationDto.editable ?? true
      }
    });

    return this.mapToResponseDto(configuration);
  }

    async findAll(filters: SystemConfigurationFiltersDto): Promise<PaginatedSystemConfigurationsDto> {
    const { page = 1, limit = 10, ...filterFields } = filters;
    const numPage = Number(page);
    const numLimit = Number(limit);
    const skip = (numPage - 1) * numLimit;

    // Construir filtros do Prisma
    const where = this.buildWhereClause(filterFields);

    // Buscar configurações com paginação
    const [configurations, total] = await Promise.all([
      this.prisma.systemConfiguration.findMany({
        where,
        skip,
        take: numLimit,
        orderBy: { category: 'asc', key: 'asc' }
      }),
      this.prisma.systemConfiguration.count({ where })
    ]);

    const totalPages = Math.ceil(total / numLimit);
    const hasNextPage = numPage < totalPages;
    const hasPrevPage = numPage > 1;

    return {
      data: configurations.map(config => this.mapToResponseDto(config)),
      page: numPage,
      limit: numLimit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage
    };
  }

  async findOne(id: string): Promise<SystemConfigurationResponseDto> {
    const configuration = await this.prisma.systemConfiguration.findUnique({
      where: { id }
    });

    if (!configuration) {
      throw new NotFoundException('Configuração não encontrada');
    }

    return this.mapToResponseDto(configuration);
  }

  async findByKey(key: string): Promise<SystemConfigurationResponseDto> {
    const configuration = await this.prisma.systemConfiguration.findUnique({
      where: { key }
    });

    if (!configuration) {
      throw new NotFoundException('Configuração não encontrada');
    }

    return this.mapToResponseDto(configuration);
  }

  async update(id: string, updateSystemConfigurationDto: UpdateSystemConfigurationDto): Promise<SystemConfigurationResponseDto> {
    // Verificar se a configuração existe
    const existingConfiguration = await this.prisma.systemConfiguration.findUnique({
      where: { id }
    });

    if (!existingConfiguration) {
      throw new NotFoundException('Configuração não encontrada');
    }

    // Verificar se a configuração é editável
    if (!existingConfiguration.editable) {
      throw new BadRequestException('Esta configuração não pode ser editada');
    }

    // Validar o tipo de dados se o valor for alterado
    if (updateSystemConfigurationDto.value && updateSystemConfigurationDto.type) {
      this.validateConfigurationType(updateSystemConfigurationDto.value, updateSystemConfigurationDto.type);
    } else if (updateSystemConfigurationDto.value) {
      this.validateConfigurationType(updateSystemConfigurationDto.value, existingConfiguration.type);
    }

    // Atualizar a configuração
    const updatedConfiguration = await this.prisma.systemConfiguration.update({
      where: { id },
      data: updateSystemConfigurationDto
    });

    return this.mapToResponseDto(updatedConfiguration);
  }

  async updateByKey(key: string, value: string): Promise<SystemConfigurationResponseDto> {
    const configuration = await this.prisma.systemConfiguration.findUnique({
      where: { key }
    });

    if (!configuration) {
      throw new NotFoundException('Configuração não encontrada');
    }

    if (!configuration.editable) {
      throw new BadRequestException('Esta configuração não pode ser editada');
    }

    // Validar o tipo de dados
    this.validateConfigurationType(value, configuration.type);

    const updatedConfiguration = await this.prisma.systemConfiguration.update({
      where: { key },
      data: { value }
    });

    return this.mapToResponseDto(updatedConfiguration);
  }

  async remove(id: string): Promise<void> {
    // Verificar se a configuração existe
    const existingConfiguration = await this.prisma.systemConfiguration.findUnique({
      where: { id }
    });

    if (!existingConfiguration) {
      throw new NotFoundException('Configuração não encontrada');
    }

    // Verificar se a configuração é editável
    if (!existingConfiguration.editable) {
      throw new BadRequestException('Esta configuração não pode ser removida');
    }

    // Remover a configuração
    await this.prisma.systemConfiguration.delete({
      where: { id }
    });
  }

  async findByCategory(category: string): Promise<SystemConfigurationResponseDto[]> {
    const configurations = await this.prisma.systemConfiguration.findMany({
      where: { category },
      orderBy: { key: 'asc' }
    });

    return configurations.map(config => this.mapToResponseDto(config));
  }

    async getByCategories(): Promise<ConfigurationByCategory[]> {
    const configurations = await this.prisma.systemConfiguration.findMany({
      orderBy: [{ category: 'asc' }, { key: 'asc' }]
    });

    const groupedConfigs = configurations.reduce((acc, config) => {
      const category = config.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(config);
      return acc;
    }, {} as Record<string, SystemConfiguration[]>);

    return Object.entries(groupedConfigs).map(([category, configs]) => ({
      category,
      configurations: configs
    }));
  }

  async getSystemSettings(): Promise<SystemSettings> {
    const configurations = await this.prisma.systemConfiguration.findMany({
      where: {
        category: {
          in: ['library', 'loans', 'reservations', 'notifications']
        }
      }
    });

    const settings: SystemSettings = {
      library: {
        name: this.getConfigValue(configurations, 'library.name', 'Biblioteca'),
        address: this.getConfigValue(configurations, 'library.address', ''),
        phone: this.getConfigValue(configurations, 'library.phone', ''),
        email: this.getConfigValue(configurations, 'library.email', ''),
        workingHours: this.getConfigValue(configurations, 'library.workingHours', '')
      },
      loans: {
        defaultLoanDays: parseInt(this.getConfigValue(configurations, 'loans.defaultLoanDays', '7')),
        maxRenewals: parseInt(this.getConfigValue(configurations, 'loans.maxRenewals', '2')),
        maxLoansPerUser: parseInt(this.getConfigValue(configurations, 'loans.maxLoansPerUser', '3')),
        overdueFinePerDay: parseFloat(this.getConfigValue(configurations, 'loans.overdueFinePerDay', '0.50'))
      },
      reservations: {
        maxReservationsPerUser: parseInt(this.getConfigValue(configurations, 'reservations.maxReservationsPerUser', '5')),
        reservationExpirationDays: parseInt(this.getConfigValue(configurations, 'reservations.reservationExpirationDays', '3'))
      },
      notifications: {
        emailEnabled: this.getConfigValue(configurations, 'notifications.emailEnabled', 'true') === 'true',
        smsEnabled: this.getConfigValue(configurations, 'notifications.smsEnabled', 'false') === 'true',
        reminderDaysBefore: parseInt(this.getConfigValue(configurations, 'notifications.reminderDaysBefore', '1'))
      }
    };

    return settings;
  }

  async initializeDefaultConfigurations(): Promise<void> {
    const defaultConfigs = [
      // Configurações da biblioteca
      { key: 'library.name', value: 'Biblioteca Central da Universidade', description: 'Nome da biblioteca', type: 'string', category: 'library' },
      { key: 'library.address', value: 'Rua da Universidade, 123', description: 'Endereço da biblioteca', type: 'string', category: 'library' },
      { key: 'library.phone', value: '(11) 1234-5678', description: 'Telefone da biblioteca', type: 'string', category: 'library' },
      { key: 'library.email', value: 'biblioteca@universidade.edu.br', description: 'Email da biblioteca', type: 'string', category: 'library' },
      { key: 'library.workingHours', value: 'Segunda a Sexta: 8h às 22h, Sábado: 8h às 18h', description: 'Horário de funcionamento', type: 'string', category: 'library' },
      
      // Configurações de empréstimos
      { key: 'loans.defaultLoanDays', value: '7', description: 'Dias padrão para empréstimo', type: 'number', category: 'loans' },
      { key: 'loans.maxRenewals', value: '2', description: 'Máximo de renovações permitidas', type: 'number', category: 'loans' },
      { key: 'loans.maxLoansPerUser', value: '3', description: 'Máximo de empréstimos por usuário', type: 'number', category: 'loans' },
      { key: 'loans.overdueFinePerDay', value: '0.50', description: 'Multa por dia de atraso', type: 'number', category: 'loans' },
      
      // Configurações de reservas
      { key: 'reservations.maxReservationsPerUser', value: '5', description: 'Máximo de reservas por usuário', type: 'number', category: 'reservations' },
      { key: 'reservations.reservationExpirationDays', value: '3', description: 'Dias para expiração da reserva', type: 'number', category: 'reservations' },
      
      // Configurações de notificações
      { key: 'notifications.emailEnabled', value: 'true', description: 'Habilitar notificações por email', type: 'boolean', category: 'notifications' },
      { key: 'notifications.smsEnabled', value: 'false', description: 'Habilitar notificações por SMS', type: 'boolean', category: 'notifications' },
      { key: 'notifications.reminderDaysBefore', value: '1', description: 'Dias antes para lembrete de devolução', type: 'number', category: 'notifications' }
    ];

    for (const config of defaultConfigs) {
      const exists = await this.prisma.systemConfiguration.findUnique({
        where: { key: config.key }
      });

      if (!exists) {
        await this.prisma.systemConfiguration.create({
          data: {
            ...config,
            editable: true
          }
        });
      }
    }
  }

  private buildWhereClause(filters: Partial<SystemConfigurationFiltersDto>): Prisma.SystemConfigurationWhereInput {
    const where: Prisma.SystemConfigurationWhereInput = {};

    if (filters.key) {
      where.key = {
        contains: filters.key,
        mode: 'insensitive'
      };
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.editable !== undefined) {
      where.editable = filters.editable;
    }

    return where;
  }

  private validateConfigurationType(value: string, type: string): void {
    switch (type) {
      case 'number':
        if (isNaN(Number(value))) {
          throw new BadRequestException('Valor deve ser um número válido');
        }
        break;
      case 'boolean':
        if (!['true', 'false', '0', '1'].includes(value.toLowerCase())) {
          throw new BadRequestException('Valor deve ser um booleano válido');
        }
        break;
      case 'string':
        // String é sempre válida
        break;
      default:
        throw new BadRequestException('Tipo de configuração não suportado');
    }
  }

  private getConfigValue(configurations: SystemConfiguration[], key: string, defaultValue: string): string {
    const config = configurations.find(c => c.key === key);
    return config ? config.value : defaultValue;
  }

  private mapToResponseDto(configuration: SystemConfiguration): SystemConfigurationResponseDto {
    return {
      id: configuration.id,
      key: configuration.key,
      value: configuration.value,
      description: configuration.description ?? undefined,
      type: configuration.type,
      category: configuration.category,
      editable: configuration.editable,
      createdAt: configuration.createdAt,
      updatedAt: configuration.updatedAt
    };
  }
}
