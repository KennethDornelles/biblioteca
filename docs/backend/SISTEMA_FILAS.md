# 🚀 Sistema de Filas com Bull Queue - Biblioteca Universitária

## 📋 Visão Geral

Este módulo implementa um sistema completo de filas assíncronas usando **Bull Queue** e **Redis** para gerenciar tarefas em background no sistema da Biblioteca Universitária. O sistema oferece processamento confiável, retry automático, priorização de jobs e monitoramento em tempo real.

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Endpoints │    │   Queue Service │    │   Redis Store   │
│                 │    │                 │    │                 │
│  - POST /queue │───▶│  - Job Creation │───▶│  - Job Storage  │
│  - GET /stats  │    │  - Job Status   │    │  - Job Queue    │
│  - GET /health │    │  - Queue Mgmt   │    │  - Job History  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Processors    │
                       │                 │
                       │  - Email       │
                       │  - Notification │
                       │  - Report      │
                       │  - Maintenance │
                       └─────────────────┘
```

## 🔧 Componentes Principais

### 1. **QueueModule** (`src/modules/queue/queue.module.ts`)
- Configuração principal do Bull Queue
- Registro das filas: email, notification, report, maintenance
- Configuração de Redis e opções padrão dos jobs

### 2. **QueueService** (`src/modules/queue/queue.service.ts`)
- Serviço principal para gerenciar todas as operações de fila
- Métodos para adicionar jobs, verificar status e gerenciar filas
- Operações de limpeza, pausa e retomada

### 3. **QueueController** (`src/modules/queue/queue.controller.ts`)
- Endpoints REST para gerenciar filas
- Autenticação e autorização baseada em roles
- Documentação Swagger completa

### 4. **Processors** (Diretório `src/modules/queue/processors/`)
- **EmailProcessor**: Processa jobs de envio de emails
- **NotificationProcessor**: Processa notificações push, SMS e in-app
- **ReportProcessor**: Gera relatórios em diferentes formatos
- **MaintenanceProcessor**: Executa tarefas de manutenção do sistema

### 5. **QueueIntegrationService** (`src/modules/queue/queue-integration.service.ts`)
- Serviço de integração que demonstra uso prático das filas
- Métodos para agendar notificações automáticas
- Integração com diferentes módulos do sistema

## 📊 Tipos de Fila

### 🧭 **Email Queue** (Prioridade: HIGH)
- **Função**: Envio assíncrono de emails
- **Casos de Uso**: 
  - Lembretes de devolução
  - Notificações de atraso
  - Emails de boas-vindas
  - Redefinição de senha
- **Configuração**: Retry automático, 3 tentativas

### 🔔 **Notification Queue** (Prioridade: NORMAL)
- **Função**: Envio de notificações em diferentes canais
- **Tipos**:
  - Push notifications (FCM, OneSignal)
  - SMS (Twilio, AWS SNS)
  - Notificações in-app
  - Webhooks
- **Configuração**: Expiração configurável, dados customizados

### 📈 **Report Queue** (Prioridade: LOW)
- **Função**: Geração assíncrona de relatórios
- **Formatos**: PDF, Excel, CSV, JSON
- **Tipos**:
  - Relatórios diários de empréstimos
  - Estatísticas mensais
  - Relatórios de atraso
  - Relatórios financeiros
- **Configuração**: Inclusão de gráficos, filtros customizados

### 🛠️ **Maintenance Queue** (Prioridade: LOW)
- **Função**: Execução de tarefas de manutenção
- **Tipos**:
  - Limpeza de banco de dados
  - Rotação de logs
  - Limpeza de cache
  - Criação de backups
  - Verificação de saúde do sistema
- **Configuração**: Execução em horários específicos, rollback automático

## 🚀 Como Usar

### 1. **Adicionando Jobs à Fila**

```typescript
// Email de lembrete
const emailJob = await this.queueService.addEmailJob({
  type: EmailType.LOAN_REMINDER,
  to: 'usuario@email.com',
  subject: 'Lembrete de Devolução',
  template: 'loan-reminder',
  context: {
    userName: 'João Silva',
    materialTitle: 'Introdução à Programação',
    dueDate: '2024-01-15',
    renewalUrl: 'https://app.biblioteca.edu.br/renew/123'
  }
}, {
  priority: JobPriority.HIGH,
  delay: 0
});

