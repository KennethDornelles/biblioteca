/**
 * Interface base para todos os eventos do sistema
 */
export interface BaseEvent {
  /** ID único do evento */
  eventId: string;
  
  /** Tipo do evento */
  eventType: string;
  
  /** Timestamp de criação do evento */
  timestamp: Date;
  
  /** ID do usuário que originou o evento (se aplicável) */
  userId?: string;
  
  /** Dados específicos do evento */
  data: Record<string, any>;
  
  /** Metadados adicionais */
  metadata?: {
    source: string;
    version: string;
    correlationId?: string;
    [key: string]: any;
  };
}

/**
 * Interface para eventos de domínio
 */
export interface DomainEvent extends BaseEvent {
  /** Agregação que originou o evento */
  aggregateId: string;
  
  /** Versão da agregação */
  aggregateVersion: number;
}

/**
 * Interface para eventos de integração
 */
export interface IntegrationEvent extends BaseEvent {
  /** Destino do evento */
  destination?: string;
  
  /** Prioridade do evento */
  priority: EventPriority;
}

/**
 * Enum para prioridades de eventos
 */
export enum EventPriority {
  LOW = 1,
  NORMAL = 2,
  HIGH = 3,
  CRITICAL = 4,
}

/**
 * Interface para handlers de eventos
 */
export interface EventHandler<T extends BaseEvent = BaseEvent> {
  handle(event: T): Promise<void> | void;
}

/**
 * Interface para o event bus
 */
export interface EventBus {
  publish<T extends BaseEvent>(event: T): Promise<void>;
  subscribe<T extends BaseEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): void;
  unsubscribe(eventType: string, handler: EventHandler): void;
}
