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
  ParseUUIDPipe,
  ValidationPipe,
  UseGuards
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery, 
  ApiBody,
  ApiBearerAuth 
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginatedUsersDto } from './dto/paginated-users.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserType } from '../../enums';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { 
  ErrorResponseDto, 
  ValidationErrorDto, 
  UnauthorizedErrorDto, 
  ForbiddenErrorDto, 
  NotFoundErrorDto, 
  ConflictErrorDto 
} from '../../common';

@ApiTags('Usuários')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.LIBRARIAN)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Criar novo usuário',
    description: 'Cria um novo usuário no sistema com validações específicas por tipo. Apenas administradores e bibliotecários podem criar usuários.'
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuário criado com sucesso',
    type: UserResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos ou campos obrigatórios não preenchidos',
    type: ValidationErrorDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado',
    type: UnauthorizedErrorDto 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acesso negado - permissão insuficiente',
    type: ForbiddenErrorDto 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Email ou número de matrícula já está em uso',
    type: ConflictErrorDto 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Erro interno do servidor',
    type: ErrorResponseDto 
  })
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.LIBRARIAN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Listar usuários',
    description: 'Lista todos os usuários com filtros e paginação. Apenas administradores e bibliotecários podem listar usuários.'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Itens por página' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Filtrar por nome' })
  @ApiQuery({ name: 'email', required: false, type: String, description: 'Filtrar por email' })
  @ApiQuery({ name: 'type', required: false, enum: UserType, description: 'Filtrar por tipo de usuário' })
  @ApiQuery({ name: 'active', required: false, type: Boolean, description: 'Filtrar por status ativo' })
  @ApiQuery({ name: 'course', required: false, type: String, description: 'Filtrar por curso' })
  @ApiQuery({ name: 'department', required: false, type: String, description: 'Filtrar por departamento' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuários retornada com sucesso',
    type: PaginatedUsersDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado',
    type: UnauthorizedErrorDto 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acesso negado - permissão insuficiente',
    type: ForbiddenErrorDto 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Erro interno do servidor',
    type: ErrorResponseDto 
  })
  async findAll(@Query() filters: any): Promise<PaginatedUsersDto> {
    try {
      console.log('🔍 UserController.findAll - Filtros recebidos:', filters);
      console.log('🔍 Tipo dos filtros:', typeof filters);
      console.log('🔍 Propriedades dos filtros:', Object.keys(filters));
      
      const result = await this.userService.findAll(filters);
      console.log('🔍 UserController.findAll - Resultado retornado:', result);
      return result;
    } catch (error) {
      console.error('❌ Erro no UserController.findAll:', error);
      console.error('❌ Stack trace:', error.stack);
      throw error;
    }
  }

  @Get('type/:type')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.LIBRARIAN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Listar usuários por tipo',
    description: 'Lista todos os usuários de um tipo específico. Apenas administradores e bibliotecários podem acessar.'
  })
  @ApiParam({ name: 'type', enum: UserType, description: 'Tipo de usuário' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuários por tipo retornada com sucesso',
    type: [UserResponseDto] 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acesso negado - permissão insuficiente' 
  })
  async findByType(@Param('type') type: UserType): Promise<UserResponseDto[]> {
    return this.userService.findByType(type);
  }

  @Get('test')
  @ApiOperation({ 
    summary: 'Teste de conexão',
    description: 'Endpoint de teste para verificar se o serviço está funcionando'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Teste realizado com sucesso',
    schema: { type: 'object', properties: { message: { type: 'string' } } }
  })
  async test(): Promise<{ message: string }> {
    try {
      console.log('🔍 UserController.test - Endpoint de teste chamado');
      return { message: 'UserService está funcionando!' };
    } catch (error) {
      console.error('❌ Erro no UserController.test:', error);
      throw error;
    }
  }

  @Get('test-no-auth')
  @ApiOperation({ 
    summary: 'Teste sem autenticação',
    description: 'Endpoint de teste sem autenticação para isolar problemas'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Teste realizado com sucesso',
    schema: { type: 'object', properties: { message: { type: 'string' }, services: { type: 'object' } } }
  })
  async testNoAuth(): Promise<{ message: string; services: any }> {
    try {
      console.log('🔍 UserController.testNoAuth - Testando sem autenticação');
      
      const services = {
        userService: !!this.userService,
        prismaService: !!this.userService['prisma'],
        eventBus: !!this.userService['eventBus'],
        eventFactory: !!this.userService['eventFactory']
      };
      
      console.log('🔍 Serviços disponíveis (sem auth):', services);
      
      return { 
        message: 'Teste sem autenticação funcionando!', 
        services 
      };
    } catch (error) {
      console.error('❌ Erro no UserController.testNoAuth:', error);
      console.error('❌ Stack trace:', error.stack);
      throw error;
    }
  }

  @Get('test-filters')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.LIBRARIAN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Teste de filtros',
    description: 'Endpoint de teste para validar filtros'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Teste de filtros realizado com sucesso',
    schema: { type: 'object', properties: { message: { type: 'string' }, filters: { type: 'object' } } }
  })
  async testFilters(@Query(ValidationPipe) filters: UserFiltersDto): Promise<{ message: string; filters: any }> {
    try {
      console.log('🔍 UserController.testFilters - Filtros recebidos:', filters);
      return { 
        message: 'Filtros validados com sucesso!', 
        filters 
      };
    } catch (error) {
      console.error('❌ Erro no UserController.testFilters:', error);
      console.error('❌ Stack trace:', error.stack);
      throw error;
    }
  }

  @Get('test-injection')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.LIBRARIAN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Teste de injeção de dependências',
    description: 'Endpoint para testar se as dependências estão sendo injetadas corretamente'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Teste de injeção realizado com sucesso',
    schema: { type: 'object', properties: { message: { type: 'string' }, services: { type: 'object' } } }
  })
  async testInjection(): Promise<{ message: string; services: any }> {
    try {
      console.log('🔍 UserController.testInjection - Testando injeção de dependências');
      
      const services = {
        userService: !!this.userService,
        prismaService: !!this.userService['prisma'],
        eventBus: !!this.userService['eventBus'],
        eventFactory: !!this.userService['eventFactory']
      };
      
      console.log('🔍 Serviços disponíveis:', services);
      
      return { 
        message: 'Injeção de dependências funcionando!', 
        services 
      };
    } catch (error) {
      console.error('❌ Erro no UserController.testInjection:', error);
      console.error('❌ Stack trace:', error.stack);
      throw error;
    }
  }

  @Get('test-db')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.LIBRARIAN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Teste de banco de dados',
    description: 'Endpoint de teste para verificar se a conexão com o banco está funcionando'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Teste de banco realizado com sucesso',
    schema: { type: 'object', properties: { message: { type: 'string' }, count: { type: 'number' } } }
  })
  async testDb(): Promise<{ message: string; count: number }> {
    try {
      console.log('🔍 UserController.testDb - Testando conexão com banco');
      
      // Teste 1: Verificar se o PrismaService está disponível
      console.log('🔍 PrismaService disponível:', !!this.userService['prisma']);
      
      // Teste 2: Tentar uma consulta simples
      console.log('🔍 Executando consulta simples...');
      const count = await this.userService['prisma'].user.count();
      console.log('🔍 Total de usuários no banco:', count);
      
      // Teste 3: Tentar buscar um usuário específico
      console.log('🔍 Buscando primeiro usuário...');
      const firstUser = await this.userService['prisma'].user.findFirst();
      console.log('🔍 Primeiro usuário encontrado:', firstUser ? 'Sim' : 'Não');
      
      return { message: 'Conexão com banco funcionando!', count };
    } catch (error) {
      console.error('❌ Erro no UserController.testDb:', error);
      console.error('❌ Tipo do erro:', error.constructor.name);
      console.error('❌ Mensagem do erro:', error.message);
      console.error('❌ Stack trace:', error.stack);
      throw error;
    }
  }

  @Get('course/:course')
  @ApiOperation({ 
    summary: 'Listar usuários por curso',
    description: 'Lista todos os usuários de um curso específico'
  })
  @ApiParam({ name: 'course', description: 'Nome do curso' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuários por curso retornada com sucesso',
    type: [UserResponseDto] 
  })
  async findByCourse(@Param('course') course: string): Promise<UserResponseDto[]> {
    return this.userService.findByCourse(course);
  }

  @Get('department/:department')
  @ApiOperation({ 
    summary: 'Listar usuários por departamento',
    description: 'Lista todos os usuários de um departamento específico'
  })
  @ApiParam({ name: 'department', description: 'Nome do departamento' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuários por departamento retornada com sucesso',
    type: [UserResponseDto] 
  })
  async findByDepartment(@Param('department') department: string): Promise<UserResponseDto[]> {
    return this.userService.findByDepartment(department);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.LIBRARIAN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Buscar usuário por ID',
    description: 'Retorna um usuário específico pelo seu ID. Apenas administradores e bibliotecários podem acessar.'
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuário encontrado com sucesso',
    type: UserResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acesso negado - permissão insuficiente' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado' 
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Get('email/:email')
  @ApiOperation({ 
    summary: 'Buscar usuário por email',
    description: 'Retorna um usuário específico pelo seu email'
  })
  @ApiParam({ name: 'email', description: 'Email do usuário' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuário encontrado com sucesso',
    type: UserResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado' 
  })
  async findByEmail(@Param('email') email: string): Promise<UserResponseDto> {
    return this.userService.findByEmail(email);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.LIBRARIAN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Atualizar usuário',
    description: 'Atualiza os dados de um usuário existente. Apenas administradores e bibliotecários podem atualizar usuários.'
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuário atualizado com sucesso',
    type: UserResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos ou campos obrigatórios não preenchidos' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acesso negado - permissão insuficiente' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Email ou número de matrícula já está em uso' 
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body(ValidationPipe) updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Patch(':id/change-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.LIBRARIAN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Alterar senha',
    description: 'Altera a senha de um usuário existente. Apenas administradores e bibliotecários podem alterar senhas.'
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Senha alterada com sucesso',
    schema: { type: 'object', properties: { message: { type: 'string' } } }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Senha atual incorreta ou confirmação não confere' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acesso negado - permissão insuficiente' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado' 
  })
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto
  ): Promise<{ message: string }> {
    return this.userService.changePassword(id, changePasswordDto);
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.LIBRARIAN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Ativar usuário',
    description: 'Ativa um usuário previamente desativado. Apenas administradores e bibliotecários podem ativar usuários.'
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuário ativado com sucesso',
    type: UserResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acesso negado - permissão insuficiente' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado' 
  })
  async activate(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.userService.activate(id);
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.LIBRARIAN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Desativar usuário',
    description: 'Desativa um usuário (soft delete). Apenas administradores e bibliotecários podem desativar usuários.'
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuário desativado com sucesso',
    type: UserResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acesso negado - permissão insuficiente' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado' 
  })
  async deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.userService.deactivate(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Excluir usuário',
    description: 'Exclui permanentemente um usuário (apenas se não tiver empréstimos ou reservas ativas). Apenas administradores podem excluir usuários.'
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ 
    status: 204, 
    description: 'Usuário excluído com sucesso' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Não é possível excluir usuário com empréstimos ou reservas ativas' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acesso negado - permissão insuficiente' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado' 
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.userService.remove(id);
  }
}
