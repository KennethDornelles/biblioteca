import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { QueueService } from '../../modules/queue/queue.service';
import { 
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
        type: 'welcome',
        to: event.data.email,
        subject: 'Bem-vindo à Biblioteca Universitária',
        template: 'welcome',
        data: {
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
        type: 'password_changed',
        to: event.data.email,
        subject: 'Senha alterada com sucesso',
        template: 'password_changed',
        data: {
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
        type: 'loan_confirmation',
        to: event.data.userId, // Assumindo que userId é o email ou será resolvido
        subject: 'Empréstimo confirmado',
        template: 'loan_confirmation',
        data: {
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
        type: 'loan_reminder',
        to: event.data.userId,
        subject: 'Lembrete: Empréstimo vence em breve',
        template: 'loan_reminder',
        data: {
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
        type: 'loan_overdue',
        to: event.data.userId,
        subject: 'Empréstimo em atraso',
        template: 'loan_overdue',
        data: {
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
        type: 'reservation_confirmation',
        to: event.data.userId,
        subject: 'Reserva confirmada',
        template: 'reservation_confirmation',
        data: {
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
        type: 'reservation_fulfilled',
        to: event.data.userId,
        subject: 'Reserva disponível para retirada',
        template: 'reservation_fulfilled',
        data: {
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
        type: 'reservation_reminder',
        to: event.data.userId,
        subject: 'Reserva expira em breve',
        template: 'reservation_reminder',
        data: {
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
        type: 'fine_notification',
        to: event.data.userId,
        subject: 'Multa aplicada',
        template: 'fine_notification',
        data: {
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
        type: 'fine_overdue',
        to: event.data.userId,
        subject: 'Multa em atraso',
        template: 'fine_overdue',
        data: {
          fineId: event.data.fineId,
          amount: event.data.amount,
          daysOverdue: event.data.daysOverdue,
          interestAmount: event.data.interestAmount,
        },
      });
    }
  }
}
