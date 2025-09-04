import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { QueueService } from '../../modules/queue/queue.service';
import { ReportType } from '../../modules/queue/interfaces/queue.interfaces';
import type { 
  UserEvent, 
  LoanEvent, 
  ReservationEvent, 
  FineEvent,
  MaterialEvent 
} from '../interfaces';

/**
 * Listener para eventos de auditoria
 */
@Injectable()
export class AuditEventListener {
  private readonly logger = new Logger(AuditEventListener.name);

  constructor(private readonly queueService: QueueService) {}

  /**
   * Handler para eventos de usuário
   */
  @OnEvent('user.created')
  async handleUserCreated(event: UserEvent) {
    if (event.eventType === 'user.created') {
      await this.queueService.addReportJob({
        type: ReportType.AUDIT_LOG,
        parameters: {
          title: 'Usuário criado',
          description: `Novo usuário criado: ${event.data.email}`,
          data: {
            eventType: event.eventType,
            userId: event.data.userId,
            email: event.data.email,
            userType: event.data.userType,
            timestamp: event.timestamp,
          },
        },
        format: 'json',
      });
    }
  }

  @OnEvent('user.updated')
  async handleUserUpdated(event: UserEvent) {
    if (event.eventType === 'user.updated') {
      await this.queueService.addReportJob({
        type: ReportType.AUDIT_LOG,
        parameters: {
          title: 'Usuário atualizado',
          description: `Usuário ${event.data.userId} foi atualizado`,
          data: {
            eventType: event.eventType,
            userId: event.data.userId,
            updatedFields: event.data.updatedFields,
            timestamp: event.timestamp,
          },
        },
        format: 'json',
      });
    }
  }

  @OnEvent('user.deactivated')
  async handleUserDeactivated(event: UserEvent) {
    if (event.eventType === 'user.deactivated') {
      await this.queueService.addReportJob({
        type: ReportType.AUDIT_LOG,
        parameters: {
          title: 'Usuário desativado',
          description: `Usuário ${event.data.email} foi desativado`,
          data: {
            eventType: event.eventType,
            userId: event.data.userId,
            email: event.data.email,
            reason: event.data.reason,
            deactivatedBy: event.data.deactivatedBy,
            timestamp: event.timestamp,
          },
        },
        format: 'json',
      });
    }
  }

  @OnEvent('user.login')
  async handleUserLogin(event: UserEvent) {
    if (event.eventType === 'user.login') {
      await this.queueService.addReportJob({
        type: ReportType.AUDIT_LOG,
        parameters: {
          title: 'Login de usuário',
          description: `Usuário ${event.data.email} fez login`,
          data: {
            eventType: event.eventType,
            userId: event.data.userId,
            email: event.data.email,
            loginTime: event.data.loginTime,
            ipAddress: event.data.ipAddress,
            userAgent: event.data.userAgent,
            timestamp: event.timestamp,
          },
        },
        format: 'json',
      });
    }
  }

  /**
   * Handler para eventos de empréstimo
   */
  @OnEvent('loan.created')
  async handleLoanCreated(event: LoanEvent) {
    if (event.eventType === 'loan.created') {
      await this.queueService.addReportJob({
        type: ReportType.AUDIT_LOG,
        parameters: {
          title: 'Empréstimo criado',
          description: `Novo empréstimo criado: ${event.data.loanId}`,
          data: {
            eventType: event.eventType,
            loanId: event.data.loanId,
            userId: event.data.userId,
            materialId: event.data.materialId,
            loanDate: event.data.loanDate,
            dueDate: event.data.dueDate,
            timestamp: event.timestamp,
          },
        },
        format: 'json',
      });
    }
  }

  @OnEvent('loan.returned')
  async handleLoanReturned(event: LoanEvent) {
    if (event.eventType === 'loan.returned') {
      await this.queueService.addReportJob({
        type: ReportType.AUDIT_LOG,
        parameters: {
          title: 'Empréstimo devolvido',
          description: `Empréstimo ${event.data.loanId} foi devolvido`,
          data: {
            eventType: event.eventType,
            loanId: event.data.loanId,
            userId: event.data.userId,
            materialId: event.data.materialId,
            returnDate: event.data.returnDate,
            isOverdue: event.data.isOverdue,
            daysOverdue: event.data.daysOverdue,
            timestamp: event.timestamp,
          },
        },
        format: 'json',
      });
    }
  }

