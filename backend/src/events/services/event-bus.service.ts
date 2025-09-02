import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { v4 as uuidv4 } from 'uuid';
import { 
  BaseEvent, 
  EventBus, 
  EventHandler, 
  EventPriority,
  DomainEvent,
  IntegrationEvent 
} from '../interfaces';

/**
 * Serviço principal para gerenciamento de eventos
 */
@Injectable()
export class EventBusService implements EventBus, OnModuleInit {
  private readonly logger = new Logger(EventBusService.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async onModuleInit() {
    this.logger.log('EventBusService initialized');
  }

  /**
   * Publica um evento no sistema
   */
  async publish<T extends BaseEvent>(event: T): Promise<void> {
    try {
      // Adiciona metadados se não existirem
      if (!event.eventId) {
        event.eventId = uuidv4();
      }
      
      if (!event.timestamp) {
        event.timestamp = new Date();
      }

      // Adiciona metadados padrão se não existirem
      if (!event.metadata) {
        event.metadata = {
          source: 'biblioteca-api',
          version: '1.0.0',
        };
      }

      this.logger.debug(`Publishing event: ${event.eventType} (${event.eventId})`);
      
      // Emite o evento usando o EventEmitter2
      this.eventEmitter.emit(event.eventType, event);
      
      // Log do evento publicado
      this.logger.log(`Event published: ${event.eventType} - ID: ${event.eventId}`);
      
    } catch (error) {
      this.logger.error(`Failed to publish event ${event.eventType}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Inscreve um handler para um tipo de evento
   */
  subscribe<T extends BaseEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): void {
    try {
      this.eventEmitter.on(eventType, async (event: T) => {
        try {
          this.logger.debug(`Handling event: ${eventType} (${event.eventId})`);
          await handler.handle(event);
          this.logger.debug(`Event handled successfully: ${eventType} (${event.eventId})`);
        } catch (error) {
          this.logger.error(`Error handling event ${eventType} (${event.eventId}): ${error.message}`);
          throw error;
        }
      });
      
      this.logger.log(`Subscribed to event: ${eventType}`);
    } catch (error) {
      this.logger.error(`Failed to subscribe to event ${eventType}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Remove a inscrição de um handler
   */
  unsubscribe(eventType: string, handler: EventHandler): void {
    try {
      this.eventEmitter.off(eventType, handler.handle);
      this.logger.log(`Unsubscribed from event: ${eventType}`);
    } catch (error) {
      this.logger.error(`Failed to unsubscribe from event ${eventType}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Publica um evento de domínio
   */
  async publishDomainEvent<T extends DomainEvent>(event: T): Promise<void> {
    await this.publish(event);
  }

  /**
   * Publica um evento de integração
   */
  async publishIntegrationEvent<T extends IntegrationEvent>(event: T): Promise<void> {
    await this.publish(event);
  }

  /**
   * Publica múltiplos eventos em lote
   */
  async publishBatch(events: BaseEvent[]): Promise<void> {
    try {
      const promises = events.map(event => this.publish(event));
      await Promise.all(promises);
      this.logger.log(`Published batch of ${events.length} events`);
    } catch (error) {
      this.logger.error(`Failed to publish event batch: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtém estatísticas dos eventos
   */
  getEventStats(): any {
    return {
      listeners: this.eventEmitter.listenerCount(),
      eventNames: this.eventEmitter.eventNames(),
    };
  }
}
