import { LoanStatus, LOAN_STATUS_LABELS, LOAN_STATUS_COLORS, LOAN_STATUS_ICONS } from '../enums';
import { ILoan, ILoanResponse, ILoanFilters, ILoanSearchParams, ILoanStatistics, ILoanOverdueInfo } from '../interfaces';
import { LOAN_DEFAULT_CONFIG, LOAN_CONFIG_BY_USER_TYPE, LOAN_CONFIG_BY_MATERIAL_TYPE, LOAN_FINE_CONFIG, LOAN_VALIDATION_CONSTRAINTS } from '../constants';

/**
 * Valida um empréstimo antes de salvar
 */
export function validateLoan(loan: Partial<ILoan>): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validação do usuário
  if (!loan.userId) {
    errors.push('Usuário é obrigatório');
  }

  // Validação do material
  if (!loan.materialId) {
    errors.push('Material é obrigatório');
  }

  // Validação da data de vencimento
  if (loan.dueDate) {
    const now = new Date();
    if (loan.dueDate <= now) {
      errors.push('Data de vencimento deve ser futura');
    }
  } else {
    errors.push('Data de vencimento é obrigatória');
  }

  // Validação das renovações
  if (loan.maxRenewals !== undefined) {
    if (loan.maxRenewals < LOAN_VALIDATION_CONSTRAINTS.MAX_RENEWALS.MIN) {
      errors.push(`Máximo de renovações deve ser maior que ${LOAN_VALIDATION_CONSTRAINTS.MAX_RENEWALS.MIN}`);
    }
    if (loan.maxRenewals > LOAN_VALIDATION_CONSTRAINTS.MAX_RENEWALS.MAX) {
      errors.push(`Máximo de renovações deve ser menor que ${LOAN_VALIDATION_CONSTRAINTS.MAX_RENEWALS.MAX}`);
    }
  }

  // Validação das observações
  if (loan.observations && loan.observations.length > 1000) {
    errors.push('Observações devem ter no máximo 1000 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Converte um empréstimo para resposta formatada
 */
export function formatLoanResponse(loan: ILoan): ILoanResponse {
  const now = new Date();
  const isOverdue = loan.status === LoanStatus.ACTIVE && loan.dueDate < now;
  const daysOverdue = isOverdue ? Math.ceil((now.getTime() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const canRenew = loan.status === LoanStatus.ACTIVE && loan.renewals < loan.maxRenewals && !isOverdue;

  return {
    ...loan,
    statusLabel: LOAN_STATUS_LABELS[loan.status],
    statusColor: LOAN_STATUS_COLORS[loan.status],
    statusIcon: LOAN_STATUS_ICONS[loan.status],
    isOverdue,
    daysOverdue,
    canRenew,
  };
}

/**
 * Aplica filtros a uma lista de empréstimos
 */
export function filterLoans(loans: ILoan[], filters: ILoanFilters): ILoan[] {
  return loans.filter(loan => {
    if (filters.userId && loan.userId !== filters.userId) {
      return false;
    }

    if (filters.materialId && loan.materialId !== filters.materialId) {
      return false;
    }

    if (filters.librarianId && loan.librarianId !== filters.librarianId) {
      return false;
    }

    if (filters.status && loan.status !== filters.status) {
      return false;
    }

    if (filters.loanDateFrom && loan.loanDate < filters.loanDateFrom) {
      return false;
    }

    if (filters.loanDateTo && loan.loanDate > filters.loanDateTo) {
      return false;
    }

    if (filters.dueDateFrom && loan.dueDate < filters.dueDateFrom) {
      return false;
    }

    if (filters.dueDateTo && loan.dueDate > filters.dueDateTo) {
      return false;
    }

    if (filters.overdue !== undefined) {
      const now = new Date();
      const isOverdue = loan.status === LoanStatus.ACTIVE && loan.dueDate < now;
      if (filters.overdue !== isOverdue) {
        return false;
      }
    }

    if (filters.active !== undefined) {
      const isActive = loan.status === LoanStatus.ACTIVE;
      if (filters.active !== isActive) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Aplica parâmetros de busca e ordenação
 */
export function applyLoanSearchParams(
  loans: ILoan[],
  params: ILoanSearchParams
): { loans: ILoan[]; total: number } {
  let filteredLoans = loans;

  // Aplicar filtros
  if (params.filters) {
    filteredLoans = filterLoans(loans, params.filters);
  }

  // Aplicar ordenação
  if (params.sortBy && params.sortOrder) {
    filteredLoans.sort((a, b) => {
      const aValue = a[params.sortBy as keyof ILoan];
      const bValue = b[params.sortBy as keyof ILoan];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return params.sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return params.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return params.sortOrder === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      return 0;
    });
  }

  return {
    loans: filteredLoans,
    total: filteredLoans.length,
  };
}

/**
 * Aplica paginação aos resultados
 */
export function paginateLoans(
  loans: ILoan[],
  page: number = 1,
  limit: number = 20
): { loans: ILoan[]; total: number; page: number; limit: number; totalPages: number; hasNext: boolean; hasPrev: boolean } {
  const total = loans.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedLoans = loans.slice(startIndex, endIndex);

  return {
    loans: paginatedLoans,
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Calcula estatísticas dos empréstimos
 */
export function calculateLoanStatistics(loans: ILoan[]): ILoanStatistics {
  const total = loans.length;
  const byStatus = loans.reduce((acc, loan) => {
    acc[loan.status] = (acc[loan.status] || 0) + 1;
    return acc;
  }, {} as Record<LoanStatus, number>);

  const now = new Date();
  const overdueLoans = loans.filter(loan => 
    loan.status === LoanStatus.ACTIVE && loan.dueDate < now
  );

  const totalLoanDuration = loans
    .filter(loan => loan.returnDate)
    .reduce((acc, loan) => {
      const duration = Math.ceil((loan.returnDate!.getTime() - loan.loanDate.getTime()) / (1000 * 60 * 60 * 24));
      return acc + duration;
    }, 0);

  const returnedLoans = loans.filter(loan => loan.returnDate);
  const averageLoanDuration = returnedLoans.length > 0 ? totalLoanDuration / returnedLoans.length : 0;

  const totalRenewals = loans.reduce((acc, loan) => acc + loan.renewals, 0);
  const averageRenewals = total > 0 ? totalRenewals / total : 0;

  // Agrupar por mês
  const byMonth: Record<string, number> = {};
  loans.forEach(loan => {
    const monthKey = `${loan.loanDate.getFullYear()}-${String(loan.loanDate.getMonth() + 1).padStart(2, '0')}`;
    byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;
  });

  return {
    total,
    active: byStatus[LoanStatus.ACTIVE] || 0,
    returned: byStatus[LoanStatus.RETURNED] || 0,
    overdue: byStatus[LoanStatus.OVERDUE] || 0,
    renewed: byStatus[LoanStatus.RENEWED] || 0,
    cancelled: byStatus[LoanStatus.CANCELLED] || 0,
    overdueCount: overdueLoans.length,
    averageLoanDuration,
    averageRenewals,
    byStatus,
    byMonth,
  };
}

/**
 * Verifica se um empréstimo está em atraso
 */
export function isLoanOverdue(loan: ILoan): boolean {
  if (loan.status !== LoanStatus.ACTIVE) {
    return false;
  }
  const now = new Date();
  return loan.dueDate < now;
}

/**
 * Calcula os dias de atraso de um empréstimo
 */
export function calculateOverdueDays(loan: ILoan): number {
  if (!isLoanOverdue(loan)) {
    return 0;
  }
  const now = new Date();
  return Math.ceil((now.getTime() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Calcula o valor da multa para um empréstimo em atraso
 */
export function calculateFineAmount(loan: ILoan): number {
  const overdueDays = calculateOverdueDays(loan);
  if (overdueDays <= LOAN_FINE_CONFIG.GRACE_PERIOD_DAYS) {
    return 0;
  }

  const fineAmount = (overdueDays - LOAN_FINE_CONFIG.GRACE_PERIOD_DAYS) * LOAN_FINE_CONFIG.DAILY_RATE;
  return Math.min(fineAmount, LOAN_FINE_CONFIG.MAX_AMOUNT);
}

/**
 * Verifica se um empréstimo pode ser renovado
 */
export function canLoanBeRenewed(loan: ILoan): boolean {
  if (loan.status !== LoanStatus.ACTIVE) {
    return false;
  }

  if (loan.renewals >= loan.maxRenewals) {
    return false;
  }

  if (isLoanOverdue(loan)) {
    return false;
  }

  return true;
}

/**
 * Calcula a nova data de vencimento para uma renovação
 */
export function calculateRenewalDueDate(loan: ILoan, materialType: string): Date {
  const config = LOAN_CONFIG_BY_MATERIAL_TYPE[materialType as keyof typeof LOAN_CONFIG_BY_MATERIAL_TYPE];
  const extensionDays = config ? config.loanDays : LOAN_DEFAULT_CONFIG.DEFAULT_LOAN_DAYS;
  
  const newDueDate = new Date(loan.dueDate);
  newDueDate.setDate(newDueDate.getDate() + extensionDays);
  
  return newDueDate;
}

/**
 * Verifica se um usuário pode fazer um novo empréstimo
 */
export function canUserBorrow(userId: string, userType: string, currentLoans: number, hasOverdueFines: boolean): boolean {
  const config = LOAN_CONFIG_BY_USER_TYPE[userType as keyof typeof LOAN_CONFIG_BY_USER_TYPE];
  if (!config) {
    return false;
  }

  if (currentLoans >= config.loanLimit) {
    return false;
  }

  if (hasOverdueFines) {
    return false;
  }

  return true;
}

/**
 * Calcula a data de vencimento padrão para um novo empréstimo
 */
export function calculateDefaultDueDate(materialType: string, userType: string): Date {
  const materialConfig = LOAN_CONFIG_BY_MATERIAL_TYPE[materialType as keyof typeof LOAN_CONFIG_BY_MATERIAL_TYPE];
  const userConfig = LOAN_CONFIG_BY_USER_TYPE[userType as keyof typeof LOAN_CONFIG_BY_USER_TYPE];
  
  let loanDays: number = LOAN_DEFAULT_CONFIG.DEFAULT_LOAN_DAYS;
  
  if (materialConfig) {
    loanDays = materialConfig.loanDays;
  }
  
  if (userConfig) {
    loanDays = Math.min(loanDays, userConfig.loanDays);
  }
  
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + loanDays);
  
  return dueDate;
}

/**
 * Obtém informações de atraso de um empréstimo
 */
export function getLoanOverdueInfo(loan: ILoan): ILoanOverdueInfo {
  const overdueDays = calculateOverdueDays(loan);
  const fineAmount = calculateFineAmount(loan);
  const canRenew = canLoanBeRenewed(loan);

  return {
    loanId: loan.id,
    userId: loan.userId,
    materialId: loan.materialId,
    daysOverdue: overdueDays,
    fineAmount,
    canRenew,
    maxFineAmount: LOAN_FINE_CONFIG.MAX_AMOUNT,
  };
}

/**
 * Formata a data para exibição
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR');
}

/**
 * Formata a data e hora para exibição
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleString('pt-BR');
}

/**
 * Calcula a diferença em dias entre duas datas
 */
export function calculateDaysDifference(date1: Date, date2: Date): number {
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

/**
 * Verifica se uma data é futura
 */
export function isFutureDate(date: Date): boolean {
  const now = new Date();
  return date > now;
}

/**
 * Verifica se uma data é passada
 */
export function isPastDate(date: Date): boolean {
  const now = new Date();
  return date < now;
}

/**
 * Adiciona dias a uma data
 */
export function addDays(date: Date, days: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

/**
 * Subtrai dias de uma data
 */
export function subtractDays(date: Date, days: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - days);
  return newDate;
}

