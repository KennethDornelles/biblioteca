export enum LoanStatus {
  ACTIVE = 'ACTIVE',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE',
  RENEWED = 'RENEWED',
  CANCELLED = 'CANCELLED',
}

export const LOAN_STATUS_LABELS: Record<LoanStatus, string> = {
  [LoanStatus.ACTIVE]: 'Ativo',
  [LoanStatus.RETURNED]: 'Devolvido',
  [LoanStatus.OVERDUE]: 'Em Atraso',
  [LoanStatus.RENEWED]: 'Renovado',
  [LoanStatus.CANCELLED]: 'Cancelado',
};

export const LOAN_STATUS_COLORS: Record<LoanStatus, string> = {
  [LoanStatus.ACTIVE]: 'success',
  [LoanStatus.RETURNED]: 'info',
  [LoanStatus.OVERDUE]: 'danger',
  [LoanStatus.RENEWED]: 'warning',
  [LoanStatus.CANCELLED]: 'secondary',
};

export const LOAN_STATUS_ICONS: Record<LoanStatus, string> = {
  [LoanStatus.ACTIVE]: 'check-circle',
  [LoanStatus.RETURNED]: 'arrow-undo',
  [LoanStatus.OVERDUE]: 'exclamation-triangle',
  [LoanStatus.RENEWED]: 'refresh',
  [LoanStatus.CANCELLED]: 'close-circle',
};
