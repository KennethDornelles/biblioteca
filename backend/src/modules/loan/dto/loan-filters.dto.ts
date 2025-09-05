import { IsOptional, IsString, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { LoanStatus } from '../../../enums';

export class LoanFiltersDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  materialId?: string;

  @IsOptional()
  @IsString()
  librarianId?: string;

  @IsOptional()
  @IsEnum(LoanStatus)
  status?: LoanStatus;

  @IsOptional()
  @IsDateString()
  loanDateFrom?: string;

  @IsOptional()
  @IsDateString()
  loanDateTo?: string;

  @IsOptional()
  @IsDateString()
  dueDateFrom?: string;

  @IsOptional()
  @IsDateString()
  dueDateTo?: string;

  @IsOptional()
  @IsBoolean()
  overdue?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

