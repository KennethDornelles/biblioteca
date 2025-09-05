import { MaterialStatus, MaterialType } from '../enums';

// Constantes de validação
export const MATERIAL_VALIDATION_CONSTRAINTS = {
  TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 500,
  },
  AUTHOR: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 255,
  },
  ISBN: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 20,
    PATTERN: /^(?:\d{10}|\d{13})$/,
  },
  ISSN: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 20,
    PATTERN: /^\d{4}-\d{3}[\dX]$/,
  },
  PUBLISHER: {
    MAX_LENGTH: 255,
  },
  PUBLICATION_YEAR: {
    MIN: 1000,
    MAX: new Date().getFullYear() + 1,
  },
  EDITION: {
    MAX_LENGTH: 50,
  },
  CATEGORY: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  SUBCATEGORY: {
    MAX_LENGTH: 100,
  },
  LOCATION: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
  NUMBER_OF_PAGES: {
    MIN: 1,
    MAX: 10000,
  },
  LANGUAGE: {
    MAX_LENGTH: 50,
  },
  DESCRIPTION: {
    MAX_LENGTH: 2000,
  },
  KEYWORDS: {
    MAX_LENGTH: 500,
  },
  ASSET_NUMBER: {
    MAX_LENGTH: 20,
  },
  ACQUISITION_VALUE: {
    MIN: 0,
    MAX: 999999.99,
  },
  SUPPLIER: {
    MAX_LENGTH: 255,
  },
} as const;

// Constantes de paginação
export const MATERIAL_PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

// Constantes de ordenação
export const MATERIAL_SORT_FIELDS = [
  'title',
  'author',
  'publicationYear',
  'createdAt',
  'updatedAt',
  'status',
  'type',
  'category',
  'location',
] as const;

export const MATERIAL_SORT_ORDERS = ['asc', 'desc'] as const;

// Constantes de status
export const MATERIAL_STATUS_TRANSITIONS: Record<MaterialStatus, MaterialStatus[]> = {
  [MaterialStatus.AVAILABLE]: [MaterialStatus.LOANED, MaterialStatus.RESERVED, MaterialStatus.MAINTENANCE, MaterialStatus.LOST, MaterialStatus.DECOMMISSIONED],
  [MaterialStatus.LOANED]: [MaterialStatus.AVAILABLE, MaterialStatus.LOST, MaterialStatus.MAINTENANCE],
    [MaterialStatus.RESERVED]: [MaterialStatus.AVAILABLE, MaterialStatus.LOANED],
  [MaterialStatus.MAINTENANCE]: [MaterialStatus.AVAILABLE, MaterialStatus.LOST, MaterialStatus.DECOMMISSIONED],
  [MaterialStatus.LOST]: [MaterialStatus.AVAILABLE, MaterialStatus.DECOMMISSIONED],
  [MaterialStatus.DECOMMISSIONED]: [],
};

// Constantes de tipo
export const MATERIAL_TYPE_CONFIGURATIONS: Record<MaterialType, {
  maxLoanDays: number;
  maxRenewals: number;
  canReserve: boolean;
  reservationExpiryDays: number;
  loanLimit: number;
}> = {
  [MaterialType.BOOK]: {
    maxLoanDays: 14,
    maxRenewals: 2,
    canReserve: true,
    reservationExpiryDays: 3,
    loanLimit: 5,
  },
  [MaterialType.MAGAZINE]: {
    maxLoanDays: 7,
    maxRenewals: 1,
    canReserve: true,
    reservationExpiryDays: 2,
    loanLimit: 3,
  },
  [MaterialType.JOURNAL]: {
    maxLoanDays: 7,
    maxRenewals: 1,
    canReserve: true,
    reservationExpiryDays: 2,
    loanLimit: 3,
  },
  [MaterialType.DVD]: {
    maxLoanDays: 7,
    maxRenewals: 1,
    canReserve: true,
    reservationExpiryDays: 2,
    loanLimit: 2,
  },
  [MaterialType.CD]: {
    maxLoanDays: 7,
    maxRenewals: 1,
    canReserve: true,
    reservationExpiryDays: 2,
    loanLimit: 2,
  },
  [MaterialType.THESIS]: {
    maxLoanDays: 30,
    maxRenewals: 1,
    canReserve: true,
    reservationExpiryDays: 7,
    loanLimit: 2,
  },
  [MaterialType.DISSERTATION]: {
    maxLoanDays: 30,
    maxRenewals: 1,
    canReserve: true,
    reservationExpiryDays: 7,
    loanLimit: 2,
  },
  [MaterialType.MONOGRAPH]: {
    maxLoanDays: 21,
    maxRenewals: 2,
    canReserve: true,
    reservationExpiryDays: 5,
    loanLimit: 3,
  },
  [MaterialType.ARTICLE]: {
    maxLoanDays: 7,
    maxRenewals: 1,
    canReserve: true,
    reservationExpiryDays: 2,
    loanLimit: 3,
  },
  [MaterialType.MAP]: {
    maxLoanDays: 14,
    maxRenewals: 1,
    canReserve: true,
    reservationExpiryDays: 3,
    loanLimit: 2,
  },
  [MaterialType.OTHER]: {
    maxLoanDays: 14,
    maxRenewals: 1,
    canReserve: true,
    reservationExpiryDays: 3,
    loanLimit: 3,
  },
};

// Constantes de categorias padrão
export const MATERIAL_DEFAULT_CATEGORIES = [
  'Ciências Exatas',
  'Ciências Humanas',
  'Ciências Biológicas',
  'Engenharia',
  'Medicina',
  'Direito',
  'Administração',
  'Educação',
  'Artes',
  'Literatura',
  'História',
  'Geografia',
  'Filosofia',
  'Psicologia',
  'Sociologia',
  'Economia',
  'Informática',
  'Matemática',
  'Física',
  'Química',
  'Biologia',
  'Outros',
] as const;

// Constantes de idiomas padrão
export const MATERIAL_DEFAULT_LANGUAGES = [
  'Português',
  'Inglês',
  'Espanhol',
  'Francês',
  'Alemão',
  'Italiano',
  'Latim',
  'Grego',
  'Outros',
] as const;

// Constantes de localizações padrão
export const MATERIAL_DEFAULT_LOCATIONS = [
  'Sala de Leitura',
  'Acervo Geral',
  'Acervo Especial',
  'Hemeroteca',
  'Mapoteca',
  'Multimídia',
  'Referência',
  'Reserva',
  'Empréstimo',
  'Depósito',
] as const;

// Constantes de mensagens
export const MATERIAL_MESSAGES = {
  CREATED: 'Material criado com sucesso',
  UPDATED: 'Material atualizado com sucesso',
  DELETED: 'Material removido com sucesso',
  STATUS_CHANGED: 'Status do material alterado com sucesso',
  LOCATION_CHANGED: 'Localização do material alterada com sucesso',
  NOT_FOUND: 'Material não encontrado',
  ALREADY_EXISTS: 'Material já existe',
  INVALID_STATUS: 'Status inválido para o material',
  INVALID_TYPE: 'Tipo inválido para o material',
  CANNOT_DELETE: 'Não é possível remover o material',
  CANNOT_UPDATE: 'Não é possível atualizar o material',
} as const;

// Constantes de auditoria
export const MATERIAL_AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  STATUS_CHANGE: 'STATUS_CHANGE',
  LOCATION_CHANGE: 'LOCATION_CHANGE',
  LOAN: 'LOAN',
  RETURN: 'RETURN',
  RESERVE: 'RESERVE',
  CANCEL_RESERVATION: 'CANCEL_RESERVATION',
} as const;
