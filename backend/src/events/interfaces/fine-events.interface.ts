import { DomainEvent, EventPriority } from './base-event.interface';

/**
 * Eventos relacionados ao módulo de multas
 */

export interface FineCreatedEvent extends DomainEvent {
  eventType: 'fine.created';
  data: {
    fineId: string;
    userId: string;
    loanId: string;
    amount: number;
    daysOverdue: number;
    dueDate: Date;
    status: string;
  };
}

export interface FinePaidEvent extends DomainEvent {
  eventType: 'fine.paid';
  data: {
    fineId: string;
    userId: string;
    amount: number;
    paymentDate: Date;
    paymentMethod?: string;
  };
}

export interface FineOverdueEvent extends DomainEvent {
  eventType: 'fine.overdue';
  data: {
    fineId: string;
    userId: string;
    amount: number;
    dueDate: Date;
    daysOverdue: number;
    interestAmount?: number;
  };
}

export interface FineCancelledEvent extends DomainEvent {
  eventType: 'fine.cancelled';
  data: {
    fineId: string;
    userId: string;
    amount: number;
    reason: string;
    cancelledBy: string;
  };
}

export interface FineInstallmentCreatedEvent extends DomainEvent {
  eventType: 'fine.installment_created';
  data: {
    fineId: string;
    userId: string;
    originalAmount: number;
    installmentAmount: number;
    installments: number;
    dueDate: Date;
  };
}

export interface FineInstallmentPaidEvent extends DomainEvent {
  eventType: 'fine.installment_paid';
  data: {
    fineId: string;
    userId: string;
    installmentAmount: number;
    remainingAmount: number;
    paymentDate: Date;
  };
}

// Union type para todos os eventos de multa
export type FineEvent = 
  | FineCreatedEvent
  | FinePaidEvent
  | FineOverdueEvent
  | FineCancelledEvent
  | FineInstallmentCreatedEvent
  | FineInstallmentPaidEvent;
