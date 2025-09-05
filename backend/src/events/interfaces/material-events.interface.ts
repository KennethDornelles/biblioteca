import { DomainEvent, EventPriority } from './base-event.interface';

/**
 * Eventos relacionados ao módulo de materiais
 */

export interface MaterialCreatedEvent extends DomainEvent {
  eventType: 'material.created';
  data: {
    materialId: string;
    title: string;
    type: string;
    status: string;
    isbn?: string;
    author?: string;
  };
}

export interface MaterialUpdatedEvent extends DomainEvent {
  eventType: 'material.updated';
  data: {
    materialId: string;
    title?: string;
    type?: string;
    status?: string;
    updatedFields: string[];
  };
}

export interface MaterialStatusChangedEvent extends DomainEvent {
  eventType: 'material.status_changed';
  data: {
    materialId: string;
    title: string;
    oldStatus: string;
    newStatus: string;
    reason?: string;
    changedBy: string;
  };
}

export interface MaterialAvailableEvent extends DomainEvent {
  eventType: 'material.available';
  data: {
    materialId: string;
    title: string;
    previousStatus: string;
    availableDate: Date;
  };
}

export interface MaterialUnavailableEvent extends DomainEvent {
  eventType: 'material.unavailable';
  data: {
    materialId: string;
    title: string;
    reason: string;
    unavailableDate: Date;
    estimatedReturnDate?: Date;
  };
}

export interface MaterialMaintenanceRequiredEvent extends DomainEvent {
  eventType: 'material.maintenance_required';
  data: {
    materialId: string;
    title: string;
    issue: string;
    priority: string;
    reportedBy: string;
  };
}

// Union type para todos os eventos de material
export type MaterialEvent = 
  | MaterialCreatedEvent
  | MaterialUpdatedEvent
  | MaterialStatusChangedEvent
  | MaterialAvailableEvent
  | MaterialUnavailableEvent
  | MaterialMaintenanceRequiredEvent;
