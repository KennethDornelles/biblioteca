import { UserType, StudentLevel, UserStatus } from '../enums';

// Interface base para usuário
export interface IUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  registrationDate: Date;
  type: UserType;
  active: boolean;
  registrationNumber?: string;
  course?: string;
  level?: StudentLevel;
  department?: string;
  title?: string;
  admissionDate?: Date;
  loanLimit: number;
  loanDays: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para criação de usuário
export interface ICreateUser {
  name: string;
  email: string;
  phone?: string;
  password: string;
  type: UserType;
  active?: boolean;
  registrationNumber?: string;
  course?: string;
  level?: StudentLevel;
  department?: string;
  title?: string;
  admissionDate?: Date;
  loanLimit?: number;
  loanDays?: number;
}

// Interface para atualização de usuário
export interface IUpdateUser {
  name?: string;
  email?: string;
  phone?: string;
  type?: UserType;
  active?: boolean;
  registrationNumber?: string;
  course?: string;
  level?: StudentLevel;
  department?: string;
  title?: string;
  admissionDate?: Date;
  loanLimit?: number;
  loanDays?: number;
}

// Interface para resposta de usuário (sem senha)
export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  registrationDate: Date;
  type: UserType;
  active: boolean;
  registrationNumber?: string;
  course?: string;
  level?: StudentLevel;
  department?: string;
  title?: string;
  admissionDate?: Date;
  loanLimit: number;
  loanDays: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para filtros de busca
export interface IUserFilters {
  name?: string;
  email?: string;
  type?: UserType;
  active?: boolean;
  registrationNumber?: string;
  course?: string;
  level?: StudentLevel;
  department?: string;
  page?: number;
  limit?: number;
}

// Interface para resposta paginada
export interface IPaginatedUsers {
  data: IUserResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Interface para alteração de senha
export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Interface para estatísticas de usuário
export interface IUserStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  byType: Record<UserType, number>;
  byStatus: Record<UserStatus, number>;
}

// Interface para validação de campos obrigatórios
export interface IRequiredFieldsValidation {
  type: UserType;
  requiredFields: string[];
  optionalFields: string[];
}

// Interface para configurações de usuário
export interface IUserConfig {
  loanLimit: number;
  loanDays: number;
  canReserve: boolean;
  canReview: boolean;
  maxReservations: number;
  maxReviews: number;
}
