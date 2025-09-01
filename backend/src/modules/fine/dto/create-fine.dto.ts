import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDateString, Min, Max, Length, IsDecimal } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FineStatus } from '../../../enums';
import { Transform, Type } from 'class-transformer';

export class CreateFineDto {
  @ApiProperty({ description: 'ID do empréstimo relacionado à multa', example: 'clx1234567890abcdef' })
  @IsString()
  @IsNotEmpty()
  loanId: string;

  @ApiProperty({ description: 'ID do usuário que recebeu a multa', example: 'clx1234567890abcdef' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Valor da multa', example: 15.50, minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  amount: number;

  @ApiProperty({ description: 'Número de dias em atraso', example: 5, minimum: 1 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  daysOverdue: number;

  @ApiProperty({ description: 'Data de vencimento da multa', example: '2024-02-15T10:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @ApiPropertyOptional({ description: 'Status da multa (padrão: PENDING)', enum: FineStatus, example: FineStatus.PENDING })
  @IsOptional()
  @IsEnum(FineStatus)
  status?: FineStatus;

  @ApiPropertyOptional({ description: 'Descrição da multa', example: 'Multa por atraso na devolução', maxLength: 500 })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;
}
