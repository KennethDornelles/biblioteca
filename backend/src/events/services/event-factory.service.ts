import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { 
  BaseEvent, 
  DomainEvent, 
  IntegrationEvent,
  EventPriority 
} from '../interfaces';

/**
 * Serviço para criação de eventos padronizados
 */
@Injectable()
export class EventFactoryService {
  
  /**
   * Cria um evento base
   */
  createBaseEvent(
    eventType: string,
    data: Record<string, any>,
    userId?: string,
    metadata?: Record<string, any>
  ): BaseEvent {
    return {
      eventId: uuidv4(),
      eventType,
      timestamp: new Date(),
      userId,
      data,
      metadata: {
        source: 'biblioteca-api',
        version: '1.0.0',
        ...metadata,
      },
    };
  }

  /**
   * Cria um evento de domínio
   */
  createDomainEvent(
    eventType: string,
    aggregateId: string,
    aggregateVersion: number,
    data: Record<string, any>,
    userId?: string,
    metadata?: Record<string, any>
  ): DomainEvent {
    return {
      ...this.createBaseEvent(eventType, data, userId, metadata),
      aggregateId,
      aggregateVersion,
    };
  }

  /**
   * Cria um evento de integração
   */
  createIntegrationEvent(
    eventType: string,
    data: Record<string, any>,
    priority: EventPriority = EventPriority.NORMAL,
    destination?: string,
    userId?: string,
    metadata?: Record<string, any>
  ): IntegrationEvent {
    return {
      ...this.createBaseEvent(eventType, data, userId, metadata),
      destination,
      priority,
    };
  }

  /**
   * Cria evento de usuário criado
   */
  createUserCreatedEvent(
    userId: string,
    email: string,
    name: string,
    userType: string,
    isActive: boolean
  ): DomainEvent {
    return this.createDomainEvent(
      'user.created',
      userId,
      1,
      {
        userId,
        email,
        name,
        userType,
        isActive,
      },
      userId
    );
  }

  /**
   * Cria evento de empréstimo criado
   */
  createLoanCreatedEvent(
    loanId: string,
    userId: string,
    materialId: string,
    loanDate: Date,
    dueDate: Date,
    status: string
  ): DomainEvent {
    return this.createDomainEvent(
      'loan.created',
      loanId,
      1,
      {
        loanId,
        userId,
        materialId,
        loanDate,
        dueDate,
        status,
      },
      userId
    );
  }

  /**
   * Cria evento de empréstimo devolvido
   */
  createLoanReturnedEvent(
    loanId: string,
    userId: string,
    materialId: string,
    returnDate: Date,
    dueDate: Date,
    isOverdue: boolean,
    daysOverdue?: number
  ): DomainEvent {
    return this.createDomainEvent(
      'loan.returned',
      loanId,
      2,
      {
        loanId,
        userId,
        materialId,
        returnDate,
        dueDate,
        isOverdue,
        daysOverdue,
      },
      userId
    );
  }

  /**
   * Cria evento de reserva criada
   */
  createReservationCreatedEvent(
    reservationId: string,
    userId: string,
    materialId: string,
    reservationDate: Date,
    expirationDate: Date,
    priority: number,
    queuePosition: number
  ): DomainEvent {
    return this.createDomainEvent(
      'reservation.created',
      reservationId,
      1,
      {
        reservationId,
        userId,
        materialId,
        reservationDate,
        expirationDate,
        priority,
        queuePosition,
      },
      userId
    );
  }

  /**
   * Cria evento de multa criada
   */
  createFineCreatedEvent(
    fineId: string,
    userId: string,
    loanId: string,
    amount: number,
    daysOverdue: number,
    dueDate: Date,
    status: string
  ): DomainEvent {
    return this.createDomainEvent(
      'fine.created',
      fineId,
      1,
      {
        fineId,
        userId,
        loanId,
        amount,
        daysOverdue,
        dueDate,
        status,
      },
      userId
    );
  }

  /**
   * Cria evento de material disponível
   */
  createMaterialAvailableEvent(
    materialId: string,
    title: string,
    previousStatus: string,
    availableDate: Date
  ): DomainEvent {
    return this.createDomainEvent(
      'material.available',
      materialId,
      1,
      {
        materialId,
        title,
        previousStatus,
        availableDate,
      }
    );
  }
}
