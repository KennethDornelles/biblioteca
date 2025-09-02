import { UserType, StudentLevel } from '../enums';
import { USER_DEFAULTS, USER_BUSINESS_RULES } from '../constants/user.constants';
import { IUser, ICreateUser, IUpdateUser } from '../interfaces/user.interface';

/**
 * Valida se um usuário tem todos os campos obrigatórios para seu tipo
 */
export function validateRequiredFields(userData: Partial<IUser>): string[] {
  const errors: string[] = [];
  const { type } = userData;

  if (!type) {
    errors.push('Tipo de usuário é obrigatório');
    return errors;
  }

  const requiredFields = USER_BUSINESS_RULES[`${type}_REQUIRED_FIELDS` as keyof typeof USER_BUSINESS_RULES] || [];

  for (const field of requiredFields) {
    if (!userData[field as keyof IUser]) {
      errors.push(`Campo ${field} é obrigatório para usuários do tipo ${type}`);
    }
  }

  return errors;
}

/**
 * Aplica valores padrão para campos opcionais
 */
export function applyDefaultValues(userData: ICreateUser): ICreateUser {
  return {
    ...userData,
    active: userData.active ?? true,
    loanLimit: userData.loanLimit ?? USER_DEFAULTS.LOAN_LIMIT,
    loanDays: userData.loanDays ?? USER_DEFAULTS.LOAN_DAYS,
  };
}

/**
 * Valida se um email já existe (mock - deve ser implementado com Prisma)
 */
export function validateEmailUniqueness(email: string, existingEmails: string[]): boolean {
  return !existingEmails.includes(email);
}

/**
 * Valida se um número de matrícula já existe (mock - deve ser implementado com Prisma)
 */
export function validateRegistrationNumberUniqueness(
  registrationNumber: string,
  existingNumbers: string[]
): boolean {
  return !existingNumbers.includes(registrationNumber);
}

/**
 * Gera um número de matrícula único baseado no ano e sequencial
 */
export function generateRegistrationNumber(year: number, sequence: number): string {
  return `${year}${sequence.toString().padStart(4, '0')}`;
}

/**
 * Valida a força de uma senha
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
  score: number;
} {
  const errors: string[] = [];
  let score = 0;

  if (password.length < USER_DEFAULTS.PASSWORD_MIN_LENGTH) {
    errors.push(`Senha deve ter pelo menos ${USER_DEFAULTS.PASSWORD_MIN_LENGTH} caracteres`);
  } else {
    score += 1;
  }

  if (password.length > USER_DEFAULTS.PASSWORD_MAX_LENGTH) {
    errors.push(`Senha deve ter no máximo ${USER_DEFAULTS.PASSWORD_MAX_LENGTH} caracteres`);
  } else {
    score += 1;
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    errors.push('Senha deve conter pelo menos um número');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    errors.push('Senha deve conter pelo menos um caractere especial');
  }

  return {
    isValid: errors.length === 0,
    errors,
    score: Math.min(score, 5),
  };
}

/**
 * Sanitiza dados de entrada do usuário
 */
export function sanitizeUserInput(input: string | number | boolean | null | undefined): string | number | boolean | null | undefined {
  if (typeof input === 'string') {
    return input.trim();
  }
  return input;
}

/**
 * Formata nome do usuário (primeira letra maiúscula)
 */
export function formatUserName(name: string): string {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Formata email (converte para minúsculas)
 */
export function formatEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Formata telefone (remove caracteres especiais)
 */
export function formatPhone(phone: string): string {
  return phone.replace(/[^\d+()-]/g, '');
}

/**
 * Calcula idade baseada na data de nascimento
 */
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Verifica se um usuário pode fazer empréstimos
 */
export function canUserBorrow(user: IUser): boolean {
  return user.active && user.loanLimit > 0;
}

/**
 * Verifica se um usuário pode fazer reservas
 */
export function canUserReserve(user: IUser): boolean {
  return user.active && user.type !== UserType.STUDENT;
}

/**
 * Verifica se um usuário pode fazer avaliações
 */
export function canUserReview(user: IUser): boolean {
  return user.active && user.type !== UserType.STUDENT;
}

/**
 * Obtém configurações específicas para um tipo de usuário
 */
export function getUserTypeConfig(userType: UserType) {
  const configs = {
    [UserType.STUDENT]: {
      loanLimit: USER_DEFAULTS.LOAN_LIMIT,
      loanDays: USER_DEFAULTS.LOAN_DAYS,
      canReserve: false,
      canReview: false,
      maxReservations: 2,
      maxReviews: 5,
    },
    [UserType.PROFESSOR]: {
      loanLimit: USER_DEFAULTS.LOAN_LIMIT + 2,
      loanDays: USER_DEFAULTS.LOAN_DAYS + 7,
      canReserve: true,
      canReview: true,
      maxReservations: 5,
      maxReviews: 10,
    },
    [UserType.LIBRARIAN]: {
      loanLimit: USER_DEFAULTS.LOAN_LIMIT + 5,
      loanDays: USER_DEFAULTS.LOAN_DAYS + 14,
      canReserve: true,
      canReview: true,
      maxReservations: 10,
      maxReviews: 20,
    },
    [UserType.ADMIN]: {
      loanLimit: USER_DEFAULTS.MAX_LOAN_LIMIT,
      loanDays: USER_DEFAULTS.MAX_LOAN_DAYS,
      canReserve: true,
      canReview: true,
      maxReservations: 20,
      maxReviews: 50,
    },
    [UserType.STAFF]: {
      loanLimit: USER_DEFAULTS.LOAN_LIMIT + 1,
      loanDays: USER_DEFAULTS.LOAN_DAYS + 3,
      canReserve: true,
      canReview: false,
      maxReservations: 3,
      maxReviews: 0,
    },
  };

  return configs[userType];
}

/**
 * Valida se uma data é válida e está no formato correto
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Converte string de data para objeto Date
 */
export function parseDate(dateString: string): Date | null {
  if (!isValidDate(dateString)) {
    return null;
  }
  return new Date(dateString);
}

/**
 * Formata data para exibição
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Formata data e hora para exibição
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
