import { LoanResponseDto } from './loan-response.dto';

export class PaginatedLoansDto {
  loans: LoanResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

