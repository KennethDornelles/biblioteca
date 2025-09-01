import { PartialType, OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';
import { UserType, StudentLevel } from '../../../enums';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Nome completo do usuário' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Email do usuário' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Telefone do usuário' })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Tipo de usuário', enum: UserType })
  @IsOptional()
  type?: UserType;

  @ApiPropertyOptional({ description: 'Status ativo do usuário' })
  @IsOptional()
  active?: boolean;

  // Campos específicos para estudantes
  @ApiPropertyOptional({ description: 'Número de matrícula (para estudantes)' })
  @IsOptional()
  registrationNumber?: string;

  @ApiPropertyOptional({ description: 'Curso (para estudantes)' })
  @IsOptional()
  course?: string;

  @ApiPropertyOptional({ description: 'Nível acadêmico (para estudantes)', enum: StudentLevel })
  @IsOptional()
  level?: StudentLevel;

  // Campos específicos para professores
  @ApiPropertyOptional({ description: 'Departamento (para professores)' })
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ description: 'Título acadêmico (para professores)' })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Data de admissão (para professores/funcionários)' })
  @IsOptional()
  @IsDateString()
  admissionDate?: string;

  // Configurações de limite
  @ApiPropertyOptional({ description: 'Limite de empréstimos' })
  @IsOptional()
  loanLimit?: number;

  @ApiPropertyOptional({ description: 'Dias de empréstimo' })
  @IsOptional()
  loanDays?: number;
}
