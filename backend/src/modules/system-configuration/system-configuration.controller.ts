import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  HttpCode, 
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SystemConfigurationService } from './system-configuration.service';
import { CreateSystemConfigurationDto } from './dto/create-system-configuration.dto';
import { UpdateSystemConfigurationDto } from './dto/update-system-configuration.dto';
import { SystemConfigurationFiltersDto } from './dto/system-configuration-filters.dto';
import { SystemConfigurationResponseDto } from './dto/system-configuration-response.dto';
import { PaginatedSystemConfigurationsDto } from './dto/paginated-system-configurations.dto';

@ApiTags('System Configuration')
@Controller('system-configurations')
export class SystemConfigurationController {
  constructor(private readonly systemConfigurationService: SystemConfigurationService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova configuração do sistema' })
  @ApiResponse({ 
    status: 201, 
    description: 'Configuração criada com sucesso',
    type: SystemConfigurationResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Chave de configuração já existe' })
  async create(@Body() createSystemConfigurationDto: CreateSystemConfigurationDto): Promise<SystemConfigurationResponseDto> {
    return this.systemConfigurationService.create(createSystemConfigurationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as configurações com filtros e paginação' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de configurações retornada com sucesso',
    type: PaginatedSystemConfigurationsDto 
  })
  async findAll(@Query() filters: SystemConfigurationFiltersDto): Promise<PaginatedSystemConfigurationsDto> {
    return this.systemConfigurationService.findAll(filters);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Obter configurações agrupadas por categoria' })
  @ApiResponse({ 
    status: 200, 
    description: 'Configurações agrupadas retornadas com sucesso' 
  })
  async getByCategories() {
    return this.systemConfigurationService.getByCategories();
  }

  @Get('settings')
  @ApiOperation({ summary: 'Obter configurações do sistema organizadas' })
  @ApiResponse({ 
    status: 200, 
    description: 'Configurações do sistema retornadas com sucesso' 
  })
  async getSystemSettings() {
    return this.systemConfigurationService.getSystemSettings();
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Listar configurações de uma categoria específica' })
  @ApiParam({ name: 'category', description: 'Nome da categoria' })
  @ApiResponse({ 
    status: 200, 
    description: 'Configurações da categoria retornadas com sucesso',
    type: [SystemConfigurationResponseDto] 
  })
  async findByCategory(@Param('category') category: string): Promise<SystemConfigurationResponseDto[]> {
    return this.systemConfigurationService.findByCategory(category);
  }

  @Get('key/:key')
  @ApiOperation({ summary: 'Buscar configuração por chave' })
  @ApiParam({ name: 'key', description: 'Chave da configuração' })
  @ApiResponse({ 
    status: 200, 
    description: 'Configuração encontrada com sucesso',
    type: SystemConfigurationResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  async findByKey(@Param('key') key: string): Promise<SystemConfigurationResponseDto> {
    return this.systemConfigurationService.findByKey(key);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma configuração por ID' })
  @ApiParam({ name: 'id', description: 'ID da configuração' })
  @ApiResponse({ 
    status: 200, 
    description: 'Configuração encontrada com sucesso',
    type: SystemConfigurationResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  async findOne(@Param('id') id: string): Promise<SystemConfigurationResponseDto> {
    return this.systemConfigurationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma configuração' })
  @ApiParam({ name: 'id', description: 'ID da configuração' })
  @ApiResponse({ 
    status: 200, 
    description: 'Configuração atualizada com sucesso',
    type: SystemConfigurationResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou configuração não editável' })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  async update(
    @Param('id') id: string, 
    @Body() updateSystemConfigurationDto: UpdateSystemConfigurationDto
  ): Promise<SystemConfigurationResponseDto> {
    return this.systemConfigurationService.update(id, updateSystemConfigurationDto);
  }

  @Patch('key/:key')
  @ApiOperation({ summary: 'Atualizar configuração por chave' })
  @ApiParam({ name: 'key', description: 'Chave da configuração' })
  @ApiResponse({ 
    status: 200, 
    description: 'Configuração atualizada com sucesso',
    type: SystemConfigurationResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou configuração não editável' })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  async updateByKey(
    @Param('key') key: string,
    @Body('value') value: string
  ): Promise<SystemConfigurationResponseDto> {
    return this.systemConfigurationService.updateByKey(key, value);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover uma configuração' })
  @ApiParam({ name: 'id', description: 'ID da configuração' })
  @ApiResponse({ status: 204, description: 'Configuração removida com sucesso' })
  @ApiResponse({ status: 400, description: 'Configuração não pode ser removida' })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.systemConfigurationService.remove(id);
  }

  @Post('initialize')
  @ApiOperation({ summary: 'Inicializar configurações padrão do sistema' })
  @ApiResponse({ 
    status: 201, 
    description: 'Configurações padrão inicializadas com sucesso' 
  })
  async initializeDefaultConfigurations(): Promise<void> {
    return this.systemConfigurationService.initializeDefaultConfigurations();
  }
}
