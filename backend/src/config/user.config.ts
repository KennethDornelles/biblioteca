import { UserType, StudentLevel } from '../enums';
import { USER_DEFAULTS } from '../constants/user.constants';

// Configurações de validação de senha
export const PASSWORD_VALIDATION_CONFIG = {
  minLength: USER_DEFAULTS.PASSWORD_MIN_LENGTH,
  maxLength: USER_DEFAULTS.PASSWORD_MAX_LENGTH,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  minScore: 4, // Pontuação mínima para senha forte
} as const;

// Configurações de validação de nome
export const NAME_VALIDATION_CONFIG = {
  minLength: USER_DEFAULTS.NAME_MIN_LENGTH,
  maxLength: USER_DEFAULTS.NAME_MAX_LENGTH,
  allowSpecialChars: false,
  allowNumbers: false,
} as const;

// Configurações de validação de email
export const EMAIL_VALIDATION_CONFIG = {
  minLength: USER_DEFAULTS.EMAIL_MIN_LENGTH,
  maxLength: USER_DEFAULTS.EMAIL_MAX_LENGTH,
  allowedDomains: [], // Lista vazia permite qualquer domínio
  requireUnique: true,
} as const;

// Configurações de validação de telefone
export const PHONE_VALIDATION_CONFIG = {
  minLength: USER_DEFAULTS.PHONE_MIN_LENGTH,
  maxLength: USER_DEFAULTS.PHONE_MAX_LENGTH,
  allowInternational: true,
  format: 'BR', // Formato brasileiro
} as const;

// Configurações de validação de número de matrícula
export const REGISTRATION_NUMBER_VALIDATION_CONFIG = {
  minLength: USER_DEFAULTS.REGISTRATION_NUMBER_MIN_LENGTH,
  maxLength: USER_DEFAULTS.REGISTRATION_NUMBER_MAX_LENGTH,
  requireUnique: true,
  format: 'YYYYNNNN', // Ano + 4 dígitos sequenciais
} as const;

// Configurações de validação de curso
export const COURSE_VALIDATION_CONFIG = {
  minLength: USER_DEFAULTS.COURSE_MIN_LENGTH,
  maxLength: USER_DEFAULTS.COURSE_MAX_LENGTH,
  allowSpecialChars: true,
  allowNumbers: true,
} as const;

// Configurações de validação de departamento
export const DEPARTMENT_VALIDATION_CONFIG = {
  minLength: USER_DEFAULTS.DEPARTMENT_MIN_LENGTH,
  maxLength: USER_DEFAULTS.DEPARTMENT_MAX_LENGTH,
  allowSpecialChars: true,
  allowNumbers: true,
} as const;

// Configurações de validação de título acadêmico
export const TITLE_VALIDATION_CONFIG = {
  minLength: USER_DEFAULTS.TITLE_MIN_LENGTH,
  maxLength: USER_DEFAULTS.TITLE_MAX_LENGTH,
  allowSpecialChars: true,
  allowNumbers: false,
} as const;

// Configurações de paginação
export const PAGINATION_CONFIG = {
  defaultPage: 1,
  defaultLimit: 10,
  maxLimit: 100,
  minLimit: 1,
} as const;

// Configurações de busca
export const SEARCH_CONFIG = {
  minNameLength: 2,
  minEmailLength: 3,
  minCourseLength: 2,
  minDepartmentLength: 2,
  maxResults: 1000,
} as const;

// Configurações de cache
export const CACHE_CONFIG = {
  ttl: 300, // 5 minutos
  maxItems: 1000,
  enableCompression: true,
} as const;

// Configurações de auditoria
export const AUDIT_CONFIG = {
  enabled: true,
  logLevel: 'INFO',
  logActions: [
    'CREATE',
    'UPDATE',
    'DELETE',
    'ACTIVATE',
    'DEACTIVATE',
    'SUSPEND',
    'CHANGE_PASSWORD',
  ],
  logUserDetails: true,
  logIpAddress: true,
  logUserAgent: true,
} as const;

// Configurações de notificação
export const NOTIFICATION_CONFIG = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: false,
  welcomeEmail: true,
  passwordResetEmail: true,
  accountActivationEmail: true,
} as const;

// Configurações de segurança
export const SECURITY_CONFIG = {
  maxLoginAttempts: 5,
  lockoutDuration: 15, // minutos
  passwordExpiryDays: 90,
  requirePasswordChange: false,
  sessionTimeout: 30, // minutos
  enableTwoFactor: false,
} as const;

// Configurações de exportação
export const EXPORT_CONFIG = {
  allowedFormats: ['csv', 'xlsx', 'pdf'],
  maxRecordsPerExport: 10000,
  enableCompression: true,
  includeSensitiveData: false,
} as const;

// Configurações de importação
export const IMPORT_CONFIG = {
  allowedFormats: ['csv', 'xlsx'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxRecordsPerImport: 1000,
  validateOnImport: true,
  createMissingRecords: false,
} as const;

// Configurações de backup
export const BACKUP_CONFIG = {
  enabled: true,
  frequency: 'daily',
  retentionDays: 30,
  includeSensitiveData: false,
  compression: true,
} as const;
