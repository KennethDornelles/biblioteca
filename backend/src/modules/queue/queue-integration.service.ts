import { Injectable, Logger } from '@nestjs/common';
import { QueueService } from './queue.service';
import { 
  EmailType, 
  NotificationType, 
  ReportType, 
  MaintenanceType,
  JobPriority 
} from './interfaces/queue.interfaces';

@Injectable()
export class QueueIntegrationService {
  private readonly logger = new Logger(QueueIntegrationService.name);

  constructor(private readonly queueService: QueueService) {}

  // ==================== INTEGRAÇÃO COM SISTEMA DE EMPRÉSTIMOS ====================

  async scheduleLoanReminderEmails(loans: Array<{
    userId: string;
    userEmail: string;
    userName: string;
    materialTitle: string;
    dueDate: Date;
    renewalUrl: string;
  }>): Promise<void> {
    try {
      this.logger.log(`Agendando ${loans.length} emails de lembrete de empréstimo`);

      for (const loan of loans) {
        const emailJob = await this.queueService.addEmailJob({
          type: EmailType.LOAN_REMINDER,
          to: loan.userEmail,
          subject: 'Lembrete de Devolução - Biblioteca Universitária',
          template: 'loan-reminder',
          context: {
            userName: loan.userName,
            materialTitle: loan.materialTitle,
            dueDate: loan.dueDate.toLocaleDateString('pt-BR'),
            renewalUrl: loan.renewalUrl,
          },
        }, {
          priority: JobPriority.HIGH,
          delay: 0, // Enviar imediatamente
        });

        this.logger.log(`Email de lembrete agendado para ${loan.userEmail}: Job ${emailJob.id}`);
      }
    } catch (error) {
      this.logger.error(`Falha ao agendar emails de lembrete: ${error.message}`);
      throw error;
    }
  }

  async scheduleOverdueNotifications(overdueLoans: Array<{
    userId: string;
    userName: string;
    materialTitle: string;
    daysOverdue: number;
    fineAmount: number;
    paymentUrl: string;
  }>): Promise<void> {
    try {
      this.logger.log(`Agendando ${overdueLoans.length} notificações de atraso`);

      for (const loan of overdueLoans) {
        // Email de notificação de atraso
        const emailJob = await this.queueService.addEmailJob({
          type: EmailType.OVERDUE_NOTICE,
          to: `user-${loan.userId}@biblioteca.edu.br`, // Email simulado
          subject: 'Aviso de Atraso - Biblioteca Universitária',
          template: 'overdue-notice',
          context: {
            userName: loan.userName,
            materialTitle: loan.materialTitle,
            daysOverdue: loan.daysOverdue,
            fineAmount: loan.fineAmount,
            paymentUrl: loan.paymentUrl,
          },
        }, {
          priority: JobPriority.CRITICAL,
          delay: 0,
        });

        // Notificação push
        const notificationJob = await this.queueService.addNotificationJob({
          type: NotificationType.PUSH,
          userId: loan.userId,
          title: 'Material em Atraso',
          message: `O material "${loan.materialTitle}" está atrasado há ${loan.daysOverdue} dias. Multa: R$ ${loan.fineAmount.toFixed(2)}`,
          data: {
            materialId: loan.materialTitle,
            fineAmount: loan.fineAmount,
            actionUrl: loan.paymentUrl,
          },
        }, {
          priority: JobPriority.HIGH,
          delay: 0,
        });

        this.logger.log(`Notificações de atraso agendadas para usuário ${loan.userId}: Email ${emailJob.id}, Push ${notificationJob.id}`);
      }
    } catch (error) {
      this.logger.error(`Falha ao agendar notificações de atraso: ${error.message}`);
      throw error;
    }
  }

  // ==================== INTEGRAÇÃO COM SISTEMA DE RESERVAS ====================

  async scheduleReservationAvailableNotifications(reservations: Array<{
    userId: string;
    userEmail: string;
    userName: string;
    materialTitle: string;
    pickupDeadline: Date;
    pickupLocation: string;
  }>): Promise<void> {
    try {
      this.logger.log(`Agendando ${reservations.length} notificações de reserva disponível`);

      for (const reservation of reservations) {
        // Email de notificação
        const emailJob = await this.queueService.addEmailJob({
          type: EmailType.RESERVATION_AVAILABLE,
          to: reservation.userEmail,
          subject: 'Reserva Disponível - Biblioteca Universitária',
          template: 'reservation-available',
          context: {
            userName: reservation.userName,
            materialTitle: reservation.materialTitle,
            pickupDeadline: reservation.pickupDeadline.toLocaleDateString('pt-BR'),
            pickupLocation: reservation.pickupLocation,
          },
        }, {
          priority: JobPriority.HIGH,
          delay: 0,
        });

        // Notificação in-app
        const notificationJob = await this.queueService.addNotificationJob({
          type: NotificationType.IN_APP,
          userId: reservation.userId,
          title: 'Reserva Disponível',
          message: `O material "${reservation.materialTitle}" está disponível para retirada até ${reservation.pickupDeadline.toLocaleDateString('pt-BR')}`,
          data: {
            materialId: reservation.materialTitle,
            pickupLocation: reservation.pickupLocation,
            actionUrl: `/reservations/${reservation.userId}`,
          },
          expiresAt: reservation.pickupDeadline,
        }, {
          priority: JobPriority.NORMAL,
          delay: 0,
        });

        this.logger.log(`Notificações de reserva agendadas para usuário ${reservation.userId}: Email ${emailJob.id}, In-App ${notificationJob.id}`);
      }
    } catch (error) {
      this.logger.error(`Falha ao agendar notificações de reserva: ${error.message}`);
      throw error;
    }
  }

