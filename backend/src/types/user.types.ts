import { UserType, StudentLevel, UserStatus } from '../enums';

// Tipo para resposta de sucesso genérica
export type UserSuccessResponse<T = any> = {
  success: true;
  message: string;
  data?: T;
};

// Tipo para resposta de erro genérica
export type UserErrorResponse = {
  success: false;
  message: string;
  error?: string;
  code?: string;
};

// Tipo para resposta genérica
export type UserResponse<T = any> = UserSuccessResponse<T> | UserErrorResponse;

// Tipo para filtros de busca com validação
export type UserSearchFilters = {
  name?: string;
  email?: string;
  type?: UserType;
  active?: boolean;
  registrationNumber?: string;
  course?: string;
  level?: StudentLevel;
  department?: string;
  page: number;
  limit: number;
};

// Tipo para ordenação
export type UserSortOptions = {
  field: 'name' | 'email' | 'registrationDate' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
};

// Tipo para configurações de usuário por tipo
export type UserTypeConfig = {
  [K in UserType]: {
    loanLimit: number;
    loanDays: number;
    canReserve: boolean;
    canReview: boolean;
    maxReservations: number;
    maxReviews: number;
    requiredFields: string[];
    optionalFields: string[];
  };
};

// Tipo para validação de campos obrigatórios
export type RequiredFieldsMap = {
  [K in UserType]: string[];
};

// Tipo para estatísticas de usuário
export type UserStatistics = {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  pending: number;
  blocked: number;
  byType: Record<UserType, number>;
  byStatus: Record<UserStatus, number>;
  byCourse: Record<string, number>;
  byDepartment: Record<string, number>;
  byLevel: Record<StudentLevel, number>;
};

// Tipo para dados de auditoria
export type UserAuditData = {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'ACTIVATE' | 'DEACTIVATE' | 'SUSPEND' | 'CHANGE_PASSWORD';
  userId: string;
  performedBy: string;
  timestamp: Date;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
};

// Tipo para configurações de validação
export type UserValidationConfig = {
  password: {
    minLength: number;
    maxLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  name: {
    minLength: number;
    maxLength: number;
    allowSpecialChars: boolean;
  };
  email: {
    minLength: number;
    maxLength: number;
    allowedDomains?: string[];
  };
};

// Tipo para resposta de paginação
export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage?: number;
  prevPage?: number;
};

// Tipo para resposta paginada genérica
export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};
