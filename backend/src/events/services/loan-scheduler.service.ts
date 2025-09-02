import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaClient } from '@prisma/client';
import { EventBusService, EventFactoryService } from './event-bus.service';
import { LoanStatus } from '../../enums';
import { differenceInDays, addDays } from 'date-fns';

/**
 * Serviço para tarefas agendadas relacionadas a empréstimos
 */
@Injectable()
export class LoanSchedulerService {
  private readonly logger = new Logger(LoanSchedulerService.name);
  private prisma: PrismaClient;

  constructor(
    private readonly eventBus: EventBusService,
    private readonly eventFactory: EventFactoryService,
  ) {
    this.prisma = new PrismaClient();
  }

  /**
   * Verifica empréstimos que vencem em breve (diariamente às 9h)
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkExpiringLoans() {
    this.logger.log('Verificando empréstimos que vencem em breve...');
    
    try {
      const tomorrow = addDays(new Date(), 1);
      const dayAfterTomorrow = addDays(new Date(), 2);
      
      // Buscar empréstimos que vencem em 1 ou 2 dias
      const expiringLoans = await this.prisma.loan.findMany({
        where: {
          status: LoanStatus.ACTIVE,
          dueDate: {
            gte: tomorrow,
            lte: dayAfterTomorrow,
          },
        },
        include: {
          user: true,
          material: true,
        },
      });

      for (const loan of expiringLoans) {
        const daysUntilDue = differenceInDays(loan.dueDate, new Date());
        
        // Disparar evento de empréstimo expirando em breve
        const expiringEvent = this.eventFactory.createDomainEvent(
          'loan.expiring_soon',
          loan.id,
          1,
          {
            loanId: loan.id,
            userId: loan.userId,
            materialId: loan.materialId,
            dueDate: loan.dueDate,
            daysUntilDue,
          },
          loan.userId
        );
        
        await this.eventBus.publish(expiringEvent);
        
        this.logger.log(`Evento de expiração disparado para empréstimo ${loan.id}`);
      }

      this.logger.log(`${expiringLoans.length} empréstimos verificados para expiração`);
    } catch (error) {
      this.logger.error(`Erro ao verificar empréstimos expirando: ${error.message}`);
    }
  }

  /**
   * Verifica empréstimos em atraso (diariamente às 10h)
   */
  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async checkOverdueLoans() {
    this.logger.log('Verificando empréstimos em atraso...');
    
    try {
      const today = new Date();
      
      // Buscar empréstimos em atraso
      const overdueLoans = await this.prisma.loan.findMany({
        where: {
          status: LoanStatus.ACTIVE,
          dueDate: {
            lt: today,
          },
        },
        include: {
          user: true,
          material: true,
        },
      });

      for (const loan of overdueLoans) {
        const daysOverdue = differenceInDays(today, loan.dueDate);
        
        // Disparar evento de empréstimo em atraso
        const overdueEvent = this.eventFactory.createDomainEvent(
          'loan.overdue',
          loan.id,
          1,
          {
            loanId: loan.id,
            userId: loan.userId,
            materialId: loan.materialId,
            dueDate: loan.dueDate,
            daysOverdue,
            fineAmount: this.calculateFineAmount(daysOverdue),
          },
          loan.userId
        );
        
        await this.eventBus.publish(overdueEvent);
        
        this.logger.log(`Evento de atraso disparado para empréstimo ${loan.id} (${daysOverdue} dias)`);
      }

      this.logger.log(`${overdueLoans.length} empréstimos em atraso verificados`);
    } catch (error) {
      this.logger.error(`Erro ao verificar empréstimos em atraso: ${error.message}`);
    }
  }

  /**
   * Verifica reservas expirando em breve (diariamente às 11h)
   */
  @Cron(CronExpression.EVERY_DAY_AT_11AM)
  async checkExpiringReservations() {
    this.logger.log('Verificando reservas expirando em breve...');
    
    try {
      const tomorrow = addDays(new Date(), 1);
      const dayAfterTomorrow = addDays(new Date(), 2);
      
      // Buscar reservas que expiram em 1 ou 2 dias
      const expiringReservations = await this.prisma.reservation.findMany({
        where: {
          status: 'ACTIVE',
          expirationDate: {
            gte: tomorrow,
            lte: dayAfterTomorrow,
          },
        },
        include: {
          user: true,
          material: true,
        },
      });

      for (const reservation of expiringReservations) {
        const daysUntilExpiration = differenceInDays(reservation.expirationDate, new Date());
        
        // Disparar evento de reserva expirando em breve
        const expiringEvent = this.eventFactory.createDomainEvent(
          'reservation.expiring_soon',
          reservation.id,
          1,
          {
            reservationId: reservation.id,
            userId: reservation.userId,
            materialId: reservation.materialId,
            expirationDate: reservation.expirationDate,
            daysUntilExpiration,
          },
          reservation.userId
        );
        
        await this.eventBus.publish(expiringEvent);
        
        this.logger.log(`Evento de expiração disparado para reserva ${reservation.id}`);
      }

      this.logger.log(`${expiringReservations.length} reservas verificadas para expiração`);
    } catch (error) {
      this.logger.error(`Erro ao verificar reservas expirando: ${error.message}`);
    }
  }

  /**
   * Verifica reservas expiradas (diariamente às 12h)
   */
  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async checkExpiredReservations() {
    this.logger.log('Verificando reservas expiradas...');
    
    try {
      const today = new Date();
      
      // Buscar reservas expiradas
      const expiredReservations = await this.prisma.reservation.findMany({
        where: {
          status: 'ACTIVE',
          expirationDate: {
            lt: today,
          },
        },
        include: {
          user: true,
          material: true,
        },
      });

      for (const reservation of expiredReservations) {
        const daysExpired = differenceInDays(today, reservation.expirationDate);
        
        // Atualizar status da reserva para expirada
        await this.prisma.reservation.update({
          where: { id: reservation.id },
          data: { status: 'EXPIRED' },
        });
        
        // Disparar evento de reserva expirada
        const expiredEvent = this.eventFactory.createDomainEvent(
          'reservation.expired',
          reservation.id,
          2,
          {
            reservationId: reservation.id,
            userId: reservation.userId,
            materialId: reservation.materialId,
            expirationDate: reservation.expirationDate,
            daysExpired,
          },
          reservation.userId
        );
        
        await this.eventBus.publish(expiredEvent);
        
        this.logger.log(`Reserva ${reservation.id} marcada como expirada`);
      }

      this.logger.log(`${expiredReservations.length} reservas expiradas processadas`);
    } catch (error) {
      this.logger.error(`Erro ao verificar reservas expiradas: ${error.message}`);
    }
  }

  /**
   * Calcula o valor da multa baseado nos dias de atraso
   */
  private calculateFineAmount(daysOverdue: number): number {
    // Valor base da multa por dia de atraso
    const baseFinePerDay = 1.0;
    
    // Aplicar multa progressiva
    if (daysOverdue <= 7) {
      return daysOverdue * baseFinePerDay;
    } else if (daysOverdue <= 15) {
      return 7 * baseFinePerDay + (daysOverdue - 7) * (baseFinePerDay * 1.5);
    } else {
      return 7 * baseFinePerDay + 8 * (baseFinePerDay * 1.5) + (daysOverdue - 15) * (baseFinePerDay * 2);
    }
  }
}
