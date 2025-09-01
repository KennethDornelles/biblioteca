import { FineStatus } from '../enums';

export interface IFine {
  id: string;
  loanId: string;
  userId: string;
  amount: number;
  daysOverdue: number;
  creationDate: Date;
  dueDate: Date;
  paymentDate?: Date;
  status: FineStatus;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateFine {
  loanId: string;
  userId: string;
  amount: number;
  daysOverdue: number;
  dueDate: Date;
  description?: string;
}

export interface IUpdateFine {
  status?: FineStatus;
  paymentDate?: Date;
  description?: string;
}

export interface IFineFilters {
  userId?: string;
  loanId?: string;
  status?: FineStatus;
  amountFrom?: number;
  amountTo?: number;
  creationDateFrom?: Date;
  creationDateTo?: Date;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  overdue?: boolean;
  paid?: boolean;
}

export interface IFineSearchParams {
  filters?: IFineFilters;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IFineResponse {
  id: string;
  loanId: string;
  userId: string;
  amount: number;
  daysOverdue: number;
  creationDate: Date;
  dueDate: Date;
  paymentDate?: Date;
  status: FineStatus;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  statusLabel: string;
  statusColor: string;
  statusIcon: string;
  isOverdue: boolean;
  daysUntilDue: number;
  formattedAmount: string;
  user?: {
    id: string;
    name: string;
    email: string;
    registrationNumber?: string;
  };
  loan?: {
    id: string;
    materialId: string;
    loanDate: Date;
    dueDate: Date;
    material?: {
      title: string;
      author: string;
    };
  };
}

export interface IPaginatedFines {
  fines: IFineResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IFineStatistics {
  total: number;
  pending: number;
  paid: number;
  cancelled: number;
  installment: number;
  totalAmount: number;
  pendingAmount: number;
  paidAmount: number;
  averageAmount: number;
  byStatus: Record<FineStatus, number>;
  byMonth: Record<string, number>;
}

export interface IFinePaymentRequest {
  fineId: string;
  amount: number;
  paymentMethod: string;
  paymentDate?: Date;
  observations?: string;
}

export interface IFineInstallmentRequest {
  fineId: string;
  numberOfInstallments: number;
  installmentAmount: number;
  firstDueDate: Date;
  observations?: string;
}

export interface IFineCalculation {
  loanId: string;
  userId: string;
  daysOverdue: number;
  dailyRate: number;
  maxFineAmount: number;
  calculatedAmount: number;
  finalAmount: number;
  canInstallment: boolean;
  maxInstallments: number;
}
