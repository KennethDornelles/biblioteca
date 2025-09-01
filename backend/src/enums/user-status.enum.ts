export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
}

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: 'Ativo',
  [UserStatus.INACTIVE]: 'Inativo',
  [UserStatus.SUSPENDED]: 'Suspenso',
  [UserStatus.PENDING]: 'Pendente',
  [UserStatus.BLOCKED]: 'Bloqueado',
};

export const USER_STATUS_DESCRIPTIONS: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: 'Usuário ativo com acesso normal ao sistema',
  [UserStatus.INACTIVE]: 'Usuário inativo (desativado temporariamente)',
  [UserStatus.SUSPENDED]: 'Usuário suspenso por violação de regras',
  [UserStatus.PENDING]: 'Usuário aguardando aprovação',
  [UserStatus.BLOCKED]: 'Usuário bloqueado permanentemente',
};
