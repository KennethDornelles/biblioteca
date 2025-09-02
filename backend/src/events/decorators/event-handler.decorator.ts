import { SetMetadata } from '@nestjs/common';

/**
 * Chave para metadados de handlers de eventos
 */
export const EVENT_HANDLER_METADATA = 'event:handler';

/**
 * Decorator para marcar métodos como handlers de eventos
 * @param eventType Tipo do evento que o handler processa
 */
export const EventHandler = (eventType: string) =>
  SetMetadata(EVENT_HANDLER_METADATA, eventType);

/**
 * Interface para metadados de handlers
 */
export interface EventHandlerMetadata {
  eventType: string;
  methodName: string;
  target: any;
}
