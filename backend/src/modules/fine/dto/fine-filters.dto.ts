import { IsOptional, IsString, IsEnum, IsDateString, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { FineStatus } from '../../../enums';
import { Transform, Type } from 'class-transformer';

export class FineFiltersDto {
  @ApiPropertyOptional({ description: 'ID do usuário para filtrar multas', example: 'clx1234567890abcdef' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'ID do empréstimo para filtrar multas', example: 'clx1234567890abcdef' })
  @IsOptional()
  @IsString()
  loanId?: string;

  @ApiPropertyOptional({ description: 'Status da multa para filtrar', enum: FineStatus, example: FineStatus.PENDING })
  @IsOptional()
  @IsEnum(FineStatus)
  status?: FineStatus;

  @ApiPropertyOptional({ description: 'Valor mínimo da multa', example: 10.00, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amountFrom?: number;

  @ApiPropertyOptional({ description: 'Valor máximo da multa', example: 100.00, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amountTo?: number;

  @ApiPropertyOptional({ description: 'Data de criação a partir de', example: '2024-01-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  creationDateFrom?: string;

  @ApiPropertyOptional({ description: 'Data de criação até', example: '2024-01-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  creationDateTo?: string;

  @ApiPropertyOptional({ description: 'Data de vencimento a partir de', example: '2024-01-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  dueDateFrom?: string;

  @ApiPropertyOptional({ description: 'Data de vencimento até', example: '2024-01-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  dueDateTo?: string;

  @ApiPropertyOptional({ description: 'Filtrar apenas multas em atraso', example: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  overdue?: boolean;

  @ApiPropertyOptional({ description: 'Filtrar apenas multas pagas', example: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  paid?: boolean;

  @ApiPropertyOptional({ description: 'Filtrar por texto na descrição', example: 'atraso' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Dias mínimos de atraso', example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  daysOverdueMin?: number;

  @ApiPropertyOptional({ description: 'Dias máximos de atraso', example: 30, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  daysOverdueMax?: number;

  @ApiPropertyOptional({
    description: 'Número da página para paginação',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Quantidade de itens por página',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}