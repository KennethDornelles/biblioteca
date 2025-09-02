import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { EmailJobData, EmailJobResult, EmailType } from '../interfaces/queue.interfaces';
import { EmailService } from '../../email/email.service';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly emailService: EmailService) {}

  @Process('send-email')
  async handleSendEmail(job: Job<EmailJobData>): Promise<EmailJobResult> {
    const { data } = job;
    const startTime = Date.now();

    this.logger.log(`Processing email job ${job.id}: ${data.type} to ${Array.isArray(data.to) ? data.to.length : 1} recipient(s)`);

    try {
      // Atualizar progresso do job
      await job.progress(25);

      // Validar dados do email
      this.validateEmailData(data);

      await job.progress(50);

      // Enviar email baseado no tipo
      let result: EmailJobResult;

      switch (data.type) {
        case EmailType.WELCOME:
          result = await this.sendWelcomeEmail(data);
          break;
        case EmailType.LOAN_REMINDER:
          result = await this.sendLoanReminderEmail(data);
          break;
        case EmailType.OVERDUE_NOTICE:
          result = await this.sendOverdueNoticeEmail(data);
          break;
        case EmailType.RESERVATION_AVAILABLE:
          result = await this.sendReservationAvailableEmail(data);
          break;
        case EmailType.FINE_NOTICE:
          result = await this.sendFineNoticeEmail(data);
          break;
        case EmailType.PASSWORD_RESET:
          result = await this.sendPasswordResetEmail(data);
          break;
        case EmailType.ACCOUNT_VERIFICATION:
          result = await this.sendAccountVerificationEmail(data);
          break;
        case EmailType.SYSTEM_NOTIFICATION:
          result = await this.sendSystemNotificationEmail(data);
          break;
        default:
          throw new Error(`Tipo de email não suportado: ${data.type}`);
      }

      await job.progress(100);

      const processingTime = Date.now() - startTime;
      this.logger.log(`Email job ${job.id} completed successfully in ${processingTime}ms`);

      return result;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      this.logger.error(`Email job ${job.id} failed after ${processingTime}ms: ${error.message}`);

      // Retry logic é gerenciada pelo Bull
      throw error;
    }
  }

  private validateEmailData(data: EmailJobData): void {
    if (!data.to || (Array.isArray(data.to) && data.to.length === 0)) {
      throw new Error('Destinatário(s) é obrigatório');
    }

    if (!data.subject || data.subject.trim().length === 0) {
      throw new Error('Assunto é obrigatório');
    }

    if (!data.template || data.template.trim().length === 0) {
      throw new Error('Template é obrigatório');
    }

    if (!data.context || typeof data.context !== 'object') {
      throw new Error('Contexto é obrigatório e deve ser um objeto');
    }
  }

  private async sendWelcomeEmail(data: EmailJobData): Promise<EmailJobResult> {
    try {
      const messageId = await this.emailService.sendWelcomeEmail(
        data.to,
        data.context.userName,
        data.context.verificationUrl
      );

      return {
        success: true,
        messageId,
        sentAt: new Date(),
        recipientCount: Array.isArray(data.to) ? data.to.length : 1,
      };
    } catch (error) {
      this.logger.error(`Failed to send welcome email: ${error.message}`);
      throw error;
    }
  }

  private async sendLoanReminderEmail(data: EmailJobData): Promise<EmailJobResult> {
    try {
      const messageId = await this.emailService.sendLoanReminderEmail(
        data.to,
        data.context.userName,
        data.context.materialTitle,
        data.context.dueDate,
        data.context.renewalUrl
      );

      return {
        success: true,
        messageId,
        sentAt: new Date(),
        recipientCount: Array.isArray(data.to) ? data.to.length : 1,
      };
    } catch (error) {
      this.logger.error(`Failed to send loan reminder email: ${error.message}`);
      throw error;
    }
  }

  private async sendOverdueNoticeEmail(data: EmailJobData): Promise<EmailJobResult> {
    try {
      const messageId = await this.emailService.sendOverdueNoticeEmail(
        data.to,
        data.context.userName,
        data.context.materialTitle,
        data.context.daysOverdue,
        data.context.fineAmount,
        data.context.paymentUrl
      );

      return {
        success: true,
        messageId,
        sentAt: new Date(),
        recipientCount: Array.isArray(data.to) ? data.to.length : 1,
      };
    } catch (error) {
      this.logger.error(`Failed to send overdue notice email: ${error.message}`);
      throw error;
    }
  }

  private async sendReservationAvailableEmail(data: EmailJobData): Promise<EmailJobResult> {
    try {
      const messageId = await this.emailService.sendReservationAvailableEmail(
        data.to,
        data.context.userName,
        data.context.materialTitle,
        data.context.pickupDeadline,
        data.context.pickupLocation
      );

      return {
        success: true,
        messageId,
        sentAt: new Date(),
        recipientCount: Array.isArray(data.to) ? data.to.length : 1,
      };
    } catch (error) {
      this.logger.error(`Failed to send reservation available email: ${error.message}`);
      throw error;
    }
  }

  private async sendFineNoticeEmail(data: EmailJobData): Promise<EmailJobResult> {
    try {
      const messageId = await this.emailService.sendFineNoticeEmail(
        data.to,
        data.context.userName,
        data.context.fineAmount,
        data.context.reason,
        data.context.paymentUrl,
        data.context.appealUrl
      );

      return {
        success: true,
        messageId,
        sentAt: new Date(),
        recipientCount: Array.isArray(data.to) ? data.to.length : 1,
      };
    } catch (error) {
      this.logger.error(`Failed to send fine notice email: ${error.message}`);
      throw error;
    }
  }

  private async sendPasswordResetEmail(data: EmailJobData): Promise<EmailJobResult> {
    try {
      const messageId = await this.emailService.sendPasswordResetEmail(
        data.to,
        data.context.userName,
        data.context.resetUrl,
        data.context.expiresAt
      );

      return {
        success: true,
        messageId,
        sentAt: new Date(),
        recipientCount: Array.isArray(data.to) ? data.to.length : 1,
      };
    } catch (error) {
      this.logger.error(`Failed to send password reset email: ${error.message}`);
      throw error;
    }
  }

  private async sendAccountVerificationEmail(data: EmailJobData): Promise<EmailJobResult> {
    try {
      const messageId = await this.emailService.sendAccountVerificationEmail(
        data.to,
        data.context.userName,
        data.context.verificationUrl,
        data.context.expiresAt
      );

      return {
        success: true,
        messageId,
        sentAt: new Date(),
        recipientCount: Array.isArray(data.to) ? data.to.length : 1,
      };
    } catch (error) {
      this.logger.error(`Failed to send account verification email: ${error.message}`);
      throw error;
    }
  }

  private async sendSystemNotificationEmail(data: EmailJobData): Promise<EmailJobResult> {
    try {
      const messageId = await this.emailService.sendSystemNotificationEmail(
        data.to,
        data.context.title,
        data.context.message,
        data.context.actionUrl,
        data.context.actionText
      );

      return {
        success: true,
        messageId,
        sentAt: new Date(),
        recipientCount: Array.isArray(data.to) ? data.to.length : 1,
      };
    } catch (error) {
      this.logger.error(`Failed to send system notification email: ${error.message}`);
      throw error;
    }
  }
}
