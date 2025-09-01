import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean, IsNumber, IsDateString, Min, Max, Length, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserType, StudentLevel } from '../../../enums';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome completo do usuário', example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  name: string;

  @ApiProperty({ description: 'Email do usuário', example: 'joao.silva@email.com' })
  @IsEmail()
  @IsNotEmpty()
  @Length(5, 255)
  email: string;

  @ApiPropertyOptional({ description: 'Telefone do usuário', example: '(11) 99999-9999' })
  @IsOptional()
  @IsString()
  @Length(10, 20)
  phone?: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'senha123' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 255)
  password: string;

  @ApiProperty({ description: 'Tipo de usuário', enum: UserType, example: UserType.STUDENT })
  @IsEnum(UserType)
  @IsNotEmpty()
  type: UserType;

  @ApiPropertyOptional({ description: 'Status ativo do usuário', default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  // Campos específicos para estudantes
  @ApiPropertyOptional({ description: 'Número de matrícula (para estudantes)', example: '2023001' })
  @IsOptional()
  @IsString()
  @Length(5, 20)
  registrationNumber?: string;

  @ApiPropertyOptional({ description: 'Curso (para estudantes)', example: 'Ciência da Computação' })
  @IsOptional()
  @IsString()
  @Length(2, 255)
  course?: string;

  @ApiPropertyOptional({ description: 'Nível acadêmico (para estudantes)', enum: StudentLevel, example: StudentLevel.UNDERGRADUATE })
  @IsOptional()
  @IsEnum(StudentLevel)
  level?: StudentLevel;

  // Campos específicos para professores
  @ApiPropertyOptional({ description: 'Departamento (para professores)', example: 'Departamento de Computação' })
  @IsOptional()
  @IsString()
  @Length(2, 255)
  department?: string;

  @ApiPropertyOptional({ description: 'Título acadêmico (para professores)', example: 'Doutor' })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  title?: string;

  @ApiPropertyOptional({ description: 'Data de admissão (para professores/funcionários)', example: '2023-01-15' })
  @IsOptional()
  @IsDateString()
  admissionDate?: string;

  // Configurações de limite
  @ApiPropertyOptional({ description: 'Limite de empréstimos', default: 3, minimum: 1, maximum: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  loanLimit?: number;

  @ApiPropertyOptional({ description: 'Dias de empréstimo', default: 7, minimum: 1, maximum: 30 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(30)
  loanDays?: number;
}
