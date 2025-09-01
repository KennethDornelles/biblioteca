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
  ValidationPipe
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

@ApiTags('Usuários')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Criar novo usuário',
    description: 'Cria um novo usuário no sistema com validações específicas por tipo'
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuário criado com sucesso',
    type: UserResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos ou campos obrigatórios não preenchidos' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Email ou número de matrícula já está em uso' 
  })
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar usuários',
    description: 'Lista todos os usuários com filtros e paginação'
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
  async findAll(@Query(ValidationPipe) filters: UserFiltersDto): Promise<PaginatedUsersDto> {
    return this.userService.findAll(filters);
  }

  @Get('type/:type')
  @ApiOperation({ 
    summary: 'Listar usuários por tipo',
    description: 'Lista todos os usuários de um tipo específico'
  })
  @ApiParam({ name: 'type', enum: UserType, description: 'Tipo de usuário' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuários por tipo retornada com sucesso',
    type: [UserResponseDto] 
  })
  async findByType(@Param('type') type: UserType): Promise<UserResponseDto[]> {
    return this.userService.findByType(type);
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
  @ApiOperation({ 
    summary: 'Buscar usuário por ID',
    description: 'Retorna um usuário específico pelo seu ID'
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuário encontrado com sucesso',
    type: UserResponseDto 
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
  @ApiOperation({ 
    summary: 'Atualizar usuário',
    description: 'Atualiza os dados de um usuário existente'
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
  @ApiOperation({ 
    summary: 'Alterar senha',
    description: 'Altera a senha de um usuário existente'
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
  @ApiOperation({ 
    summary: 'Ativar usuário',
    description: 'Ativa um usuário previamente desativado'
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuário ativado com sucesso',
    type: UserResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado' 
  })
  async activate(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.userService.activate(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ 
    summary: 'Desativar usuário',
    description: 'Desativa um usuário (soft delete)'
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuário desativado com sucesso',
    type: UserResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado' 
  })
  async deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.userService.deactivate(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Excluir usuário',
    description: 'Exclui permanentemente um usuário (apenas se não tiver empréstimos ou reservas ativas)'
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
    status: 404, 
    description: 'Usuário não encontrado' 
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.userService.remove(id);
  }
}
