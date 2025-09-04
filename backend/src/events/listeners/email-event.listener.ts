import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { QueueService } from '../../modules/queue/queue.service';
import { EmailType } from '../../modules/queue/interfaces/queue.interfaces';
import type { 
  UserEvent, 
  LoanEvent, 
  ReservationEvent, 
  FineEvent,
  MaterialEvent 
} from '../interfaces';

/**
 * Listener para eventos relacionados a emails
 */
@Injectable()
export class EmailEventListener {
  private readonly logger = new Logger(EmailEventListener.name);

  constructor(private readonly queueService: QueueService) {}

  /**
   * Handler para eventos de usuário
   */
  @OnEvent('user.created')
  async handleUserCreated(event: UserEvent) {
    if (event.eventType === 'user.created') {
      await this.queueService.addEmailJob({
        type: EmailType.WELCOME,
        to: event.data.email,
        subject: 'Bem-vindo à Biblioteca Universitária',
        template: 'welcome',
        context: {
          name: event.data.name,
          userType: event.data.userType,
        },
      });
    }
  }

  @OnEvent('user.password_changed')
  async handleUserPasswordChanged(event: UserEvent) {
    if (event.eventType === 'user.password_changed') {
      await this.queueService.addEmailJob({
        type: EmailType.PASSWORD_CHANGED,
        to: event.data.email,
        subject: 'Senha alterada com sucesso',
        template: 'password_changed',
        context: {
          name: event.data.email,
          changedBy: event.data.changedBy,
          isSelfChange: event.data.isSelfChange,
        },
      });
    }
  }

  /**
   * Handler para eventos de empréstimo
   */
  @OnEvent('loan.created')
  async handleLoanCreated(event: LoanEvent) {
    if (event.eventType === 'loan.created') {
      await this.queueService.addEmailJob({
        type: EmailType.LOAN_CONFIRMATION,
        to: event.data.userId, // Assumindo que userId é o email ou será resolvido
        subject: 'Empréstimo confirmado',
        template: 'loan_confirmation',
        context: {
          loanId: event.data.loanId,
          materialId: event.data.materialId,
          dueDate: event.data.dueDate,
        },
      });
    }
  }

  @OnEvent('loan.expiring_soon')
  async handleLoanExpiringSoon(event: LoanEvent) {
    if (event.eventType === 'loan.expiring_soon') {
      await this.queueService.addEmailJob({
        type: EmailType.LOAN_REMINDER,
        to: event.data.userId,
        subject: 'Lembrete: Empréstimo vence em breve',
        template: 'loan_reminder',
        context: {
          loanId: event.data.loanId,
          materialId: event.data.materialId,
          dueDate: event.data.dueDate,
          daysUntilDue: event.data.daysUntilDue,
        },
      });
    }
  }

  @OnEvent('loan.overdue')
  async handleLoanOverdue(event: LoanEvent) {
    if (event.eventType === 'loan.overdue') {
      await this.queueService.addEmailJob({
        type: EmailType.LOAN_OVERDUE,
        to: event.data.userId,
        subject: 'Empréstimo em atraso',
        template: 'loan_overdue',
        context: {
          loanId: event.data.loanId,
          materialId: event.data.materialId,
          dueDate: event.data.dueDate,
          daysOverdue: event.data.daysOverdue,
          fineAmount: event.data.fineAmount,
        },
      });
    }
  }

  /**
   * Handler para eventos de reserva
   */
  @OnEvent('reservation.created')
  async handleReservationCreated(event: ReservationEvent) {
    if (event.eventType === 'reservation.created') {
      await this.queueService.addEmailJob({
        type: EmailType.RESERVATION_CONFIRMATION,
        to: event.data.userId,
        subject: 'Reserva confirmada',
        template: 'reservation_confirmation',
        context: {
          reservationId: event.data.reservationId,
          materialId: event.data.materialId,
          expirationDate: event.data.expirationDate,
          queuePosition: event.data.queuePosition,
        },
      });
    }
  }

  @OnEvent('reservation.fulfilled')
  async handleReservationFulfilled(event: ReservationEvent) {
    if (event.eventType === 'reservation.fulfilled') {
      await this.queueService.addEmailJob({
        type: EmailType.RESERVATION_FULFILLED,
        to: event.data.userId,
        subject: 'Reserva disponível para retirada',
        template: 'reservation_fulfilled',
        context: {
          reservationId: event.data.reservationId,
          materialId: event.data.materialId,
          fulfillmentDate: event.data.fulfillmentDate,
        },
      });
    }
  }

  @OnEvent('reservation.expiring_soon')
  async handleReservationExpiringSoon(event: ReservationEvent) {
    if (event.eventType === 'reservation.expiring_soon') {
      await this.queueService.addEmailJob({
        type: EmailType.RESERVATION_REMINDER,
        to: event.data.userId,
        subject: 'Reserva expira em breve',
        template: 'reservation_reminder',
        context: {
          reservationId: event.data.reservationId,
          materialId: event.data.materialId,
          expirationDate: event.data.expirationDate,
          daysUntilExpiration: event.data.daysUntilExpiration,
        },
      });
    }
  }

  /**
   * Handler para eventos de multa
   */
  @OnEvent('fine.created')
  async handleFineCreated(event: FineEvent) {
    if (event.eventType === 'fine.created') {
      await this.queueService.addEmailJob({
        type: EmailType.FINE_NOTIFICATION,
        to: event.data.userId,
        subject: 'Multa aplicada',
        template: 'fine_notification',
        context: {
          fineId: event.data.fineId,
          amount: event.data.amount,
          daysOverdue: event.data.daysOverdue,
          dueDate: event.data.dueDate,
        },
      });
    }
  }

  @OnEvent('fine.overdue')
  async handleFineOverdue(event: FineEvent) {
    if (event.eventType === 'fine.overdue') {
      await this.queueService.addEmailJob({
        type: EmailType.FINE_OVERDUE,
        to: event.data.userId,
        subject: 'Multa em atraso',
        template: 'fine_overdue',
        context: {
          fineId: event.data.fineId,
          amount: event.data.amount,
          daysOverdue: event.data.daysOverdue,
          interestAmount: event.data.interestAmount,
        },
      });
    }
  }
}