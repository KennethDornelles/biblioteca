# 🚀 Módulo Queue

Sistema completo de filas assíncronas para processamento de tarefas em background.

## 📋 Visão Geral

O módulo Queue é responsável pelo gerenciamento de filas assíncronas usando Bull Queue com Redis. Processa tarefas em background como envio de emails, geração de relatórios, notificações e manutenção do sistema, garantindo performance e escalabilidade.

## 🏗️ Estrutura do Módulo

```
src/modules/queue/
├── processors/
│   ├── email.processor.ts              # Processador de emails
│   ├── notification.processor.ts       # Processador de notificações
│   ├── report.processor.ts             # Processador de relatórios
│   └── maintenance.processor.ts        # Processador de manutenção
├── queue.service.ts                    # Serviço principal de filas
├── queue.controller.ts                 # Controlador REST
├── queue-integration.service.ts        # Integração com outros módulos
├── queue.module.ts                     # Módulo NestJS
└── index.ts                           # Exportações do módulo
```

## 🎯 Funcionalidades

### ✅ Filas Especializadas
- **Email Queue**: Processamento de emails transacionais
- **Notification Queue**: Envio de notificações push, SMS e in-app
- **Report Queue**: Geração assíncrona de relatórios
- **Maintenance Queue**: Tarefas de manutenção e limpeza

### ✅ Recursos Avançados
- **Retry automático**: Reprocessamento em caso de falha
- **Priorização**: Jobs com diferentes níveis de prioridade
- **Agendamento**: Execução de jobs em horários específicos
- **Rate limiting**: Controle de taxa de processamento
- **Monitoramento**: Dashboard em tempo real

### ✅ Configurações Flexíveis
- **Backoff exponencial**: Intervalos crescentes entre tentativas
- **Dead letter queue**: Jobs que falharam definitivamente
- **Concorrência**: Processamento paralelo configurável
- **Persistência**: Jobs persistem mesmo com restart

## 📊 Endpoints da API

### Gerenciamento de Filas
```typescript
GET    /queues                          # Listar todas as filas
GET    /queues/:name                    # Detalhes de uma fila
POST   /queues/:name/jobs               # Adicionar job à fila
GET    /queues/:name/jobs               # Listar jobs da fila
GET    /queues/:name/jobs/:id           # Detalhes de um job
DELETE /queues/:name/jobs/:id           # Remover job
POST   /queues/:name/pause              # Pausar fila
POST   /queues/:name/resume             # Retomar fila
POST   /queues/:name/clean              # Limpar fila
```

### Monitoramento
```typescript
GET    /queues/stats                    # Estatísticas globais
GET    /queues/:name/stats              # Estatísticas da fila
GET    /queues/:name/failed             # Jobs falhados
GET    /queues/:name/completed          # Jobs completados
GET    /queues/:name/active             # Jobs ativos
GET    /queues/:name/waiting            # Jobs aguardando
```

## 🔧 Configuração das Filas

### Configuração Principal
```typescript
// queue.module.ts
BullModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    redis: {
      host: configService.get('REDIS_HOST'),
      port: configService.get('REDIS_PORT'),
      password: configService.get('REDIS_PASSWORD'),
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
    },
    defaultJobOptions: {
      removeOnComplete: 10,    // Manter 10 jobs completos
      removeOnFail: 5,         // Manter 5 jobs falhados
      attempts: 3,             // Máximo 3 tentativas
      backoff: {
        type: 'exponential',
        delay: 2000,           // Delay inicial de 2 segundos
      },
    },
  }),
  inject: [ConfigService],
})
```

### Configuração por Fila
```typescript
// Fila de Email
BullModule.registerQueue({
  name: 'email',
  defaultJobOptions: {
    attempts: 5,
    backoff: 'exponential',
    delay: 1000,
  },
  processors: [
    {
      name: 'welcome-email',
      concurrency: 3,
    },
    {
      name: 'notification-email',
      concurrency: 5,
    },
  ],
})

// Fila de Relatórios
BullModule.registerQueue({
  name: 'report',
  defaultJobOptions: {
    attempts: 2,
    timeout: 300000,  // 5 minutos
  },
  processors: [
    {
      name: 'generate-report',
      concurrency: 1,  // Relatórios pesados, um por vez
    },
  ],
})
```

## 🔄 Processadores de Jobs

