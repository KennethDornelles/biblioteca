import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { LoanFiltersDto } from './loan-filters.dto';

export class LoanSearchDto {
  @IsOptional()
  filters?: LoanFiltersDto;

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

