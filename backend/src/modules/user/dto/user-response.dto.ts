import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserType, StudentLevel } from '../../../enums';

export class UserResponseDto {
  @ApiProperty({ description: 'ID único do usuário' })
  id: string;

  @ApiProperty({ description: 'Nome completo do usuário' })
  name: string;

  @ApiProperty({ description: 'Email do usuário' })
  email: string;

  @ApiPropertyOptional({ description: 'Telefone do usuário' })
  phone?: string;

  @ApiProperty({ description: 'Data de registro' })
  registrationDate: Date;

  @ApiProperty({ description: 'Tipo de usuário', enum: UserType })
  type: UserType;

  @ApiProperty({ description: 'Status ativo do usuário' })
  active: boolean;

  // Campos específicos do tipo de usuário
  @ApiPropertyOptional({ description: 'Número de matrícula (para estudantes)' })
  registrationNumber?: string;

  @ApiPropertyOptional({ description: 'Curso (para estudantes)' })
  course?: string;

  @ApiPropertyOptional({ description: 'Nível acadêmico (para estudantes)', enum: StudentLevel })
  level?: StudentLevel;

  @ApiPropertyOptional({ description: 'Departamento (para professores)' })
  department?: string;

  @ApiPropertyOptional({ description: 'Título acadêmico (para professores)' })
  title?: string;

  @ApiPropertyOptional({ description: 'Data de admissão (para professores/funcionários)' })
  admissionDate?: Date;

  // Configurações de limite
  @ApiProperty({ description: 'Limite de empréstimos' })
  loanLimit: number;

  @ApiProperty({ description: 'Dias de empréstimo' })
  loanDays: number;

  // Campos de auditoria
  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização' })
  updatedAt: Date;
}
