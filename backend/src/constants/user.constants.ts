// Limites padrão para usuários
export const USER_DEFAULTS = {
  LOAN_LIMIT: 3,
  LOAN_DAYS: 7,
  MAX_LOAN_LIMIT: 10,
  MIN_LOAN_LIMIT: 1,
  MAX_LOAN_DAYS: 30,
  MIN_LOAN_DAYS: 1,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 255,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 255,
  EMAIL_MIN_LENGTH: 5,
  EMAIL_MAX_LENGTH: 255,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 20,
  REGISTRATION_NUMBER_MIN_LENGTH: 5,
  REGISTRATION_NUMBER_MAX_LENGTH: 20,
  COURSE_MIN_LENGTH: 2,
  COURSE_MAX_LENGTH: 255,
  DEPARTMENT_MIN_LENGTH: 2,
  DEPARTMENT_MAX_LENGTH: 255,
  TITLE_MIN_LENGTH: 2,
  TITLE_MAX_LENGTH: 100,
} as const;

// Mensagens de erro comuns
export const USER_ERROR_MESSAGES = {
  NOT_FOUND: 'Usuário não encontrado',
  EMAIL_ALREADY_EXISTS: 'Email já está em uso',
  REGISTRATION_NUMBER_ALREADY_EXISTS: 'Número de matrícula já está em uso',
  INVALID_PASSWORD: 'Senha inválida',
  CURRENT_PASSWORD_INCORRECT: 'Senha atual incorreta',
  NEW_PASSWORD_SAME_AS_CURRENT: 'A nova senha deve ser diferente da senha atual',
  PASSWORD_CONFIRMATION_MISMATCH: 'A confirmação de senha não confere',
  CANNOT_DELETE_WITH_ACTIVE_LOANS: 'Não é possível excluir usuário com empréstimos ativos',
  CANNOT_DELETE_WITH_ACTIVE_RESERVATIONS: 'Não é possível excluir usuário com reservas ativas',
  INVALID_USER_TYPE: 'Tipo de usuário inválido',
  MISSING_STUDENT_FIELDS: 'Estudantes devem ter número de matrícula, curso e nível acadêmico',
  MISSING_PROFESSOR_FIELDS: 'Professores devem ter departamento e título acadêmico',
  INVALID_REGISTRATION_DATE: 'Data de registro inválida',
  INVALID_ADMISSION_DATE: 'Data de admissão inválida',
} as const;

// Mensagens de sucesso
export const USER_SUCCESS_MESSAGES = {
  CREATED: 'Usuário criado com sucesso',
  UPDATED: 'Usuário atualizado com sucesso',
  DELETED: 'Usuário excluído com sucesso',
  PASSWORD_CHANGED: 'Senha alterada com sucesso',
  ACTIVATED: 'Usuário ativado com sucesso',
  DEACTIVATED: 'Usuário desativado com sucesso',
  SUSPENDED: 'Usuário suspenso com sucesso',
  UNSUSPENDED: 'Usuário reativado com sucesso',
} as const;

// Validações de negócio
export const USER_BUSINESS_RULES = {
  STUDENT_REQUIRED_FIELDS: ['registrationNumber', 'course', 'level'],
  PROFESSOR_REQUIRED_FIELDS: ['department', 'title'],
  LIBRARIAN_REQUIRED_FIELDS: [],
  ADMIN_REQUIRED_FIELDS: [],
  STAFF_REQUIRED_FIELDS: [],
} as const;

// Configurações de paginação
export const USER_PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

// Configurações de busca
export const USER_SEARCH = {
  MIN_NAME_LENGTH: 2,
  MIN_EMAIL_LENGTH: 3,
  MIN_COURSE_LENGTH: 2,
  MIN_DEPARTMENT_LENGTH: 2,
} as const;
