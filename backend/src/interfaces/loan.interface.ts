import { LoanStatus } from '../enums';

export interface ILoan {
  id: string;
  userId: string;
  materialId: string;
  librarianId?: string;
  loanDate: Date;
  dueDate: Date;
  returnDate?: Date;
  renewalDate?: Date;
  status: LoanStatus;
  renewals: number;
  maxRenewals: number;
  observations?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateLoan {
  userId: string;
  materialId: string;
  librarianId?: string;
  loanDate?: Date;
  dueDate: Date;
  maxRenewals?: number;
  observations?: string;
}

export interface IUpdateLoan {
  status?: LoanStatus;
  returnDate?: Date;
  renewalDate?: Date;
  renewals?: number;
  observations?: string;
}

export interface ILoanFilters {
  userId?: string;
  materialId?: string;
  librarianId?: string;
  status?: LoanStatus;
  loanDateFrom?: Date;
  loanDateTo?: Date;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  overdue?: boolean;
  active?: boolean;
}

export interface ILoanSearchParams {
  filters?: ILoanFilters;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ILoanResponse {
  id: string;
  userId: string;
  materialId: string;
  librarianId?: string;
  loanDate: Date;
  dueDate: Date;
  returnDate?: Date;
  renewalDate?: Date;
  status: LoanStatus;
  renewals: number;
  maxRenewals: number;
  observations?: string;
  createdAt: Date;
  updatedAt: Date;
  statusLabel: string;
  statusColor: string;
  statusIcon: string;
  isOverdue: boolean;
  daysOverdue: number;
  canRenew: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    registrationNumber?: string;
  };
  material?: {
    id: string;
    title: string;
    author: string;
    isbn?: string;
    assetNumber?: string;
  };
  librarian?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface IPaginatedLoans {
  loans: ILoanResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ILoanStatistics {
  total: number;
  active: number;
  returned: number;
  overdue: number;
  renewed: number;
  cancelled: number;
  overdueCount: number;
  averageLoanDuration: number;
  averageRenewals: number;
  byStatus: Record<LoanStatus, number>;
  byMonth: Record<string, number>;
}

export interface ILoanRenewalRequest {
  loanId: string;
  userId: string;
  librarianId?: string;
  observations?: string;
}

export interface ILoanReturnRequest {
  loanId: string;
  librarianId: string;
  returnDate?: Date;
  observations?: string;
}

export interface ILoanOverdueInfo {
  loanId: string;
  userId: string;
  materialId: string;
  daysOverdue: number;
  fineAmount: number;
  canRenew: boolean;
  maxFineAmount: number;
}