// Notificação push
const notificationJob = await this.queueService.addNotificationJob({
  type: NotificationType.PUSH,
  userId: 'user-123',
  title: 'Material Disponível',
  message: 'Seu material reservado está disponível para retirada',
  data: { materialId: 'mat-456' }
});
```

### 2. **Verificando Status de Jobs**

```typescript
const status = await this.queueService.getEmailJobStatus('job-123');
console.log(`Status do job: ${status}`); // waiting, processing, completed, failed
```

### 3. **Monitorando Filas**

```typescript
const stats = await this.queueService.getQueueStats();
console.log('Estatísticas das filas:', stats);

// Resultado:
{
  email: { waiting: 5, active: 2, completed: 150, failed: 3 },
  notification: { waiting: 12, active: 1, completed: 89, failed: 1 },
  report: { waiting: 0, active: 0, completed: 25, failed: 0 },
  maintenance: { waiting: 0, active: 0, completed: 8, failed: 0 }
}
```

### 4. **Gerenciando Filas**

```typescript
// Pausar todas as filas
await this.queueService.pauseAllQueues();

// Retomar todas as filas
await this.queueService.resumeAllQueues();

// Limpar jobs completados
await this.queueService.clearCompletedJobs();
```

## 🔌 Integração com Outros Módulos

### **Sistema de Empréstimos**
```typescript
// Agendar lembretes de devolução
await this.queueIntegrationService.scheduleLoanReminderEmails([
  {
    userId: 'user-123',
    userEmail: 'usuario@email.com',
    userName: 'João Silva',
    materialTitle: 'Livro de Matemática',
    dueDate: new Date('2024-01-20'),
    renewalUrl: 'https://app.biblioteca.edu.br/renew/456'
  }
]);
```

### **Sistema de Reservas**
```typescript
// Notificar quando reserva estiver disponível
await this.queueIntegrationService.scheduleReservationAvailableNotifications([
  {
    userId: 'user-456',
    userEmail: 'maria@email.com',
    userName: 'Maria Santos',
    materialTitle: 'Revista Científica',
    pickupDeadline: new Date('2024-01-25'),
    pickupLocation: 'Sala de Leitura - 2º Andar'
  }
]);
```

### **Sistema de Relatórios**
```typescript
// Agendar relatórios diários
await this.queueIntegrationService.scheduleDailyReports();

// Agendar relatórios mensais
await this.queueIntegrationService.scheduleMonthlyReports(2024, 1);
```

## 📋 Endpoints da API

### **Gerenciamento de Filas**
- `POST /queue/email` - Adicionar job de email
- `POST /queue/notification` - Adicionar job de notificação
- `POST /queue/report` - Adicionar job de relatório
- `POST /queue/maintenance` - Adicionar job de manutenção

### **Monitoramento**
- `GET /queue/stats` - Estatísticas de todas as filas
- `GET /queue/health` - Status de saúde das filas
- `GET /queue/email/:jobId/status` - Status de job específico

### **Controle**
- `POST /queue/pause-all` - Pausar todas as filas
- `POST /queue/resume-all` - Retomar todas as filas
- `DELETE /queue/clear-completed` - Limpar jobs completados

## ⚙️ Configuração

### **Variáveis de Ambiente**
```bash
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_KEY_PREFIX=biblioteca:

# Email (para processador de emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app
SMTP_FROM=noreply@biblioteca.edu.br
SMTP_FROM_NAME="Biblioteca Universitária"
```

### **Configuração do Bull Queue**
```typescript
defaultJobOptions: {
  removeOnComplete: 100,    // Manter últimos 100 jobs completados
  removeOnFail: 50,         // Manter últimos 50 jobs falhados
  attempts: 3,              // Tentar 3 vezes em caso de falha
  backoff: {
    type: 'exponential',    // Backoff exponencial
    delay: 2000,            // 2 segundos inicial
  },
}
```

## 📊 Monitoramento e Métricas

### **Métricas Disponíveis**
- **Jobs por Status**: waiting, active, completed, failed, delayed, paused
- **Taxa de Erro**: Percentual de jobs que falharam
- **Tempo de Processamento**: Média de tempo para completar jobs
- **Throughput**: Jobs processados por minuto

### **Alertas Automáticos**
- **Crítico**: Taxa de erro > 10%
- **Aviso**: Taxa de erro > 5%
- **Saudável**: Taxa de erro ≤ 5%

## 🚨 Tratamento de Erros

### **Retry Automático**
- Jobs falhados são automaticamente reexecutados
- Backoff exponencial para evitar sobrecarga
- Máximo de 3 tentativas por job

### **Dead Letter Queue**
- Jobs que falharam após todas as tentativas são movidos para DLQ
- Logs detalhados de erros para debugging
- Notificações para administradores

### **Fallback Strategies**
- Emails: Fallback para notificação in-app
- Notificações push: Fallback para SMS
- Relatórios: Fallback para formato JSON se PDF falhar

## 🔒 Segurança

### **Autenticação**
- Todos os endpoints requerem JWT válido
- Verificação de roles para operações sensíveis

### **Autorização por Role**
- **LIBRARIAN**: Pode gerenciar filas de email, notificação e relatórios
- **ADMIN**: Acesso completo a todas as filas e operações de manutenção

### **Validação de Dados**
- Validação de entrada em todos os endpoints
- Sanitização de dados antes do processamento
- Rate limiting para prevenir abuso

## 🧪 Testes

### **Testes Unitários**
```bash
npm run test src/modules/queue
```

### **Testes de Integração**
```bash
npm run test:e2e -- --testPathPattern=queue
```

### **Testes de Carga**
```bash
npm run test:load
```

## 📈 Performance e Escalabilidade

### **Otimizações Implementadas**
- **Concorrência**: Múltiplos workers por fila
- **Priorização**: Jobs críticos são processados primeiro
- **Batching**: Processamento em lote para operações similares
- **Caching**: Cache Redis para dados frequentemente acessados

### **Escalabilidade Horizontal**
- Múltiplas instâncias da aplicação podem processar a mesma fila
- Redis cluster para alta disponibilidade
- Load balancing automático de jobs

## 🔮 Roadmap e Melhorias Futuras

### **Próximas Versões**
- [ ] Dashboard web para monitoramento em tempo real
- [ ] Integração com sistemas de alerta (PagerDuty, Slack)
- [ ] Métricas avançadas (Prometheus, Grafana)
- [ ] Agendamento de jobs recorrentes (cron jobs)
- [ ] Compressão de dados para jobs grandes
- [ ] Distribuição geográfica de filas

### **Melhorias de Performance**
- [ ] Processamento paralelo de jobs independentes
- [ ] Cache inteligente para templates de email
- [ ] Otimização de consultas de banco de dados
- [ ] Compressão de arquivos de relatório

## 📚 Recursos Adicionais

### **Documentação Oficial**
- [Bull Queue Documentation](https://github.com/OptimalBits/bull)
- [NestJS Bull Module](https://docs.nestjs.com/techniques/queues)
- [Redis Documentation](https://redis.io/documentation)

### **Exemplos de Código**
- [Exemplos de Bull Queue](https://github.com/OptimalBits/bull/tree/master/examples)
- [NestJS Queue Examples](https://github.com/nestjs/nest/tree/master/sample/30-queue)

### **Comunidade**
- [Bull Queue Issues](https://github.com/OptimalBits/bull/issues)
- [NestJS Discord](https://discord.gg/nestjs)

---

## 🤝 Contribuição

Para contribuir com este módulo:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](../../../LICENSE) para detalhes.

---

**Desenvolvido com ❤️ pela Equipe da Biblioteca Universitária**
