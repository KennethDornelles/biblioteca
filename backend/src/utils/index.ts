// Funções de validação
export {
  validateRequiredFields,
  validateEmailUniqueness,
  validateRegistrationNumberUniqueness,
  validatePasswordStrength,
} from './user.utils';

// Funções de formatação
export {
  formatUserName,
  formatEmail,
  formatPhone,
  formatDate,
  formatDateTime,
} from './user.utils';

// Funções de utilidade
export {
  applyDefaultValues,
  generateRegistrationNumber,
  sanitizeUserInput,
  calculateAge,
  canUserBorrow,
  canUserReserve,
  canUserReview,
  getUserTypeConfig,
  isValidDate,
  parseDate,
} from './user.utils';

// Logger da aplicação
export { AppLogger, appLogger } from './logger.utils';
