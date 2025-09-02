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
 * Listener para eventos relacionados a notificações
 */
@Injectable()
export class NotificationEventListener {
  private readonly logger = new Logger(NotificationEventListener.name);

  constructor(private readonly queueService: QueueService) {}

  /**
   * Handler para eventos de usuário
   */
  @OnEvent('user.login')
  async handleUserLogin(event: UserEvent) {
    if (event.eventType === 'user.login') {
      await this.queueService.addNotificationJob({
        type: 'login_success',
        userId: event.data.userId,
        title: 'Login realizado com sucesso',
        message: `Bem-vindo de volta, ${event.data.email}!`,
        priority: 'normal',
        data: {
          loginTime: event.data.loginTime,
          ipAddress: event.data.ipAddress,
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
      await this.queueService.addNotificationJob({
        type: 'loan_created',
        userId: event.data.userId,
        title: 'Empréstimo realizado',
        message: `Seu empréstimo foi confirmado. Data de devolução: ${new Date(event.data.dueDate).toLocaleDateString('pt-BR')}`,
        priority: 'normal',
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
      await this.queueService.addNotificationJob({
        type: 'loan_reminder',
        userId: event.data.userId,
        title: 'Empréstimo vence em breve',
        message: `Seu empréstimo vence em ${event.data.daysUntilDue} dias. Considere renovar ou devolver.`,
        priority: 'high',
        data: {
          loanId: event.data.loanId,
          materialId: event.data.materialId,
          daysUntilDue: event.data.daysUntilDue,
        },
      });
    }
  }

  @OnEvent('loan.overdue')
  async handleLoanOverdue(event: LoanEvent) {
    if (event.eventType === 'loan.overdue') {
      await this.queueService.addNotificationJob({
        type: 'loan_overdue',
        userId: event.data.userId,
        title: 'Empréstimo em atraso',
        message: `Seu empréstimo está ${event.data.daysOverdue} dias em atraso. Multa aplicada.`,
        priority: 'urgent',
        data: {
          loanId: event.data.loanId,
          materialId: event.data.materialId,
          daysOverdue: event.data.daysOverdue,
          fineAmount: event.data.fineAmount,
        },
      });
    }
  }

  @OnEvent('loan.returned')
  async handleLoanReturned(event: LoanEvent) {
    if (event.eventType === 'loan.returned') {
      await this.queueService.addNotificationJob({
        type: 'loan_returned',
        userId: event.data.userId,
        title: 'Empréstimo devolvido',
        message: event.data.isOverdue 
          ? `Empréstimo devolvido com ${event.data.daysOverdue} dias de atraso. Multa aplicada.`
          : 'Empréstimo devolvido com sucesso!',
        priority: 'normal',
        data: {
          loanId: event.data.loanId,
          materialId: event.data.materialId,
          isOverdue: event.data.isOverdue,
          daysOverdue: event.data.daysOverdue,
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
      await this.queueService.addNotificationJob({
        type: 'reservation_created',
        userId: event.data.userId,
        title: 'Reserva confirmada',
        message: `Você está na posição ${event.data.queuePosition} da fila. Expira em ${new Date(event.data.expirationDate).toLocaleDateString('pt-BR')}`,
        priority: 'normal',
        data: {
          reservationId: event.data.reservationId,
          materialId: event.data.materialId,
          queuePosition: event.data.queuePosition,
          expirationDate: event.data.expirationDate,
        },
      });
    }
  }

  @OnEvent('reservation.fulfilled')
  async handleReservationFulfilled(event: ReservationEvent) {
    if (event.eventType === 'reservation.fulfilled') {
      await this.queueService.addNotificationJob({
        type: 'reservation_fulfilled',
        userId: event.data.userId,
        title: 'Reserva disponível!',
        message: 'Sua reserva está disponível para retirada. Você tem 48 horas para retirar.',
        priority: 'high',
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
      await this.queueService.addNotificationJob({
        type: 'reservation_reminder',
        userId: event.data.userId,
        title: 'Reserva expira em breve',
        message: `Sua reserva expira em ${event.data.daysUntilExpiration} dias.`,
        priority: 'high',
        data: {
          reservationId: event.data.reservationId,
          materialId: event.data.materialId,
          daysUntilExpiration: event.data.daysUntilExpiration,
        },
      });
    }
  }

  @OnEvent('reservation.queue_updated')
  async handleReservationQueueUpdated(event: ReservationEvent) {
    if (event.eventType === 'reservation.queue_updated' && event.data.nextInQueue) {
      await this.queueService.addNotificationJob({
        type: 'queue_position_updated',
        userId: event.data.nextInQueue.userId,
        title: 'Sua vez na fila!',
        message: 'Você é o próximo na fila de reservas. Prepare-se para receber a notificação de disponibilidade.',
        priority: 'normal',
        data: {
          materialId: event.data.materialId,
          queuePosition: 1,
          totalReservations: event.data.totalReservations,
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
      await this.queueService.addNotificationJob({
        type: 'fine_created',
        userId: event.data.userId,
        title: 'Multa aplicada',
        message: `Multa de R$ ${event.data.amount.toFixed(2)} aplicada por ${event.data.daysOverdue} dias de atraso.`,
        priority: 'high',
        data: {
          fineId: event.data.fineId,
          amount: event.data.amount,
          daysOverdue: event.data.daysOverdue,
          dueDate: event.data.dueDate,
        },
      });
    }
  }

  @OnEvent('fine.paid')
  async handleFinePaid(event: FineEvent) {
    if (event.eventType === 'fine.paid') {
      await this.queueService.addNotificationJob({
        type: 'fine_paid',
        userId: event.data.userId,
        title: 'Multa quitada',
        message: `Multa de R$ ${event.data.amount.toFixed(2)} foi paga com sucesso.`,
        priority: 'normal',
        data: {
          fineId: event.data.fineId,
          amount: event.data.amount,
          paymentDate: event.data.paymentDate,
        },
      });
    }
  }

  @OnEvent('fine.overdue')
  async handleFineOverdue(event: FineEvent) {
    if (event.eventType === 'fine.overdue') {
      await this.queueService.addNotificationJob({
        type: 'fine_overdue',
        userId: event.data.userId,
        title: 'Multa em atraso',
        message: `Sua multa está ${event.data.daysOverdue} dias em atraso. Juros aplicados.`,
        priority: 'urgent',
        data: {
          fineId: event.data.fineId,
          amount: event.data.amount,
          daysOverdue: event.data.daysOverdue,
          interestAmount: event.data.interestAmount,
        },
      });
    }
  }

  /**
   * Handler para eventos de material
   */
  @OnEvent('material.available')
  async handleMaterialAvailable(event: MaterialEvent) {
    if (event.eventType === 'material.available') {
      // Notificar usuários com reservas ativas para este material
      await this.queueService.addNotificationJob({
        type: 'material_available',
        userId: 'system', // Será processado para todos os usuários com reservas
        title: 'Material disponível',
        message: `O material "${event.data.title}" está disponível novamente.`,
        priority: 'normal',
        data: {
          materialId: event.data.materialId,
          title: event.data.title,
          availableDate: event.data.availableDate,
        },
      });
    }
  }
}
