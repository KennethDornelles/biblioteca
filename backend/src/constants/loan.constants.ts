import { LoanStatus } from '../enums';

// Constantes de validação
export const LOAN_VALIDATION_CONSTRAINTS = {
  OBSERVATIONS: {
    MAX_LENGTH: 1000,
  },
  MAX_RENEWALS: {
    MIN: 0,
    MAX: 10,
  },
} as const;

// Constantes de paginação
export const LOAN_PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

// Constantes de ordenação
export const LOAN_SORT_FIELDS = [
  'loanDate',
  'dueDate',
  'returnDate',
  'createdAt',
  'updatedAt',
  'status',
  'renewals',
] as const;

export const LOAN_SORT_ORDERS = ['asc', 'desc'] as const;

// Constantes de status
export const LOAN_STATUS_TRANSITIONS: Record<LoanStatus, LoanStatus[]> = {
  [LoanStatus.ACTIVE]: [LoanStatus.RETURNED, LoanStatus.OVERDUE, LoanStatus.RENEWED, LoanStatus.CANCELLED],
  [LoanStatus.RETURNED]: [LoanStatus.CANCELLED],
  [LoanStatus.OVERDUE]: [LoanStatus.RETURNED, LoanStatus.RENEWED, LoanStatus.CANCELLED],
  [LoanStatus.RENEWED]: [LoanStatus.RETURNED, LoanStatus.OVERDUE, LoanStatus.CANCELLED],
  [LoanStatus.CANCELLED]: [],
};

// Constantes de configuração padrão
export const LOAN_DEFAULT_CONFIG = {
  DEFAULT_LOAN_DAYS: 14,
  MAX_RENEWALS: 2,
  RENEWAL_EXTENSION_DAYS: 14,
  OVERDUE_FINE_RATE: 0.50, // R$ por dia
  MAX_FINE_AMOUNT: 50.00, // R$ máximo
  GRACE_PERIOD_DAYS: 1,
  MAX_CONCURRENT_LOANS: 5,
  AUTO_OVERDUE_CHECK: true,
  OVERDUE_CHECK_INTERVAL: 24, // em horas
} as const;

// Constantes por tipo de usuário
export const LOAN_CONFIG_BY_USER_TYPE = {
  STUDENT: {
    loanLimit: 3,
    loanDays: 7,
    maxRenewals: 1,
    overdueFineRate: 0.25,
  },
  PROFESSOR: {
    loanLimit: 5,
    loanDays: 21,
    maxRenewals: 3,
    overdueFineRate: 0.50,
  },
  LIBRARIAN: {
    loanLimit: 10,
    loanDays: 30,
    maxRenewals: 5,
    overdueFineRate: 0.00,
  },
  ADMIN: {
    loanLimit: 15,
    loanDays: 60,
    maxRenewals: 10,
    overdueFineRate: 0.00,
  },
  STAFF: {
    loanLimit: 5,
    loanDays: 14,
    maxRenewals: 2,
    overdueFineRate: 0.25,
  },
} as const;

// Constantes por tipo de material
export const LOAN_CONFIG_BY_MATERIAL_TYPE = {
  BOOK: {
    loanDays: 14,
    maxRenewals: 2,
    canReserve: true,
    reservationExpiryDays: 3,
  },
  MAGAZINE: {
    loanDays: 7,
    maxRenewals: 1,
    canReserve: true,
    reservationExpiryDays: 2,
  },
  JOURNAL: {
    loanDays: 7,
    maxRenewals: 1,
    canReserve: true,
    reservationExpiryDays: 2,
  },
  DVD: {
    loanDays: 7,
    maxRenewals: 1,
    canReserve: true,
    reservationExpiryDays: 2,
  },
  CD: {
    loanDays: 7,
    maxRenewals: 1,
    canReserve: true,
    reservationExpiryDays: 2,
  },
  THESIS: {
    loanDays: 30,
    maxRenewals: 1,
    canReserve: true,
    reservationExpiryDays: 7,
  },
  DISSERTATION: {
    loanDays: 30,
    maxRenewals: 1,
    canReserve: true,
    reservationExpiryDays: 7,
  },
  MONOGRAPH: {
    loanDays: 21,
    maxRenewals: 2,
    canReserve: true,
    reservationExpiryDays: 5,
  },
  ARTICLE: {
    loanDays: 7,
    maxRenewals: 1,
    canReserve: true,
    reservationExpiryDays: 2,
  },
  MAP: {
    loanDays: 14,
    maxRenewals: 1,
    canReserve: true,
    reservationExpiryDays: 3,
  },
  OTHER: {
    loanDays: 14,
    maxRenewals: 1,
    canReserve: true,
    reservationExpiryDays: 3,
  },
} as const;

// Constantes de notificações
export const LOAN_NOTIFICATION_CONFIG = {
  DUE_SOON_DAYS: 3,
  OVERDUE_DAYS: 1,
  RENEWAL_REMINDER_DAYS: 2,
  NOTIFICATION_CHANNELS: ['email', 'sms', 'push', 'in_app'] as const,
  NOTIFICATION_PRIORITIES: ['low', 'medium', 'high', 'urgent'] as const,
} as const;

// Constantes de mensagens
export const LOAN_MESSAGES = {
  CREATED: 'Empréstimo criado com sucesso',
  UPDATED: 'Empréstimo atualizado com sucesso',
  RETURNED: 'Material devolvido com sucesso',
  RENEWED: 'Empréstimo renovado com sucesso',
  CANCELLED: 'Empréstimo cancelado com sucesso',
  NOT_FOUND: 'Empréstimo não encontrado',
  ALREADY_EXISTS: 'Empréstimo já existe',
  INVALID_STATUS: 'Status inválido para o empréstimo',
  CANNOT_RENEW: 'Não é possível renovar o empréstimo',
  CANNOT_RETURN: 'Não é possível devolver o material',
  CANNOT_CANCEL: 'Não é possível cancelar o empréstimo',
  USER_LIMIT_EXCEEDED: 'Usuário atingiu o limite de empréstimos',
  MATERIAL_NOT_AVAILABLE: 'Material não está disponível para empréstimo',
  OVERDUE_FINES_EXIST: 'Usuário possui multas pendentes',
  RENEWAL_LIMIT_EXCEEDED: 'Limite de renovações atingido',
} as const;

// Constantes de auditoria
export const LOAN_AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  RETURN: 'RETURN',
  RENEW: 'RENEW',
  CANCEL: 'CANCEL',
  OVERDUE_CHECK: 'OVERDUE_CHECK',
  FINE_CALCULATION: 'FINE_CALCULATION',
} as const;

// Constantes de relatórios
export const LOAN_REPORT_CONFIG = {
  DEFAULT_PERIOD_DAYS: 30,
  MAX_PERIOD_DAYS: 365,
  EXPORT_FORMATS: ['csv', 'json', 'xml', 'pdf'] as const,
  STATISTICS_INTERVALS: ['daily', 'weekly', 'monthly', 'yearly'] as const,
} as const;

// Constantes de multas
export const LOAN_FINE_CONFIG = {
  DAILY_RATE: 0.50,
  MAX_AMOUNT: 50.00,
  GRACE_PERIOD_DAYS: 1,
  INSTALLMENT_OPTIONS: [2, 3, 6, 12] as const,
  PAYMENT_METHODS: ['pix', 'boleto', 'cartao', 'dinheiro'] as const,
} as const;
