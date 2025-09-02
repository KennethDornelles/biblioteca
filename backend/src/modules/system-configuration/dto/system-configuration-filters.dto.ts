import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SystemConfigurationFiltersDto {
  @ApiPropertyOptional({ description: 'Chave da configuração para filtrar', example: 'library.name' })
  @IsOptional()
  @IsString()
  key?: string;

  @ApiPropertyOptional({ description: 'Tipo de dados para filtrar', example: 'string' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'Categoria para filtrar', example: 'library' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filtrar por configurações editáveis', example: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  editable?: boolean;

  @ApiPropertyOptional({ description: 'Número da página', example: 1, minimum: 1, default: 1 })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiPropertyOptional({ description: 'Itens por página', example: 10, minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @IsString()
  limit?: string;
}
