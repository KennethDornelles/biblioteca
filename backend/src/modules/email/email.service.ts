import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get('email.host'),
        port: this.configService.get('email.port'),
        secure: this.configService.get('email.secure'),
        auth: {
          user: this.configService.get('email.user'),
          pass: this.configService.get('email.pass'),
        },
      });

      // Verificar conexão
      await this.transporter.verify();
      this.logger.log('Transporter de email configurado com sucesso');
    } catch (error) {
      this.logger.error(`Falha ao configurar transporter de email: ${error.message}`);
    }
  }

  async sendWelcomeEmail(
    to: string | string[],
    userName: string,
    verificationUrl: string
  ): Promise<string> {
    const mailOptions = {
      from: `"${this.configService.get('email.fromName')}" <${this.configService.get('email.from')}>`,
      to: Array.isArray(to) ? to.join(',') : to,
      subject: 'Bem-vindo à Biblioteca Universitária',
      html: `
        <h1>Bem-vindo, ${userName}!</h1>
        <p>Seu cadastro foi realizado com sucesso na Biblioteca Universitária.</p>
        <p>Para ativar sua conta, clique no link abaixo:</p>
        <a href="${verificationUrl}">Ativar Conta</a>
        <p>Se você não solicitou este cadastro, ignore este email.</p>
      `,
    };

    const result = await this.transporter.sendMail(mailOptions);
    return result.messageId;
  }

  async sendLoanReminderEmail(
    to: string | string[],
    userName: string,
    materialTitle: string,
    dueDate: string,
    renewalUrl: string
  ): Promise<string> {
    const mailOptions = {
      from: `"${this.configService.get('email.fromName')}" <${this.configService.get('email.from')}>`,
      to: Array.isArray(to) ? to.join(',') : to,
      subject: 'Lembrete de Devolução - Biblioteca Universitária',
      html: `
        <h1>Olá, ${userName}!</h1>
        <p>Este é um lembrete de que o material <strong>${materialTitle}</strong> deve ser devolvido até <strong>${dueDate}</strong>.</p>
        <p>Para renovar o empréstimo, clique no link abaixo:</p>
        <a href="${renewalUrl}">Renovar Empréstimo</a>
        <p>Evite multas por atraso na devolução.</p>
      `,
    };

    const result = await this.transporter.sendMail(mailOptions);
    return result.messageId;
  }

  async sendOverdueNoticeEmail(
    to: string | string[],
    userName: string,
    materialTitle: string,
    daysOverdue: number,
    fineAmount: number,
    paymentUrl: string
  ): Promise<string> {
    const mailOptions = {
      from: `"${this.configService.get('email.fromName')}" <${this.configService.get('email.from')}>`,
      to: Array.isArray(to) ? to.join(',') : to,
      subject: 'Aviso de Atraso - Biblioteca Universitária',
      html: `
        <h1>Atenção, ${userName}!</h1>
        <p>O material <strong>${materialTitle}</strong> está atrasado há <strong>${daysOverdue} dias</strong>.</p>
        <p>Valor da multa: <strong>R$ ${fineAmount.toFixed(2)}</strong></p>
        <p>Para pagar a multa, clique no link abaixo:</p>
        <a href="${paymentUrl}">Pagar Multa</a>
        <p>Após o pagamento, você poderá fazer novos empréstimos.</p>
      `,
    };

    const result = await this.transporter.sendMail(mailOptions);
    return result.messageId;
  }

  async sendReservationAvailableEmail(
    to: string | string[],
    userName: string,
    materialTitle: string,
    pickupDeadline: string,
    pickupLocation: string
  ): Promise<string> {
    const mailOptions = {
      from: `"${this.configService.get('email.fromName')}" <${this.configService.get('email.from')}>`,
      to: Array.isArray(to) ? to.join(',') : to,
      subject: 'Reserva Disponível - Biblioteca Universitária',
      html: `
        <h1>Ótima notícia, ${userName}!</h1>
        <p>O material <strong>${materialTitle}</strong> que você reservou está disponível para retirada.</p>
        <p><strong>Prazo para retirada:</strong> ${pickupDeadline}</p>
        <p><strong>Local de retirada:</strong> ${pickupLocation}</p>
        <p>Apresente seu documento de identificação para retirar o material.</p>
      `,
    };

    const result = await this.transporter.sendMail(mailOptions);
    return result.messageId;
  }

  async sendFineNoticeEmail(
    to: string | string[],
    userName: string,
    fineAmount: number,
    reason: string,
    paymentUrl: string,
    appealUrl: string
  ): Promise<string> {
    const mailOptions = {
      from: `"${this.configService.get('email.fromName')}" <${this.configService.get('email.from')}>`,
      to: Array.isArray(to) ? to.join(',') : to,
      subject: 'Notificação de Multa - Biblioteca Universitária',
      html: `
        <h1>Notificação de Multa</h1>
        <p>Olá, ${userName}!</p>
        <p>Uma multa foi aplicada ao seu cadastro:</p>
        <p><strong>Valor:</strong> R$ ${fineAmount.toFixed(2)}</p>
        <p><strong>Motivo:</strong> ${reason}</p>
        <p>Para pagar a multa, clique no link abaixo:</p>
        <a href="${paymentUrl}">Pagar Multa</a>
        <p>Se você discorda da aplicação da multa, pode recorrer:</p>
        <a href="${appealUrl}">Solicitar Recurso</a>
      `,
    };

    const result = await this.transporter.sendMail(mailOptions);
    return result.messageId;
  }

  async sendPasswordResetEmail(
    to: string | string[],
    userName: string,
    resetUrl: string,
    expiresAt: string
  ): Promise<string> {
    const mailOptions = {
      from: `"${this.configService.get('email.fromName')}" <${this.configService.get('email.from')}>`,
      to: Array.isArray(to) ? to.join(',') : to,
      subject: 'Redefinição de Senha - Biblioteca Universitária',
      html: `
        <h1>Redefinição de Senha</h1>
        <p>Olá, ${userName}!</p>
        <p>Você solicitou a redefinição de sua senha.</p>
        <p>Para criar uma nova senha, clique no link abaixo:</p>
        <a href="${resetUrl}">Redefinir Senha</a>
        <p><strong>Este link expira em:</strong> ${expiresAt}</p>
        <p>Se você não solicitou esta redefinição, ignore este email.</p>
      `,
    };

    const result = await this.transporter.sendMail(mailOptions);
    return result.messageId;
  }

  async sendAccountVerificationEmail(
    to: string | string[],
    userName: string,
    verificationUrl: string,
    expiresAt: string
  ): Promise<string> {
    const mailOptions = {
      from: `"${this.configService.get('email.fromName')}" <${this.configService.get('email.from')}>`,
      to: Array.isArray(to) ? to.join(',') : to,
      subject: 'Verificação de Conta - Biblioteca Universitária',
      html: `
        <h1>Verificação de Conta</h1>
        <p>Olá, ${userName}!</p>
        <p>Para ativar sua conta na Biblioteca Universitária, clique no link abaixo:</p>
        <a href="${verificationUrl}">Verificar Conta</a>
        <p><strong>Este link expira em:</strong> ${expiresAt}</p>
        <p>Após a verificação, você poderá acessar todos os serviços da biblioteca.</p>
      `,
    };

    const result = await this.transporter.sendMail(mailOptions);
    return result.messageId;
  }

  async sendSystemNotificationEmail(
    to: string | string[],
    title: string,
    message: string,
    actionUrl?: string,
    actionText?: string
  ): Promise<string> {
    const mailOptions = {
      from: `"${this.configService.get('email.fromName')}" <${this.configService.get('email.from')}>`,
      to: Array.isArray(to) ? to.join(',') : to,
      subject: title,
      html: `
        <h1>${title}</h1>
        <p>${message}</p>
        ${actionUrl && actionText ? `<a href="${actionUrl}">${actionText}</a>` : ''}
        <p>Esta é uma notificação automática do sistema da Biblioteca Universitária.</p>
      `,
    };

    const result = await this.transporter.sendMail(mailOptions);
    return result.messageId;
  }
}
