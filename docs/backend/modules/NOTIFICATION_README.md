# 🔔 Módulo Notification

Sistema completo de notificações push, SMS, in-app e email para a biblioteca universitária.

## 📋 Visão Geral

O módulo Notification é um sistema avançado de notificações que suporta múltiplos canais de comunicação, templates personalizáveis, preferências de usuário, agendamento e notificações em massa. É fundamental para manter os usuários informados sobre eventos da biblioteca.

## 🏗️ Estrutura do Módulo

```
src/modules/notification/
├── notification.service.ts                    # Serviço principal
├── notification.controller.ts                 # Controlador REST
├── notification.module.ts                     # Módulo NestJS
├── advanced-notification.service.ts           # Serviço avançado
├── notification-bulk.service.ts               # Notificações em massa
├── notification-bulk.controller.ts            # Controller para bulk
├── notification-preferences.service.ts        # Preferências do usuário
├── notification-preferences.controller.ts     # Controller de preferências
├── notification-scheduler.service.ts          # Agendamento de notificações
├── notification-template.service.ts           # Gerenciamento de templates
├── notification-template.controller.ts        # Controller de templates
└── push-notification.service.ts               # Notificações push
```

## 🎯 Funcionalidades

### ✅ Canais de Notificação
- **Push Notifications**: Notificações para dispositivos móveis
- **SMS**: Mensagens de texto via provedores como Twilio
- **Email**: Integração com o módulo de email
- **In-App**: Notificações dentro da aplicação
- **Web Push**: Notificações no navegador

### ✅ Tipos de Notificação
- **Lembretes de empréstimo**: Vencimento próximo
- **Avisos de atraso**: Materiais em atraso
- **Confirmações**: Empréstimos, devoluções, reservas
- **Disponibilidade**: Material reservado disponível
- **Multas**: Notificações de multas pendentes
- **Comunicados**: Avisos gerais da biblioteca
- **Manutenção**: Avisos de manutenção do sistema

### ✅ Recursos Avançados
- **Templates personalizáveis**: Sistema de templates flexível
- **Preferências do usuário**: Controle granular por tipo e canal
- **Agendamento**: Notificações programadas
- **Notificações em massa**: Envio para grupos de usuários
- **Tracking**: Rastreamento de entrega e visualização
- **Retry automático**: Reenvio em caso de falha

## 📊 Endpoints da API

### Notificações Básicas
```typescript
POST   /notifications                    # Criar notificação
GET    /notifications                    # Listar notificações
GET    /notifications/:id               # Buscar por ID
PATCH  /notifications/:id               # Atualizar notificação
DELETE /notifications/:id               # Deletar notificação

# Notificações do usuário
GET    /notifications/user/:userId      # Notificações do usuário
PATCH  /notifications/:id/read          # Marcar como lida
PATCH  /notifications/bulk/read         # Marcar múltiplas como lidas
```

### Templates
```typescript
POST   /notification-templates          # Criar template
GET    /notification-templates          # Listar templates
GET    /notification-templates/:id      # Buscar template
PATCH  /notification-templates/:id      # Atualizar template
DELETE /notification-templates/:id      # Deletar template
```

### Preferências
```typescript
GET    /notification-preferences/:userId    # Buscar preferências
PATCH  /notification-preferences/:userId    # Atualizar preferências
POST   /notification-preferences/bulk       # Atualização em massa
```

### Notificações em Massa
```typescript
POST   /notifications/bulk               # Enviar para múltiplos usuários
POST   /notifications/broadcast          # Broadcast para todos
GET    /notifications/bulk/:jobId        # Status do envio em massa
```

## 🔧 Interfaces e DTOs

### NotificationOptions
```typescript
interface NotificationOptions {
  userId: string | string[];              // Destinatário(s)
  title: string;                          // Título da notificação
  message: string;                        // Mensagem principal
  type: NotificationType;                 // Tipo da notificação
  channels: NotificationChannel[];       // Canais de envio
  priority: NotificationPriority;        // Prioridade (high, normal, low)
  scheduledFor?: Date;                    // Agendamento
  data?: Record<string, any>;            // Dados adicionais
  template?: string;                      // Template a usar
  context?: Record<string, any>;         // Dados para o template
}
```

### NotificationPreferences
```typescript
interface NotificationPreferences {
  userId: string;
  emailEnabled: boolean;                  // Notificações por email
  smsEnabled: boolean;                    // Notificações por SMS
  pushEnabled: boolean;                   // Push notifications
  inAppEnabled: boolean;                  // Notificações in-app
  types: {                               // Preferências por tipo
    [NotificationType.LOAN_REMINDER]: boolean;
    [NotificationType.OVERDUE_NOTICE]: boolean;
    [NotificationType.RESERVATION_READY]: boolean;
    [NotificationType.FINE_NOTICE]: boolean;
    // ... outros tipos
  };
  quietHours?: {                         // Horário de silêncio
    start: string;                       // "22:00"
    end: string;                         // "08:00"
  };
}
```

## 📧 Templates de Notificação

### Template de Lembrete
```typescript
const loanReminderTemplate = {
  name: 'loan-reminder',
  title: 'Lembrete de Devolução',
  message: 'O material "{{materialTitle}}" deve ser devolvido em {{daysRemaining}} dias.',
  channels: ['email', 'push', 'inApp'],
  variables: ['materialTitle', 'daysRemaining', 'dueDate']
};
```

