import { DomainEvent, EventPriority } from './base-event.interface';

/**
 * Eventos relacionados ao módulo de empréstimos
 */

export interface LoanCreatedEvent extends DomainEvent {
  eventType: 'loan.created';
  data: {
    loanId: string;
    userId: string;
    materialId: string;
    loanDate: Date;
    dueDate: Date;
    status: string;
  };
}

export interface LoanReturnedEvent extends DomainEvent {
  eventType: 'loan.returned';
  data: {
    loanId: string;
    userId: string;
    materialId: string;
    returnDate: Date;
    dueDate: Date;
    isOverdue: boolean;
    daysOverdue?: number;
  };
}

export interface LoanRenewedEvent extends DomainEvent {
  eventType: 'loan.renewed';
  data: {
    loanId: string;
    userId: string;
    materialId: string;
    oldDueDate: Date;
    newDueDate: Date;
    renewalCount: number;
    maxRenewals: number;
  };
}

export interface LoanOverdueEvent extends DomainEvent {
  eventType: 'loan.overdue';
  data: {
    loanId: string;
    userId: string;
    materialId: string;
    dueDate: Date;
    daysOverdue: number;
    fineAmount?: number;
  };
}

export interface LoanExpiringSoonEvent extends DomainEvent {
  eventType: 'loan.expiring_soon';
  data: {
    loanId: string;
    userId: string;
    materialId: string;
    dueDate: Date;
    daysUntilDue: number;
  };
}

export interface LoanCancelledEvent extends DomainEvent {
  eventType: 'loan.cancelled';
  data: {
    loanId: string;
    userId: string;
    materialId: string;
    reason: string;
    cancelledBy: string;
  };
}

// Union type para todos os eventos de empréstimo
export type LoanEvent = 
  | LoanCreatedEvent
  | LoanReturnedEvent
  | LoanRenewedEvent
  | LoanOverdueEvent
  | LoanExpiringSoonEvent
  | LoanCancelledEvent;
