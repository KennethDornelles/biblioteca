import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ReviewFiltersDto {
  @ApiPropertyOptional({ description: 'ID do usuário para filtrar reviews', example: 'clx1234567890abcdef' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'ID do material para filtrar reviews', example: 'clx1234567890abcdef' })
  @IsOptional()
  @IsString()
  materialId?: string;

  @ApiPropertyOptional({ description: 'Nota específica para filtrar', example: 5, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Transform(({ value }) => parseInt(value))
  rating?: number;

  @ApiPropertyOptional({ description: 'Nota mínima para filtrar', example: 3, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Transform(({ value }) => parseInt(value))
  minRating?: number;

  @ApiPropertyOptional({ description: 'Nota máxima para filtrar', example: 5, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Transform(({ value }) => parseInt(value))
  maxRating?: number;

  @ApiPropertyOptional({ description: 'Filtrar apenas reviews com comentários', example: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  hasComment?: boolean;

  @ApiPropertyOptional({ description: 'Número da página', example: 1, minimum: 1, default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiPropertyOptional({ description: 'Itens por página', example: 10, minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value))
  limit?: number;
}
