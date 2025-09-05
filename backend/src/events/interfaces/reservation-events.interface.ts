import { DomainEvent, EventPriority } from './base-event.interface';

/**
 * Eventos relacionados ao módulo de reservas
 */

export interface ReservationCreatedEvent extends DomainEvent {
  eventType: 'reservation.created';
  data: {
    reservationId: string;
    userId: string;
    materialId: string;
    reservationDate: Date;
    expirationDate: Date;
    priority: number;
    queuePosition: number;
  };
}

export interface ReservationFulfilledEvent extends DomainEvent {
  eventType: 'reservation.fulfilled';
  data: {
    reservationId: string;
    userId: string;
    materialId: string;
    fulfillmentDate: Date;
    loanId?: string; // Se foi convertido em empréstimo
  };
}

export interface ReservationCancelledEvent extends DomainEvent {
  eventType: 'reservation.cancelled';
  data: {
    reservationId: string;
    userId: string;
    materialId: string;
    reason: string;
    cancelledBy: string;
  };
}

export interface ReservationExpiredEvent extends DomainEvent {
  eventType: 'reservation.expired';
  data: {
    reservationId: string;
    userId: string;
    materialId: string;
    expirationDate: Date;
    daysExpired: number;
  };
}

export interface ReservationExpiringSoonEvent extends DomainEvent {
  eventType: 'reservation.expiring_soon';
  data: {
    reservationId: string;
    userId: string;
    materialId: string;
    expirationDate: Date;
    daysUntilExpiration: number;
  };
}

export interface ReservationQueueUpdatedEvent extends DomainEvent {
  eventType: 'reservation.queue_updated';
  data: {
    materialId: string;
    totalReservations: number;
    nextInQueue?: {
      reservationId: string;
      userId: string;
      priority: number;
    };
  };
}

// Union type para todos os eventos de reserva
export type ReservationEvent = 
  | ReservationCreatedEvent
  | ReservationFulfilledEvent
  | ReservationCancelledEvent
  | ReservationExpiredEvent
  | ReservationExpiringSoonEvent
  | ReservationQueueUpdatedEvent;
