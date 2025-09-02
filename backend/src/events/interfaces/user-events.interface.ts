import { DomainEvent, EventPriority } from './base-event.interface';

/**
 * Eventos relacionados ao módulo de usuários
 */

export interface UserCreatedEvent extends DomainEvent {
  eventType: 'user.created';
  data: {
    userId: string;
    email: string;
    name: string;
    userType: string;
    isActive: boolean;
  };
}

export interface UserUpdatedEvent extends DomainEvent {
  eventType: 'user.updated';
  data: {
    userId: string;
    email?: string;
    name?: string;
    userType?: string;
    isActive?: boolean;
    updatedFields: string[];
  };
}

export interface UserDeactivatedEvent extends DomainEvent {
  eventType: 'user.deactivated';
  data: {
    userId: string;
    email: string;
    name: string;
    reason?: string;
    deactivatedBy: string;
  };
}

export interface UserActivatedEvent extends DomainEvent {
  eventType: 'user.activated';
  data: {
    userId: string;
    email: string;
    name: string;
    activatedBy: string;
  };
}

export interface UserPasswordChangedEvent extends DomainEvent {
  eventType: 'user.password_changed';
  data: {
    userId: string;
    email: string;
    changedBy: string;
    isSelfChange: boolean;
  };
}

export interface UserLoginEvent extends DomainEvent {
  eventType: 'user.login';
  data: {
    userId: string;
    email: string;
    loginTime: Date;
    ipAddress?: string;
    userAgent?: string;
  };
}

export interface UserLogoutEvent extends DomainEvent {
  eventType: 'user.logout';
  data: {
    userId: string;
    email: string;
    logoutTime: Date;
    sessionDuration: number; // em minutos
  };
}

// Union type para todos os eventos de usuário
export type UserEvent = 
  | UserCreatedEvent
  | UserUpdatedEvent
  | UserDeactivatedEvent
  | UserActivatedEvent
  | UserPasswordChangedEvent
  | UserLoginEvent
  | UserLogoutEvent;
