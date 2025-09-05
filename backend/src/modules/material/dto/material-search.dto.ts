import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { MaterialFiltersDto } from './material-filters.dto';

export class MaterialSearchDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  filters?: MaterialFiltersDto;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}