### Email Processor
```typescript
@Processor('email')
export class EmailProcessor {
  @Process('welcome-email')
  async processWelcomeEmail(job: Job<WelcomeEmailData>) {
    const { userEmail, userData } = job.data;
    
    try {
      await this.emailService.sendWelcomeEmail(userEmail, userData);
      return { success: true, sentAt: new Date() };
    } catch (error) {
      throw new Error(`Failed to send welcome email: ${error.message}`);
    }
  }

  @Process('loan-reminder')
  async processLoanReminder(job: Job<LoanReminderData>) {
    const { userEmail, loanData } = job.data;
    
    await this.emailService.sendLoanReminderEmail(userEmail, loanData);
    return { success: true };
  }
}
```

### Notification Processor
```typescript
@Processor('notification')
export class NotificationProcessor {
  @Process('push-notification')
  async processPushNotification(job: Job<PushNotificationData>) {
    const { userId, title, message, data } = job.data;
    
    await this.pushNotificationService.send(userId, {
      title,
      message,
      data,
    });
    
    return { success: true, deliveredAt: new Date() };
  }

  @Process('sms-notification')
  async processSmsNotification(job: Job<SmsNotificationData>) {
    const { phoneNumber, message } = job.data;
    
    await this.smsService.sendSms(phoneNumber, message);
    return { success: true };
  }
}
```

### Report Processor
```typescript
@Processor('report')
export class ReportProcessor {
  @Process('generate-report')
  async processReportGeneration(job: Job<ReportGenerationData>) {
    const { reportType, parameters, userId } = job.data;
    
    // Atualizar progresso
    job.progress(10);
    
    const reportResult = await this.reportService.generateReport(
      reportType,
      parameters
    );
    
    job.progress(50);
    
    // Enviar por email se solicitado
    if (parameters.emailOnComplete) {
      await this.queueService.addEmailJob({
        type: 'report-ready',
        userEmail: parameters.userEmail,
        data: { reportUrl: reportResult.url }
      });
    }
    
    job.progress(100);
    return reportResult;
  }
}
```

## 🎯 Tipos de Jobs

### Jobs de Email
```typescript
interface WelcomeEmailData {
  userEmail: string;
  userData: {
    name: string;
    userType: string;
    systemUrl: string;
  };
}

interface LoanReminderData {
  userEmail: string;
  loanData: {
    materialTitle: string;
    dueDate: string;
    daysRemaining: number;
  };
}
```

### Jobs de Notificação
```typescript
interface PushNotificationData {
  userId: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  scheduled?: Date;
}

interface BulkNotificationData {
  userIds: string[];
  notification: NotificationContent;
  batchSize: number;
}
```

### Jobs de Relatório
```typescript
interface ReportGenerationData {
  reportType: string;
  parameters: Record<string, any>;
  userId: string;
  format: 'pdf' | 'excel' | 'csv';
  emailOnComplete?: boolean;
  userEmail?: string;
}
```

## 📊 Monitoramento e Métricas

### Dashboard de Filas
```typescript
interface QueueStats {
  name: string;
  waiting: number;      // Jobs aguardando
  active: number;       // Jobs em processamento
  completed: number;    // Jobs completados
  failed: number;       // Jobs falhados
  delayed: number;      // Jobs agendados
  paused: boolean;      // Fila pausada?
  
  // Métricas de performance
  avgProcessingTime: number;
  throughput: number;   // Jobs por minuto
  errorRate: number;    // Taxa de erro
  
  // Workers
  workers: number;      // Workers ativos
  concurrency: number;  // Concorrência máxima
}
```

### Alertas e Monitoramento
```typescript
interface QueueAlert {
  type: 'high_failure_rate' | 'queue_stalled' | 'memory_usage';
  queue: string;
  severity: 'warning' | 'critical';
  message: string;
  triggeredAt: Date;
  threshold: number;
  currentValue: number;
}

// Configuração de alertas
const ALERT_CONFIG = {
  failureRate: {
    warning: 5,    // 5% de taxa de erro
    critical: 15,  // 15% de taxa de erro
  },
  queueSize: {
    warning: 1000,  // 1000 jobs aguardando
    critical: 5000, // 5000 jobs aguardando
  },
  processingTime: {
    warning: 30000,  // 30 segundos
    critical: 120000, // 2 minutos
  },
};
```

## 🔐 Segurança e Controle de Acesso

### Permissões por Endpoint
- **Visualizar filas**: Bibliotecários e Administradores
- **Gerenciar filas**: Apenas Administradores
- **Adicionar jobs**: Módulos do sistema
- **Pausar/Retomar**: Apenas Administradores