  @OnEvent('loan.overdue')
  async handleLoanOverdue(event: LoanEvent) {
    if (event.eventType === 'loan.overdue') {
      await this.queueService.addReportJob({
        type: ReportType.AUDIT_LOG,
        parameters: {
          title: 'Empréstimo em atraso',
          description: `Empréstimo ${event.data.loanId} está em atraso`,
          data: {
            eventType: event.eventType,
            loanId: event.data.loanId,
            userId: event.data.userId,
            materialId: event.data.materialId,
            dueDate: event.data.dueDate,
            daysOverdue: event.data.daysOverdue,
            fineAmount: event.data.fineAmount,
            timestamp: event.timestamp,
          },
        },
        format: 'json',
      });
    }
  }

  /**
   * Handler para eventos de reserva
   */
  @OnEvent('reservation.created')
  async handleReservationCreated(event: ReservationEvent) {
    if (event.eventType === 'reservation.created') {
      await this.queueService.addReportJob({
        type: ReportType.AUDIT_LOG,
        parameters: {
          title: 'Reserva criada',
          description: `Nova reserva criada: ${event.data.reservationId}`,
          data: {
            eventType: event.eventType,
            reservationId: event.data.reservationId,
            userId: event.data.userId,
            materialId: event.data.materialId,
            priority: event.data.priority,
            queuePosition: event.data.queuePosition,
            timestamp: event.timestamp,
          },
        },
        format: 'json',
      });
    }
  }

  @OnEvent('reservation.fulfilled')
  async handleReservationFulfilled(event: ReservationEvent) {
    if (event.eventType === 'reservation.fulfilled') {
      await this.queueService.addReportJob({
        type: ReportType.AUDIT_LOG,
        parameters: {
          title: 'Reserva atendida',
          description: `Reserva ${event.data.reservationId} foi atendida`,
          data: {
            eventType: event.eventType,
            reservationId: event.data.reservationId,
            userId: event.data.userId,
            materialId: event.data.materialId,
            fulfillmentDate: event.data.fulfillmentDate,
            loanId: event.data.loanId,
            timestamp: event.timestamp,
          },
        },
        format: 'json',
      });
    }
  }

  /**
   * Handler para eventos de multa
   */
  @OnEvent('fine.created')
  async handleFineCreated(event: FineEvent) {
    if (event.eventType === 'fine.created') {
      await this.queueService.addReportJob({
        type: ReportType.AUDIT_LOG,
        parameters: {
          title: 'Multa criada',
          description: `Nova multa criada: ${event.data.fineId}`,
          data: {
            eventType: event.eventType,
            fineId: event.data.fineId,
            userId: event.data.userId,
            loanId: event.data.loanId,
            amount: event.data.amount,
            daysOverdue: event.data.daysOverdue,
            timestamp: event.timestamp,
          },
        },
        format: 'json',
      });
    }
  }

  @OnEvent('fine.paid')
  async handleFinePaid(event: FineEvent) {
    if (event.eventType === 'fine.paid') {
      await this.queueService.addReportJob({
        type: ReportType.AUDIT_LOG,
        parameters: {
          title: 'Multa paga',
          description: `Multa ${event.data.fineId} foi paga`,
          data: {
            eventType: event.eventType,
            fineId: event.data.fineId,
            userId: event.data.userId,
            amount: event.data.amount,
            paymentDate: event.data.paymentDate,
            paymentMethod: event.data.paymentMethod,
            timestamp: event.timestamp,
          },
        },
        format: 'json',
      });
    }
  }

  /**
   * Handler para eventos de material
   */
  @OnEvent('material.status_changed')
  async handleMaterialStatusChanged(event: MaterialEvent) {
    if (event.eventType === 'material.status_changed') {
      await this.queueService.addReportJob({
        type: ReportType.AUDIT_LOG,
        parameters: {
          title: 'Status de material alterado',
          description: `Status do material ${event.data.materialId} alterado`,
          data: {
            eventType: event.eventType,
            materialId: event.data.materialId,
            title: event.data.title,
            oldStatus: event.data.oldStatus,
            newStatus: event.data.newStatus,
            reason: event.data.reason,
            changedBy: event.data.changedBy,
            timestamp: event.timestamp,
          },
        },
        format: 'json',
      });
    }
  }
}