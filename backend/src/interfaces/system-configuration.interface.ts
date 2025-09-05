// Interface base para configuração do sistema
export interface ISystemConfiguration {
  id: string;
  key: string;
  value: string;
  description?: string;
  type: string;
  category: string;
  editable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para criação de configuração
export interface ICreateSystemConfiguration {
  key: string;
  value: string;
  description?: string;
  type: string;
  category: string;
  editable?: boolean;
}

// Interface para atualização de configuração
export interface IUpdateSystemConfiguration {
  value?: string;
  description?: string;
  type?: string;
  category?: string;
  editable?: boolean;
}

// Interface para resposta de configuração
export interface ISystemConfigurationResponse {
  id: string;
  key: string;
  value: string;
  description?: string;
  type: string;
  category: string;
  editable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para filtros de busca
export interface ISystemConfigurationFilters {
  key?: string;
  type?: string;
  category?: string;
  editable?: boolean;
  page?: number;
  limit?: number;
}

// Interface para resposta paginada
export interface IPaginatedSystemConfigurations {
  data: ISystemConfigurationResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Interface para configurações agrupadas por categoria
export interface IConfigurationByCategory {
  category: string;
  configurations: ISystemConfigurationResponse[];
}

// Interface para configurações do sistema
export interface ISystemSettings {
  library: {
    name: string;
    address: string;
    phone: string;
    email: string;
    workingHours: string;
  };
  loans: {
    defaultLoanDays: number;
    maxRenewals: number;
    maxLoansPerUser: number;
    overdueFinePerDay: number;
  };
  reservations: {
    maxReservationsPerUser: number;
    reservationExpirationDays: number;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    reminderDaysBefore: number;
  };
}

// Interface para validação de configuração
export interface IConfigurationValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
