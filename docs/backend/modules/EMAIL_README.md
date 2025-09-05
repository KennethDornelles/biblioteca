# 📧 Módulo Email

Sistema completo de envio de emails para notificações e comunicações da biblioteca.

## 📋 Visão Geral

O módulo Email é responsável pelo envio de emails transacionais e informativos do sistema de biblioteca. Gerencia templates, filas de envio, configurações SMTP e tracking de emails enviados.

## 🏗️ Estrutura do Módulo

```
src/modules/email/
├── email.service.ts                # Serviço principal de email
├── email.module.ts                 # Módulo NestJS
└── index.ts                        # Exportações do módulo
```

## 🎯 Funcionalidades

### ✅ Tipos de Email
- **Boas-vindas**: Email de boas-vindas para novos usuários
- **Lembretes de empréstimo**: Alertas de vencimento próximo
- **Notificações de atraso**: Avisos de materiais em atraso
- **Confirmações**: Empréstimos, devoluções, reservas
- **Relatórios**: Envio de relatórios periódicos
- **Recuperação de senha**: Reset de senhas
- **Avisos gerais**: Comunicados da biblioteca

### ✅ Gerenciamento de Templates
- **Templates HTML**: Design responsivo para emails
- **Personalização**: Dados dinâmicos inseridos nos templates
- **Multilíngue**: Suporte a diferentes idiomas
- **Versionamento**: Controle de versões dos templates

### ✅ Configurações Avançadas
- **SMTP configurável**: Múltiplos provedores de email
- **Rate limiting**: Controle de envio em massa
- **Retry automático**: Reenvio em caso de falha
- **Tracking**: Rastreamento de entrega e abertura

## 📊 Principais Métodos

### Emails de Sistema
```typescript
// Boas-vindas
sendWelcomeEmail(to: string, userData: any): Promise<string>

// Lembretes de empréstimo
sendLoanReminderEmail(to: string, loanData: any): Promise<string>

// Notificação de atraso
sendOverdueNotificationEmail(to: string, overdueData: any): Promise<string>

// Confirmação de reserva
sendReservationConfirmationEmail(to: string, reservationData: any): Promise<string>

// Reset de senha
sendPasswordResetEmail(to: string, resetData: any): Promise<string>

// Relatórios
sendReportEmail(to: string, reportData: any): Promise<string>

// Email genérico
sendEmail(options: EmailOptions): Promise<string>
```

## 🔧 Interface EmailOptions

```typescript
interface EmailOptions {
  to: string | string[];              // Destinatário(s)
  subject: string;                    // Assunto
  html?: string;                      // Conteúdo HTML
  text?: string;                      // Conteúdo texto
  template?: string;                  // Nome do template
  context?: Record<string, any>;      // Dados para o template
  attachments?: EmailAttachment[];    // Anexos
  priority?: 'high' | 'normal' | 'low'; // Prioridade
  replyTo?: string;                   // Email de resposta
}

interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType: string;
}
```

## 📧 Templates Disponíveis

### Template de Boas-vindas
```html
<!-- welcome.hbs -->
<h1>Bem-vindo à Biblioteca Universitária!</h1>
<p>Olá {{name}},</p>
<p>Sua conta foi criada com sucesso. Seus dados de acesso:</p>
<ul>
  <li>Email: {{email}}</li>
  <li>Tipo de usuário: {{userType}}</li>
</ul>
<p>Acesse o sistema em: <a href="{{systemUrl}}">{{systemUrl}}</a></p>
```

### Template de Lembrete
```html
<!-- loan-reminder.hbs -->
<h1>Lembrete de Devolução</h1>
<p>Olá {{userName}},</p>
<p>O material "{{materialTitle}}" deve ser devolvido em {{daysRemaining}} dias.</p>
<p>Data de vencimento: {{dueDate}}</p>
<p>Renove online ou visite a biblioteca.</p>
```

### Template de Atraso
```html
<!-- overdue-notification.hbs -->
<h1>Material em Atraso</h1>
<p>Olá {{userName}},</p>
<p>O material "{{materialTitle}}" está em atraso há {{daysOverdue}} dias.</p>
<p>Multa atual: R$ {{fineAmount}}</p>
<p>Devolva o material o quanto antes para evitar mais multas.</p>
```

