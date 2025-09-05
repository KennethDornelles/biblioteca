import { LoanStatus } from '../enums';
import { ILoan, ICreateLoan, IUpdateLoan, ILoanFilters, ILoanSearchParams, ILoanResponse, IPaginatedLoans, ILoanStatistics, ILoanRenewalRequest, ILoanReturnRequest, ILoanOverdueInfo } from '../interfaces';

// Tipos de entrada para criação e atualização
export type CreateLoanInput = ICreateLoan;
export type UpdateLoanInput = IUpdateLoan;

// Tipos de filtros e busca
export type LoanFilters = ILoanFilters;
export type LoanSearchParams = ILoanSearchParams;

// Tipos de resposta
export type LoanResponse = ILoanResponse;
export type PaginatedLoans = IPaginatedLoans;
export type LoanStatistics = ILoanStatistics;

// Tipos de validação
export type LoanValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  canLoan: boolean;
  reasons: string[];
};

// Tipos de operações
export type LoanOperation = 'create' | 'return' | 'renew' | 'cancel' | 'extend' | 'overdue_check';

// Tipos de eventos
export type LoanEvent = {
  operation: LoanOperation;
  loanId: string;
  userId: string;
  librarianId?: string;
  timestamp: Date;
  details: Record<string, any>;
};

// Tipos de relatórios
export type LoanReport = {
  period: {
    start: Date;
    end: Date;
  };
  statistics: LoanStatistics;
  topBorrowers: Array<{
    userId: string;
    userName: string;
    loanCount: number;
    overdueCount: number;
    totalFines: number;
  }>;
  topMaterials: Array<{
    materialId: string;
    materialTitle: string;
    loanCount: number;
    averageLoanDuration: number;
  }>;
  overdueAnalysis: {
    totalOverdue: number;
    averageDaysOverdue: number;
    maxDaysOverdue: number;
    overdueByDay: Array<{
      days: number;
      count: number;
    }>;
  };
};

// Tipos de renovação
export type LoanRenewalRequest = ILoanRenewalRequest;
export type LoanRenewalResult = {
  success: boolean;
  newDueDate: Date;
  renewalsRemaining: number;
  message: string;
  errors?: string[];
};

// Tipos de devolução
export type LoanReturnRequest = ILoanReturnRequest;
export type LoanReturnResult = {
  success: boolean;
  returnDate: Date;
  overdueDays: number;
  fineAmount: number;
  message: string;
  warnings?: string[];
};

// Tipos de verificação de atraso
export type LoanOverdueInfo = ILoanOverdueInfo;
export type OverdueCheckResult = {
  isOverdue: boolean;
  daysOverdue: number;
  fineAmount: number;
  canRenew: boolean;
  maxFineAmount: number;
  recommendations: string[];
};

// Tipos de configuração
export type LoanConfig = {
  defaultLoanDays: number;
  maxRenewals: number;
  renewalExtensionDays: number;
  overdueFineRate: number;
  maxFineAmount: number;
  gracePeriodDays: number;
  maxConcurrentLoans: number;
  loanLimitByUserType: Record<string, number>;
  loanDaysByUserType: Record<string, number>;
  loanDaysByMaterialType: Record<string, number>;
  canRenewOverdue: boolean;
  autoOverdueCheck: boolean;
  overdueCheckInterval: number; // em horas
};

// Tipos de notificações
export type LoanNotification = {
  id: string;
  userId: string;
  loanId: string;
  type: 'due_soon' | 'overdue' | 'return_reminder' | 'renewal_available';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  readAt?: Date;
  sentAt?: Date;
  channel: 'email' | 'sms' | 'push' | 'in_app';
};

// Tipos de auditoria
export type LoanAuditLog = {
  id: string;
  loanId: string;
  userId: string;
  librarianId?: string;
  action: string;
  timestamp: Date;
  oldValues?: Partial<ILoan>;
  newValues?: Partial<ILoan>;
  ipAddress?: string;
  userAgent?: string;
  observations?: string;
};

// Tipos de importação/exportação
export type LoanImportData = Omit<ICreateLoan, 'id' | 'createdAt' | 'updatedAt'> & {
  externalId?: string;
  batchId?: string;
};

export type LoanExportFormat = 'csv' | 'json' | 'xml' | 'pdf';

export type LoanExportOptions = {
  format: LoanExportFormat;
  includeDetails: boolean;
  filters?: LoanFilters;
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeUserInfo: boolean;
  includeMaterialInfo: boolean;
};