  // ==================== INTEGRAÇÃO COM SISTEMA DE RELATÓRIOS ====================

  async scheduleDailyReports(): Promise<void> {
    try {
      this.logger.log('Agendando relatórios diários');

      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];

      // Relatório diário de empréstimos
      const dailyLoansJob = await this.queueService.addReportJob({
        type: ReportType.DAILY_LOANS,
        parameters: { date: dateStr },
        format: 'pdf',
        includeCharts: true,
        customFilters: { includeOverdue: true },
      }, {
        priority: JobPriority.LOW,
        delay: 2 * 60 * 60 * 1000, // 2 horas de atraso
      });

      // Relatório de atrasos
      const overdueReportJob = await this.queueService.addReportJob({
        type: ReportType.OVERDUE_REPORT,
        parameters: { daysOverdue: 1, includeFines: true },
        format: 'excel',
        includeCharts: false,
        customFilters: { includeUserDetails: true },
      }, {
        priority: JobPriority.NORMAL,
        delay: 3 * 60 * 60 * 1000, // 3 horas de atraso
      });

      this.logger.log(`Relatórios diários agendados: Empréstimos ${dailyLoansJob.id}, Atrasos ${overdueReportJob.id}`);
    } catch (error) {
      this.logger.error(`Falha ao agendar relatórios diários: ${error.message}`);
      throw error;
    }
  }

  async scheduleMonthlyReports(year: number, month: number): Promise<void> {
    try {
      this.logger.log(`Agendando relatórios mensais para ${month}/${year}`);

      // Relatório mensal de estatísticas
      const monthlyStatsJob = await this.queueService.addReportJob({
        type: ReportType.MONTHLY_STATISTICS,
        parameters: { year, month },
        format: 'pdf',
        includeCharts: true,
        customFilters: { includeComparisons: true },
      }, {
        priority: JobPriority.LOW,
        delay: 24 * 60 * 60 * 1000, // 24 horas de atraso
      });

      // Relatório financeiro
      const financialReportJob = await this.queueService.addReportJob({
        type: ReportType.FINANCIAL_REPORT,
        parameters: { 
          startDate: `${year}-${month.toString().padStart(2, '0')}-01`,
          endDate: `${year}-${month.toString().padStart(2, '0')}-31`,
          includeFines: true,
          includeFees: true,
        },
        format: 'excel',
        includeCharts: true,
        customFilters: { includeBreakdown: true },
      }, {
        priority: JobPriority.LOW,
        delay: 25 * 60 * 60 * 1000, // 25 horas de atraso
      });

      this.logger.log(`Relatórios mensais agendados: Estatísticas ${monthlyStatsJob.id}, Financeiro ${financialReportJob.id}`);
    } catch (error) {
      this.logger.error(`Falha ao agendar relatórios mensais: ${error.message}`);
      throw error;
    }
  }

  // ==================== INTEGRAÇÃO COM SISTEMA DE MANUTENÇÃO ====================

  async scheduleSystemMaintenance(): Promise<void> {
    try {
      this.logger.log('Agendando tarefas de manutenção do sistema');

      // Limpeza de banco de dados (executar às 2h da manhã)
      const dbCleanupJob = await this.queueService.addMaintenanceJob({
        type: MaintenanceType.DATABASE_CLEANUP,
        parameters: {
          cleanupType: 'logs_and_temp',
          olderThan: '30d',
          maxRecords: 10000,
          dryRun: false,
        },
      }, {
        priority: JobPriority.LOW,
        delay: this.calculateDelayUntil(2, 0), // 2h da manhã
      });

      // Rotação de logs (executar às 3h da manhã)
      const logRotationJob = await this.queueService.addMaintenanceJob({
        type: MaintenanceType.LOG_ROTATION,
        parameters: {
          logTypes: ['application', 'access', 'error'],
          maxSize: '100MB',
          maxFiles: 10,
          compressOld: true,
        },
      }, {
        priority: JobPriority.LOW,
        delay: this.calculateDelayUntil(3, 0), // 3h da manhã
      });

      // Verificação de saúde do sistema (executar às 6h da manhã)
      const healthCheckJob = await this.queueService.addMaintenanceJob({
        type: MaintenanceType.SYSTEM_HEALTH_CHECK,
        parameters: {
          checkTypes: ['database', 'redis', 'disk', 'memory'],
          thresholds: {
            cpu: 80,
            memory: 85,
            disk: 90,
          },
          generateReport: true,
        },
      }, {
        priority: JobPriority.NORMAL,
        delay: this.calculateDelayUntil(6, 0), // 6h da manhã
      });

      this.logger.log(`Tarefas de manutenção agendadas: DB Cleanup ${dbCleanupJob.id}, Log Rotation ${logRotationJob.id}, Health Check ${healthCheckJob.id}`);
    } catch (error) {
      this.logger.error(`Falha ao agendar tarefas de manutenção: ${error.message}`);
      throw error;
    }
  }

  // ==================== INTEGRAÇÃO COM SISTEMA DE USUÁRIOS ====================

  async scheduleWelcomeEmails(newUsers: Array<{
    userId: string;
    email: string;
    name: string;
    verificationUrl: string;
  }>): Promise<void> {
    try {
      this.logger.log(`Agendando ${newUsers.length} emails de boas-vindas`);

      for (const user of newUsers) {
        const emailJob = await this.queueService.addEmailJob({
          type: EmailType.WELCOME,
          to: user.email,
          subject: 'Bem-vindo à Biblioteca Universitária',
          template: 'welcome',
          context: {
            userName: user.name,
            verificationUrl: user.verificationUrl,
          },
        }, {
          priority: JobPriority.NORMAL,
          delay: 5 * 60 * 1000, // 5 minutos de atraso
        });

        this.logger.log(`Email de boas-vindas agendado para ${user.email}: Job ${emailJob.id}`);
      }
    } catch (error) {
      this.logger.error(`Falha ao agendar emails de boas-vindas: ${error.message}`);
      throw error;
    }
  }

  async schedulePasswordResetEmail(
    userId: string,
    email: string,
    userName: string,
    resetUrl: string,
    expiresAt: Date
  ): Promise<void> {
    try {
      this.logger.log(`Agendando email de redefinição de senha para ${email}`);

      const emailJob = await this.queueService.addEmailJob({
        type: EmailType.PASSWORD_RESET,
        to: email,
        subject: 'Redefinição de Senha - Biblioteca Universitária',
        template: 'password-reset',
        context: {
          userName,
          resetUrl,
          expiresAt: expiresAt.toLocaleString('pt-BR'),
        },
      }, {
        priority: JobPriority.HIGH,
        delay: 0,
      });

      this.logger.log(`Email de redefinição de senha agendado: Job ${emailJob.id}`);
    } catch (error) {
      this.logger.error(`Falha ao agendar email de redefinição de senha: ${error.message}`);
      throw error;
    }
  }

  // ==================== UTILITÁRIOS ====================

  private calculateDelayUntil(hour: number, minute: number): number {
    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(hour, minute, 0, 0);

    // Se o horário já passou hoje, agendar para amanhã
    if (targetTime <= now) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    return targetTime.getTime() - now.getTime();
  }

  // ==================== MÉTODOS DE MONITORAMENTO ====================

  async getQueueHealthStatus(): Promise<{
    status: string;
    message: string;
    metrics: Record<string, any>;
  }> {
    try {
      const stats = await this.queueService.getQueueStats();
      
      // Calcular métricas de saúde
      const totalJobs = Object.values(stats).reduce((sum: number, queueStats: any) => {
        return sum + (queueStats.waiting || 0) + (queueStats.active || 0) + (queueStats.failed || 0);
      }, 0);

      const failedJobs = Object.values(stats).reduce((sum: number, queueStats: any) => {
        return sum + (queueStats.failed || 0);
      }, 0);

      const errorRate = totalJobs > 0 ? (failedJobs / totalJobs) * 100 : 0;
      
      let status: string;
      let message: string;

      if (errorRate > 10) {
        status = 'critical';
        message = 'Taxa de erro alta nas filas - verificação urgente necessária';
      } else if (errorRate > 5) {
        status = 'warning';
        message = 'Taxa de erro moderada nas filas - monitoramento recomendado';
      } else {
        status = 'healthy';
        message = 'Filas funcionando normalmente';
      }

      return {
        status,
        message,
        metrics: {
          totalJobs,
          failedJobs,
          errorRate: errorRate.toFixed(2),
          queues: Object.keys(stats).length,
          stats,
        },
      };
    } catch (error) {
      this.logger.error(`Falha ao obter status de saúde das filas: ${error.message}`);
      throw error;
    }
  }
}
