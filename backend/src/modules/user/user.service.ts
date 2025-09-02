import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { UserType, StudentLevel } from '../../enums';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { PaginatedUsersDto } from './dto/paginated-users.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { AUTH_CONFIG } from '../../config/auth.config';

@Injectable()
export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Verificar se o email já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email }
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Verificar se o número de matrícula já existe (para estudantes)
    if (createUserDto.registrationNumber) {
      const existingRegistration = await this.prisma.user.findUnique({
        where: { registrationNumber: createUserDto.registrationNumber }
      });

      if (existingRegistration) {
        throw new ConflictException('Número de matrícula já está em uso');
      }
    }

    // Validar campos específicos por tipo de usuário
    this.validateUserTypeFields(createUserDto);

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(createUserDto.password, AUTH_CONFIG.bcrypt.saltRounds);

    // Preparar dados para criação
    const userData = {
      ...createUserDto,
      password: hashedPassword,
      registrationDate: new Date(),
      active: createUserDto.active ?? true,
      loanLimit: createUserDto.loanLimit ?? 3,
      loanDays: createUserDto.loanDays ?? 7,
    };

    // Converter string de data para Date se existir
    if (createUserDto.admissionDate) {
      userData.admissionDate = new Date(createUserDto.admissionDate).toISOString();
    }

    const user = await this.prisma.user.create({
      data: userData
    });

    return this.mapToResponseDto(user);
  }

  async findAll(filters: UserFiltersDto): Promise<PaginatedUsersDto> {
    const { page = 1, limit = 10, ...filterFields } = filters;
    const skip = (page - 1) * limit;

    // Construir filtros do Prisma
    const where = this.buildWhereClause(filterFields);

    // Buscar usuários com paginação
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.user.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data: users.map(user => this.mapToResponseDto(user)),
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage
    };
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return this.mapToResponseDto(user);
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new NotFoundException(`Usuário com email ${email} não encontrado`);
    }

    return this.mapToResponseDto(user);
  }

  async findAuthDataByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return user;
  }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    // Verificar se o usuário existe
    const existingUser = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    // Verificar se o email já existe (se estiver sendo alterado)
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email }
      });

      if (emailExists) {
        throw new ConflictException('Email já está em uso');
      }
    }

    // Verificar se o número de matrícula já existe (se estiver sendo alterado)
    if (updateUserDto.registrationNumber && updateUserDto.registrationNumber !== existingUser.registrationNumber) {
      const registrationExists = await this.prisma.user.findUnique({
        where: { registrationNumber: updateUserDto.registrationNumber }
      });

      if (registrationExists) {
        throw new ConflictException('Número de matrícula já está em uso');
      }
    }

    // Validar campos específicos por tipo de usuário
    const userForValidation: Partial<CreateUserDto> = {
      ...existingUser,
      ...updateUserDto,
      type: (updateUserDto.type ?? existingUser.type) as UserType,
      phone: updateUserDto.phone ?? existingUser.phone ?? undefined,
      registrationNumber: updateUserDto.registrationNumber ?? existingUser.registrationNumber ?? undefined,
      course: updateUserDto.course ?? existingUser.course ?? undefined,
      level: (updateUserDto.level ?? existingUser.level) as StudentLevel | undefined,
      department: updateUserDto.department ?? existingUser.department ?? undefined,
      title: updateUserDto.title ?? existingUser.title ?? undefined,
      admissionDate: updateUserDto.admissionDate ?? existingUser.admissionDate?.toISOString().substring(0, 10) ?? undefined,
    };
    this.validateUserTypeFields(userForValidation);

    // Preparar dados para atualização
    const updateData = { ...updateUserDto };

    // Converter string de data para Date se existir
    if (updateUserDto.admissionDate) {
      updateData.admissionDate = new Date(updateUserDto.admissionDate).toISOString();
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData
    });

    return this.mapToResponseDto(updatedUser);
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    // Verificar se a senha atual está correta
    const isCurrentPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Senha atual incorreta');
    }

    // Verificar se a nova senha é diferente da atual
    if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
      throw new BadRequestException('A nova senha deve ser diferente da senha atual');
    }

    // Verificar se a confirmação de senha está correta
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('A confirmação de senha não confere');
    }

    // Criptografar nova senha
    const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, AUTH_CONFIG.bcrypt.saltRounds);

    // Atualizar senha
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedNewPassword }
    });

    return { message: 'Senha alterada com sucesso' };
  }

  async remove(id: string): Promise<{ message: string }> {
    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    // Verificar se o usuário tem empréstimos ativos
    const activeLoans = await this.prisma.loan.count({
      where: {
        userId: id,
        status: { in: ['ACTIVE', 'OVERDUE'] }
      }
    });

    if (activeLoans > 0) {
      throw new BadRequestException('Não é possível excluir usuário com empréstimos ativos');
    }

    // Verificar se o usuário tem reservas ativas
    const activeReservations = await this.prisma.reservation.count({
      where: {
        userId: id,
        status: 'ACTIVE'
      }
    });

    if (activeReservations > 0) {
      throw new BadRequestException('Não é possível excluir usuário com reservas ativas');
    }

    // Excluir usuário
    await this.prisma.user.delete({
      where: { id }
    });

    return { message: 'Usuário excluído com sucesso' };
  }

  async deactivate(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { active: false }
    });

    return this.mapToResponseDto(user);
  }

  async activate(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { active: true }
    });

    return this.mapToResponseDto(user);
  }

  async findByType(type: UserType): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      where: { type, active: true },
      orderBy: { name: 'asc' }
    });

    return users.map(user => this.mapToResponseDto(user));
  }

  async findByCourse(course: string): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      where: { 
        course: { contains: course, mode: 'insensitive' },
        active: true 
      },
      orderBy: { name: 'asc' }
    });

    return users.map(user => this.mapToResponseDto(user));
  }

  async findByDepartment(department: string): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      where: { 
        department: { contains: department, mode: 'insensitive' },
        active: true 
      },
      orderBy: { name: 'asc' }
    });

    return users.map(user => this.mapToResponseDto(user));
  }

  private validateUserTypeFields(userData: Partial<CreateUserDto>): void {
    const { type, registrationNumber, course, level, department, title } = userData;

    if (type === UserType.STUDENT) {
      if (!registrationNumber) {
        throw new BadRequestException('Número de matrícula é obrigatório para estudantes');
      }
      if (!course) {
        throw new BadRequestException('Curso é obrigatório para estudantes');
      }
      if (!level) {
        throw new BadRequestException('Nível acadêmico é obrigatório para estudantes');
      }
    }

    if (type === UserType.PROFESSOR) {
      if (!department) {
        throw new BadRequestException('Departamento é obrigatório para professores');
      }
      if (!title) {
        throw new BadRequestException('Título acadêmico é obrigatório para professores');
      }
    }
  }

  private buildWhereClause(filters: Partial<UserFiltersDto>): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {};

    if (filters.name) {
      where.name = { contains: filters.name, mode: 'insensitive' };
    }

    if (filters.email) {
      where.email = { contains: filters.email, mode: 'insensitive' };
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.active !== undefined) {
      where.active = filters.active;
    }

    if (filters.registrationNumber) {
      where.registrationNumber = { contains: filters.registrationNumber, mode: 'insensitive' };
    }

    if (filters.course) {
      where.course = { contains: filters.course, mode: 'insensitive' };
    }

    if (filters.level) {
      where.level = filters.level;
    }

    if (filters.department) {
      where.department = { contains: filters.department, mode: 'insensitive' };
    }

    return where;
  }

  private mapToResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? undefined,
      registrationDate: user.registrationDate,
      type: user.type as UserType,
      active: user.active,
      registrationNumber: user.registrationNumber ?? undefined,
      course: user.course ?? undefined,
      level: user.level as StudentLevel | undefined,
      department: user.department ?? undefined,
      title: user.title ?? undefined,
      admissionDate: user.admissionDate ?? undefined,
      loanLimit: user.loanLimit,
      loanDays: user.loanDays,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