### Template de Material Disponível
```typescript
const materialAvailableTemplate = {
  name: 'material-available',
  title: 'Material Disponível',
  message: 'O material "{{materialTitle}}" que você reservou está disponível para retirada.',
  channels: ['email', 'sms', 'push'],
  variables: ['materialTitle', 'reservationDate', 'expiryDate']
};
```

## 🔐 Segurança e Autorização

### Permissões por Endpoint
- **Criar notificação**: Admin, Sistema
- **Listar notificações**: Próprio usuário ou Admin
- **Gerenciar templates**: Admin, Bibliotecário
- **Preferências**: Próprio usuário
- **Notificações em massa**: Admin

## 📈 Enums Relacionados

### NotificationType
```typescript
enum NotificationType {
  LOAN_REMINDER = 'loan_reminder',
  OVERDUE_NOTICE = 'overdue_notice',
  RESERVATION_READY = 'reservation_ready',
  RESERVATION_EXPIRED = 'reservation_expired',
  FINE_NOTICE = 'fine_notice',
  WELCOME = 'welcome',
  SYSTEM_MAINTENANCE = 'system_maintenance',
  GENERAL_ANNOUNCEMENT = 'general_announcement'
}
```

### NotificationChannel
```typescript
enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
  WEB_PUSH = 'web_push'
}
```

### NotificationPriority
```typescript
enum NotificationPriority {
  HIGH = 'high',      // Urgente, ignora horário de silêncio
  NORMAL = 'normal',  // Normal, respeita preferências
  LOW = 'low'         // Baixa prioridade, pode ser agrupada
}
```

## 🔄 Integração com Outros Módulos

### Dependências
- **Email**: Envio de notificações por email
- **User**: Dados e preferências dos usuários
- **Queue**: Processamento assíncrono
- **Loan**: Eventos de empréstimos
- **Reservation**: Eventos de reservas

### Eventos do Sistema
```typescript
// Listener para eventos de empréstimo
@EventPattern('loan.due.soon')
async handleLoanDueSoon(data: { loanId: string }) {
  const loan = await this.loanService.findOne(data.loanId);
  await this.notificationService.sendNotification({
    userId: loan.userId,
    type: NotificationType.LOAN_REMINDER,
    template: 'loan-reminder',
    context: {
      materialTitle: loan.material.title,
      dueDate: loan.dueDate,
      daysRemaining: calculateDaysRemaining(loan.dueDate)
    }
  });
}
```

## 📊 Sistema de Agendamento

### Agendamento de Notificações
```typescript
interface ScheduledNotification {
  id: string;
  userId: string;
  scheduledFor: Date;
  notification: NotificationOptions;
  status: 'pending' | 'sent' | 'failed';
  attempts: number;
  lastAttempt?: Date;
  error?: string;
}
```

### Agendamento Recorrente
```typescript
interface RecurringNotification {
  id: string;
  name: string;
  cron: string;                    // Expressão cron
  template: string;
  target: 'all' | 'group' | 'query';
  targetQuery?: string;            // Query para seleção dinâmica
  active: boolean;
  lastRun?: Date;
  nextRun: Date;
}
```

## 🧪 Funcionalidades Especiais

### Notificações Inteligentes
```typescript
interface SmartNotificationConfig {
  consolidation: boolean;          // Agrupar notificações similares
  frequency: 'immediate' | 'daily' | 'weekly';
  digestTime: string;              // Horário para envio de digest
  maxPerDay: number;               // Limite diário por usuário
}
```

### Analytics de Notificação
```typescript
interface NotificationAnalytics {
  sent: number;                    // Total enviadas
  delivered: number;               // Total entregues
  opened: number;                  // Total abertas
  clicked: number;                 // Total com cliques
  failed: number;                  // Total falhadas
  optOuts: number;                 // Total de descadastros
  byChannel: Record<NotificationChannel, number>;
  byType: Record<NotificationType, number>;
}
```

## 📝 Exemplos de Uso

### Envio Simples
```typescript
await this.notificationService.sendNotification({
  userId: 'user123',
  title: 'Material Disponível',
  message: 'O livro Clean Code está disponível para retirada.',
  type: NotificationType.RESERVATION_READY,
  channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH]
});
```

### Notificação Agendada
```typescript
await this.notificationService.scheduleNotification({
  userId: 'user123',
  title: 'Lembrete de Devolução',
  message: 'Não esqueça de devolver o livro amanhã!',
  type: NotificationType.LOAN_REMINDER,
  scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
  channels: [NotificationChannel.PUSH]
});
```

### Notificação em Massa
```typescript
await this.notificationBulkService.sendBulkNotification({
  target: 'query',
  targetQuery: 'SELECT id FROM users WHERE user_type = "STUDENT"',
  notification: {
    title: 'Manutenção do Sistema',
    message: 'O sistema ficará em manutenção das 02:00 às 04:00.',
    type: NotificationType.SYSTEM_MAINTENANCE,
    channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP]
  }
});
```

## 🚀 Melhorias Futuras

- [ ] Machine Learning para otimização de horários de envio
- [ ] Integração com redes sociais (WhatsApp Business, Telegram)
- [ ] Sistema de badges e gamificação
- [ ] Notificações de localização (geofencing)
- [ ] Integração com assistentes virtuais (Alexa, Google Assistant)
- [ ] Sistema de feedback de notificações
- [ ] A/B testing para otimização de conteúdo
