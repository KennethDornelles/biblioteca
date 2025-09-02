// Interfaces base
export * from './base-event.interface';

// Interfaces de eventos específicos
export * from './user-events.interface';
export * from './loan-events.interface';
export * from './reservation-events.interface';
export * from './fine-events.interface';
export * from './material-events.interface';

// Union types para todos os eventos
export type AllEvents = 
  | import('./user-events.interface').UserEvent
  | import('./loan-events.interface').LoanEvent
  | import('./reservation-events.interface').ReservationEvent
  | import('./fine-events.interface').FineEvent
  | import('./material-events.interface').MaterialEvent;