## 🔐 Configurações SMTP

### Configuração no environment
```typescript
// .env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=biblioteca@universidade.edu.br
SMTP_PASS=senha_app_google
SMTP_FROM_NAME=Biblioteca Universitária
SMTP_FROM_EMAIL=biblioteca@universidade.edu.br
```

### Configuração no módulo
```typescript
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          port: configService.get('SMTP_PORT'),
          secure: configService.get('SMTP_SECURE'),
          auth: {
            user: configService.get('SMTP_USER'),
            pass: configService.get('SMTP_PASS'),
          },
        },
        defaults: {
          from: `"${configService.get('SMTP_FROM_NAME')}" <${configService.get('SMTP_FROM_EMAIL')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class EmailModule {}
```

## 🔄 Integração com Outros Módulos

### Dependências
- **Queue**: Envio assíncrono via filas
- **User**: Dados dos destinatários
- **Loan**: Informações de empréstimos
- **Notification**: Sistema de notificações integrado
- **Config**: Configurações SMTP

### Uso com Queue
```typescript
// Adicionar email à fila
await this.queueService.addEmailJob({
  type: 'loan-reminder',
  to: user.email,
  data: {
    userName: user.name,
    materialTitle: loan.material.title,
    dueDate: loan.dueDate,
    daysRemaining: calculateDaysRemaining(loan.dueDate)
  }
});
```

## 📊 Logging e Monitoramento

### Logs de Envio
```typescript
// Log de sucesso
this.logger.log(`Email enviado com sucesso: ${messageId} para ${to}`);

// Log de erro
this.logger.error(`Falha ao enviar email: ${error.message}`, error.stack);

// Log de retry
this.logger.warn(`Tentativa ${attempt} de reenvio para ${to}`);
```

### Métricas de Email
```typescript
interface EmailMetrics {
  sent: number;                 // Emails enviados
  delivered: number;            // Emails entregues
  opened: number;               // Emails abertos
  clicked: number;              // Links clicados
  bounced: number;              // Emails rejeitados
  failed: number;               // Falhas de envio
}
```

## 🧪 Tratamento de Erros

### Estratégias de Retry
```typescript
const retryConfig = {
  attempts: 3,                  // Máximo 3 tentativas
  delay: 2000,                  // Delay de 2 segundos
  backoff: 'exponential',       // Backoff exponencial
  removeOnComplete: 10,         // Manter 10 jobs completos
  removeOnFail: 5              // Manter 5 jobs falhados
};
```

### Tratamento de Bounces
```typescript
// Marcar email como inválido após bounce
async handleBounce(email: string, bounceType: string) {
  if (bounceType === 'permanent') {
    await this.userService.markEmailAsInvalid(email);
    this.logger.warn(`Email marcado como inválido: ${email}`);
  }
}
```

## 📝 Exemplos de Uso

### Envio de Boas-vindas
```typescript
await this.emailService.sendWelcomeEmail(
  'joao@universidade.edu.br',
  {
    name: 'João Silva',
    email: 'joao@universidade.edu.br',
    userType: 'Estudante',
    systemUrl: 'https://biblioteca.universidade.edu.br'
  }
);
```

### Lembrete de Empréstimo
```typescript
await this.emailService.sendLoanReminderEmail(
  'joao@universidade.edu.br',
  {
    userName: 'João Silva',
    materialTitle: 'Clean Code',
    dueDate: '2024-12-15',
    daysRemaining: 3
  }
);
```

### Email com Anexo
```typescript
await this.emailService.sendEmail({
  to: 'joao@universidade.edu.br',
  subject: 'Relatório Mensal',
  template: 'monthly-report',
  context: { month: 'Dezembro', year: 2024 },
  attachments: [{
    filename: 'relatorio-dezembro.pdf',
    content: pdfBuffer,
    contentType: 'application/pdf'
  }]
});
```

## 🚀 Melhorias Futuras

- [ ] Sistema de templates visuais com editor drag-and-drop
- [ ] Personalização avançada por tipo de usuário
- [ ] A/B testing para assuntos e conteúdos
- [ ] Integração com ferramentas de email marketing
- [ ] Analytics avançados de engajamento
- [ ] Sistema de opt-out granular por tipo de notificação
- [ ] Suporte a emails em formato AMP
