export enum UserType {
  STUDENT = 'STUDENT',
  PROFESSOR = 'PROFESSOR',
  LIBRARIAN = 'LIBRARIAN',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

export const USER_TYPE_LABELS: Record<UserType, string> = {
  [UserType.STUDENT]: 'Estudante',
  [UserType.PROFESSOR]: 'Professor',
  [UserType.LIBRARIAN]: 'Bibliotecário',
  [UserType.ADMIN]: 'Administrador',
  [UserType.STAFF]: 'Funcionário',
};

export const USER_TYPE_DESCRIPTIONS: Record<UserType, string> = {
  [UserType.STUDENT]: 'Usuário estudante com acesso limitado aos recursos da biblioteca',
  [UserType.PROFESSOR]: 'Usuário professor com acesso ampliado aos recursos da biblioteca',
  [UserType.LIBRARIAN]: 'Usuário bibliotecário com acesso administrativo ao sistema',
  [UserType.ADMIN]: 'Usuário administrador com acesso total ao sistema',
  [UserType.STAFF]: 'Usuário funcionário com acesso limitado ao sistema',
};
