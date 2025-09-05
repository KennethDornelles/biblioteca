import { SystemConfiguration } from '@prisma/client';

// Tipo para criação de configuração
export type CreateSystemConfigurationData = Omit<SystemConfiguration, 'id' | 'createdAt' | 'updatedAt'>;

// Tipo para atualização de configuração
export type UpdateSystemConfigurationData = Partial<Pick<SystemConfiguration, 'value' | 'description' | 'type' | 'category' | 'editable'>>;

// Tipo para resposta de configuração
export type SystemConfigurationResponse = SystemConfiguration;

// Tipo para filtros de configuração
export type SystemConfigurationFilters = {
  key?: string;
  type?: string;
  category?: string;
  editable?: boolean;
  page?: number;
  limit?: number;
};

// Tipo para configurações agrupadas por categoria
export type ConfigurationByCategory = {
  category: string;
  configurations: SystemConfigurationResponse[];
};

// Tipo para configurações do sistema
export type SystemSettings = {
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
};

// Tipo para validação de configuração
export type ConfigurationValidation = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
};

// Tipo para configurações de cache
export type CacheConfiguration = {
  enabled: boolean;
  ttl: number;
  maxSize: number;
};

// Tipo para configurações de segurança
export type SecurityConfiguration = {
  passwordMinLength: number;
  passwordRequireSpecialChars: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
};

// Tipo para configurações de backup
export type BackupConfiguration = {
  enabled: boolean;
  frequency: string;
  retentionDays: number;
  storageLocation: string;
};
