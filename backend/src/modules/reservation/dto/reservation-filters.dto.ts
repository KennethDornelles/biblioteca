import { IsOptional, IsString, IsEnum, IsDateString, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ReservationStatus } from '../../../enums';
import { Transform, Type } from 'class-transformer';

export class ReservationFiltersDto {
  @ApiPropertyOptional({ description: 'ID do usuário para filtrar reservas', example: 'clx1234567890abcdef' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'ID do material para filtrar reservas', example: 'clx1234567890abcdef' })
  @IsOptional()
  @IsString()
  materialId?: string;

  @ApiPropertyOptional({ description: 'Status da reserva para filtrar', enum: ReservationStatus, example: ReservationStatus.ACTIVE })
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @ApiPropertyOptional({ description: 'Data de reserva a partir de', example: '2024-01-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  reservationDateFrom?: string;

  @ApiPropertyOptional({ description: 'Data de reserva até', example: '2024-01-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  reservationDateTo?: string;

  @ApiPropertyOptional({ description: 'Data de expiração a partir de', example: '2024-01-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  expirationDateFrom?: string;

  @ApiPropertyOptional({ description: 'Data de expiração até', example: '2024-01-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  expirationDateTo?: string;

  @ApiPropertyOptional({ description: 'Prioridade mínima da reserva', example: 1, minimum: 1, maximum: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(10)
  priorityMin?: number;

  @ApiPropertyOptional({ description: 'Prioridade máxima da reserva', example: 5, minimum: 1, maximum: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(10)
  priorityMax?: number;

  @ApiPropertyOptional({ description: 'Filtrar apenas reservas ativas', example: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({ description: 'Filtrar apenas reservas expiradas', example: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  expired?: boolean;

  @ApiPropertyOptional({ description: 'Filtrar por texto nas observações', example: 'pesquisa' })
  @IsOptional()
  @IsString()
  observations?: string;

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