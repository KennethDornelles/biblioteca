// Configurações de validação
export {
  PASSWORD_VALIDATION_CONFIG,
  NAME_VALIDATION_CONFIG,
  EMAIL_VALIDATION_CONFIG,
  PHONE_VALIDATION_CONFIG,
  REGISTRATION_NUMBER_VALIDATION_CONFIG,
  COURSE_VALIDATION_CONFIG,
  DEPARTMENT_VALIDATION_CONFIG,
  TITLE_VALIDATION_CONFIG,
} from './user.config';

// Configurações de sistema
export {
  PAGINATION_CONFIG,
  SEARCH_CONFIG,
  CACHE_CONFIG,
  AUDIT_CONFIG,
  NOTIFICATION_CONFIG,
  SECURITY_CONFIG,
  EXPORT_CONFIG,
  IMPORT_CONFIG,
  BACKUP_CONFIG,
} from './user.config';

// Configurações de autenticação
export { AUTH_CONFIG } from './auth.config';

// Configurações de ambiente e segurança
export * from './environment.config';
export * from './logger.config';
export * from './swagger.config';
export * from './throttler.config';