### Auditoria
```typescript
interface QueueAuditLog {
  action: 'job_added' | 'job_completed' | 'job_failed' | 'queue_paused';
  queue: string;
  jobId?: string;
  userId?: string;
  timestamp: Date;
  details: Record<string, any>;
}
```

## 🔄 Integração com Outros Módulos

### Queue Integration Service
```typescript
@Injectable()
export class QueueIntegrationService {
  // Adicionar job de email
  async addEmailJob(emailData: EmailJobData, options?: JobOptions) {
    return this.emailQueue.add('send-email', emailData, {
      priority: options?.priority || 'normal',
      delay: options?.delay,
      attempts: 3,
    });
  }

  // Adicionar job de notificação
  async addNotificationJob(notificationData: NotificationJobData) {
    return this.notificationQueue.add('send-notification', notificationData);
  }

  // Agendar job de manutenção
  async scheduleMaintenanceJob(maintenanceData: MaintenanceJobData, cronExpression: string) {
    return this.maintenanceQueue.add('maintenance-task', maintenanceData, {
      repeat: { cron: cronExpression },
    });
  }
}
```

## 🧪 Funcionalidades Especiais

### Dead Letter Queue
```typescript
// Configuração para jobs que falharam definitivamente
const deadLetterConfig = {
  name: 'dead-letter',
  processor: async (job: Job) => {
    // Log detalhado do job que falhou
    this.logger.error(`Job failed permanently: ${job.id}`, {
      queue: job.queue.name,
      data: job.data,
      attempts: job.attemptsMade,
      errors: job.failedReason,
    });
    
    // Notificar administradores
    await this.notificationService.sendAdminAlert({
      type: 'job_failed_permanently',
      jobId: job.id,
      details: job.data,
    });
  },
};
```

### Rate Limiting
```typescript
// Limitar taxa de processamento
const rateLimitConfig = {
  max: 100,        // Máximo 100 jobs
  duration: 60000, // Em 1 minuto
  bounceBack: false, // Não rejeitar, apenas atrasar
};
```

### Job Patterns
```typescript
// Pattern para jobs recorrentes
async addRecurringJob(jobName: string, data: any, cronExpression: string) {
  return this.queue.add(jobName, data, {
    repeat: {
      cron: cronExpression,
      tz: 'America/Sao_Paulo',
    },
    removeOnComplete: 1,
    removeOnFail: 1,
  });
}

// Pattern para jobs em lote
async addBatchJobs(jobs: Array<{ name: string; data: any; options?: JobOptions }>) {
  const jobsToAdd = jobs.map(({ name, data, options }) => ({
    name,
    data,
    opts: {
      ...this.defaultJobOptions,
      ...options,
    },
  }));
  
  return this.queue.addBulk(jobsToAdd);
}
```

## 📝 Exemplos de Uso

### Adicionar Job de Email
```typescript
await this.queueIntegrationService.addEmailJob({
  type: 'welcome-email',
  userEmail: 'joao@universidade.edu.br',
  userData: {
    name: 'João Silva',
    userType: 'Estudante',
    systemUrl: 'https://biblioteca.universidade.edu.br'
  }
}, {
  priority: 'high',
  delay: 5000  // Enviar em 5 segundos
});
```

### Gerar Relatório Assíncrono
```typescript
await this.queueIntegrationService.addReportJob({
  reportType: 'monthly-loans',
  parameters: {
    year: 2024,
    month: 12,
    format: 'pdf',
    emailOnComplete: true,
    userEmail: 'bibliotecario@universidade.edu.br'
  }
});
```

### Agendar Manutenção
```typescript
await this.queueIntegrationService.scheduleMaintenanceJob({
  type: 'database-cleanup',
  parameters: {
    olderThan: '30 days',
    tables: ['logs', 'sessions']
  }
}, '0 2 * * 0'); // Todo domingo às 2:00
```

## 🚀 Melhorias Futuras

- [ ] Interface web para monitoramento visual das filas
- [ ] Machine Learning para otimização automática de recursos
- [ ] Integração com Kubernetes para auto-scaling
- [ ] Sistema de circuit breaker para proteção contra falhas
- [ ] Métricas avançadas com Prometheus/Grafana
- [ ] Distribuição de carga entre múltiplos workers
- [ ] Sistema de replay para reprocessamento de jobs
