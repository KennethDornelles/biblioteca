# Sistema de Notificações Avançadas

## Visão Geral

O sistema de notificações avançadas da biblioteca universitária oferece uma solução completa e robusta para comunicação com usuários através de múltiplos canais, com recursos de personalização, agendamento, analytics e muito mais.

## Arquitetura

### Componentes Principais

1. **AdvancedNotificationService** - Serviço principal de notificações
2. **NotificationTemplateService** - Gerenciamento de templates
3. **NotificationPreferencesService** - Preferências do usuário
4. **NotificationSchedulerService** - Agendamento e recorrência
5. **NotificationBulkService** - Notificações em lote
6. **PushNotificationService** - Notificações push via Firebase
7. **NotificationEventListener** - Processamento de eventos

### Modelos de Dados

#### Notification
```typescript
{
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  status: NotificationStatus;
  channel: NotificationChannel;
  templateId?: string;
  data?: Record<string, any>;
  scheduledFor?: Date;
  sentAt?: Date;
  readAt?: Date;
  expiresAt?: Date;
  retryCount: number;
  maxRetries: number;
  errorMessage?: string;
  deliveryStatus: DeliveryStatus;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

#### NotificationTemplate
```typescript
{
  id: string;
  name: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  channel: NotificationChannel;
  variables: string[];
  isActive: boolean;
  isSystem: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

#### UserNotificationPreferences
```typescript
{
  id: string;
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  webhookEnabled: boolean;
  webhookUrl?: string;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  timezone: string;
  language: string;
  categories: Record<string, boolean>;
  channels: Record<string, boolean>;
  frequency: NotificationFrequency;
  digestEnabled: boolean;
  digestFrequency: DigestFrequency;
  digestTime: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Recursos Implementados

### 1. Sistema de Templates Personalizáveis

- **Templates do Sistema**: Templates pré-definidos para eventos comuns
- **Templates Personalizados**: Criação de templates customizados
- **Variáveis Dinâmicas**: Sistema de placeholders `{{variable}}`
- **Validação**: Validação automática de variáveis e templates
- **Duplicação**: Capacidade de duplicar templates existentes

#### Exemplo de Template
```typescript
{
  name: 'loan_reminder',
  title: 'Lembrete de Devolução',
  message: 'Olá {{userName}}, seu empréstimo do material "{{materialTitle}}" vence em {{daysUntilDue}} dias.',
  variables: ['userName', 'materialTitle', 'daysUntilDue']
}
```

### 2. Preferências de Usuário

- **Canais**: Controle granular por canal (email, SMS, push, in-app, webhook)
- **Categorias**: Preferências por categoria de notificação
- **Horário de Silêncio**: Configuração de horários para não receber notificações
- **Timezone**: Suporte a diferentes fusos horários
- **Idioma**: Suporte a múltiplos idiomas
- **Digest**: Configuração de resumos periódicos
- **Frequência**: Controle de frequência de notificações

### 3. Notificações Agendadas e Recorrentes

- **Agendamento Simples**: Notificações para data/hora específica
- **Recorrência**: Suporte a recorrência diária, semanal, mensal e anual
- **Retry Automático**: Sistema de retry com backoff exponencial
- **Processamento em Lote**: Processamento eficiente de notificações agendadas
- **Cleanup Automático**: Limpeza automática de notificações expiradas

### 4. Notificações em Lote

- **Envio em Massa**: Envio para milhares de usuários simultaneamente
- **Seleção por Critérios**: Seleção de usuários por tipo, departamento, etc.
- **Processamento em Lotes**: Processamento em lotes para evitar sobrecarga
- **Relatórios Detalhados**: Relatórios de sucesso/falha por usuário
- **Agendamento em Lote**: Capacidade de agendar notificações em lote

### 5. Notificações Push (Firebase Cloud Messaging)

- **Multiplataforma**: Suporte a iOS, Android e Web
- **Gerenciamento de Tokens**: Registro e gerenciamento de tokens de dispositivo
- **Tópicos**: Sistema de inscrição em tópicos
- **Personalização**: Suporte a ícones, sons, vibração e ações
- **Cleanup Automático**: Remoção automática de tokens inativos

### 6. Analytics e Métricas

- **Métricas de Entrega**: Taxa de entrega, abertura e cliques
- **Métricas por Canal**: Estatísticas detalhadas por canal
- **Métricas por Categoria**: Análise de performance por categoria
- **Engajamento do Usuário**: Métricas de engajamento individual
- **Relatórios de Campanha**: Estatísticas completas de campanhas

### 7. Sistema de Eventos

- **Eventos Automáticos**: Notificações automáticas baseadas em eventos do sistema
- **Integração com Filas**: Processamento assíncrono via Bull Queue
- **Retry Inteligente**: Sistema de retry com backoff exponencial
- **Logging Completo**: Logs detalhados de todos os eventos

## APIs Disponíveis

### Notificações

#### POST /notifications
Criar nova notificação
```typescript
{
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  priority?: NotificationPriority;
  channel: NotificationChannel;
  templateId?: string;
  data?: Record<string, any>;
  scheduledFor?: Date;
  expiresAt?: Date;
  maxRetries?: number;
  metadata?: Record<string, any>;
}
```

#### GET /notifications
Listar notificações com filtros
```typescript
{
  userId?: string;
  type?: NotificationType;
  category?: NotificationCategory;
  priority?: NotificationPriority;
  status?: NotificationStatus;
  channel?: NotificationChannel;
  isRead?: boolean;
  limit?: number;
  offset?: number;
}
```

#### PUT /notifications/:id
Atualizar notificação

#### DELETE /notifications/:id
Cancelar notificação

#### POST /notifications/:id/read
Marcar como lida

#### POST /notifications/:id/track
Rastrear evento de notificação

### Templates

#### POST /notification-templates
Criar template

#### GET /notification-templates
Listar templates

#### GET /notification-templates/:id
Obter template por ID

#### PUT /notification-templates/:id
Atualizar template

#### DELETE /notification-templates/:id
Excluir template

#### POST /notification-templates/:id/duplicate
Duplicar template

#### POST /notification-templates/:id/process
Processar template com variáveis

### Preferências

#### GET /notification-preferences/:userId
Obter preferências do usuário

#### PUT /notification-preferences/:userId
Atualizar preferências

#### POST /notification-preferences/:userId/channels/:channel/enable
Habilitar canal

#### POST /notification-preferences/:userId/channels/:channel/disable
Desabilitar canal

#### POST /notification-preferences/:userId/quiet-hours
Definir horário de silêncio

#### POST /notification-preferences/:userId/digest/enable
Habilitar digest

### Notificações em Lote

#### POST /notification-bulk/send
Enviar notificações em lote

#### POST /notification-bulk/schedule
Agendar notificações em lote

#### POST /notification-bulk/send-to-group
Enviar para grupo de usuários

#### POST /notification-bulk/send-to-all
Enviar para todos os usuários

#### POST /notification-bulk/send-to-users-with-loans
Enviar para usuários com empréstimos

#### POST /notification-bulk/send-to-users-with-fines
Enviar para usuários com multas

## Configuração

### Variáveis de Ambiente

```env
# Firebase Cloud Messaging
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=your-phone-number

# Redis (para filas)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-password

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/biblioteca
```

### Inicialização

1. **Executar Migrações**:
```bash
npx prisma migrate dev
```

2. **Inicializar Templates do Sistema**:
```bash
curl -X POST http://localhost:3000/notification-templates/system/initialize
```

3. **Configurar Filas**:
```bash
# Iniciar worker de filas
npm run queue:worker
```

## Exemplos de Uso

### 1. Criar Notificação Simples

```typescript
const notification = await notificationService.createNotification({
  userId: 'user-123',
  title: 'Bem-vindo!',
  message: 'Bem-vindo à biblioteca universitária!',
  type: NotificationType.WELCOME,
  category: NotificationCategory.SUCCESS,
  channel: NotificationChannel.EMAIL,
  priority: NotificationPriority.MEDIUM,
});
```

### 2. Usar Template

```typescript
const notification = await notificationService.createNotification({
  userId: 'user-123',
  templateId: 'loan_reminder',
  data: {
    userName: 'João Silva',
    materialTitle: 'Introdução à Programação',
    daysUntilDue: 2,
  },
  channel: NotificationChannel.EMAIL,
});
```

### 3. Envio em Lote

```typescript
const result = await bulkService.sendBulkNotifications({
  userIds: ['user-1', 'user-2', 'user-3'],
  title: 'Manutenção Programada',
  message: 'A biblioteca estará fechada para manutenção no domingo.',
  type: NotificationType.SYSTEM,
  category: NotificationCategory.INFO,
  channel: NotificationChannel.EMAIL,
});
```

### 4. Configurar Preferências

```typescript
await preferencesService.updatePreferences('user-123', {
  emailEnabled: true,
  smsEnabled: false,
  pushEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  categories: {
    [NotificationCategory.URGENT]: true,
    [NotificationCategory.PROMOTIONAL]: false,
  },
});
```

### 5. Agendar Notificação

```typescript
await schedulerService.scheduleNotification(
  'notification-123',
  new Date('2024-01-15T10:00:00Z'),
  {
    type: 'weekly',
    interval: 1,
    daysOfWeek: [1, 3, 5], // Segunda, quarta, sexta
  }
);
```

## Monitoramento e Manutenção

### Métricas Importantes

1. **Taxa de Entrega**: Percentual de notificações entregues com sucesso
2. **Taxa de Abertura**: Percentual de notificações abertas pelos usuários
3. **Taxa de Clique**: Percentual de notificações que geraram cliques
4. **Tempo de Entrega**: Tempo médio entre criação e entrega
5. **Taxa de Falha**: Percentual de notificações que falharam

### Tarefas de Manutenção

1. **Limpeza de Tokens Inativos**: Remover tokens de dispositivos inativos
2. **Limpeza de Analytics**: Remover dados de analytics antigos
3. **Limpeza de Notificações Expiradas**: Marcar notificações expiradas
4. **Backup de Templates**: Backup regular dos templates personalizados

### Alertas Recomendados

1. **Taxa de Falha Alta**: > 10% de falhas em 1 hora
2. **Fila de Notificações**: > 1000 notificações pendentes
3. **Tokens Inativos**: > 50% de tokens inativos
4. **Tempo de Processamento**: > 5 minutos para processar lote

## Segurança

### Considerações de Segurança

1. **Validação de Entrada**: Todas as entradas são validadas
2. **Sanitização**: Dados são sanitizados antes do processamento
3. **Rate Limiting**: Limitação de taxa para APIs de notificação
4. **Autenticação**: Todas as APIs requerem autenticação
5. **Autorização**: Controle de acesso baseado em roles
6. **Logs de Auditoria**: Logs completos de todas as operações

### Boas Práticas

1. **Não Armazenar Dados Sensíveis**: Evitar armazenar informações sensíveis em templates
2. **Validação de Webhooks**: Validar assinaturas de webhooks
3. **Criptografia**: Criptografar dados sensíveis em trânsito
4. **Backup Regular**: Backup regular de configurações e templates
5. **Monitoramento**: Monitoramento contínuo de métricas e alertas

## Troubleshooting

### Problemas Comuns

1. **Notificações Não Enviadas**:
   - Verificar status da fila
   - Verificar logs de erro
   - Verificar configuração de canais

2. **Templates Não Funcionam**:
   - Verificar variáveis definidas
   - Verificar sintaxe dos placeholders
   - Verificar se template está ativo

3. **Preferências Não Aplicadas**:
   - Verificar configuração de preferências
   - Verificar horário de silêncio
   - Verificar status do canal

4. **Performance Lenta**:
   - Verificar tamanho dos lotes
   - Verificar configuração do Redis
   - Verificar índices do banco de dados

### Logs Importantes

```bash
# Logs de notificações
tail -f logs/notification.log

# Logs de filas
tail -f logs/queue.log

# Logs de erros
tail -f logs/error.log
```

## Roadmap Futuro

### Próximas Funcionalidades

1. **A/B Testing**: Sistema de testes A/B para notificações
2. **Machine Learning**: Recomendações personalizadas baseadas em ML
3. **Integração com Slack/Teams**: Notificações para equipes
4. **Templates Visuais**: Editor visual de templates
5. **Analytics Avançados**: Dashboard de analytics em tempo real
6. **Integração com CRM**: Integração com sistemas de CRM
7. **Notificações de Voz**: Suporte a notificações de voz
8. **Geolocalização**: Notificações baseadas em localização

### Melhorias Técnicas

1. **Cache Redis**: Implementar cache para templates e preferências
2. **CDN**: Distribuição de conteúdo via CDN
3. **Microserviços**: Separação em microserviços
4. **Kubernetes**: Deploy em Kubernetes
5. **Observabilidade**: Implementar OpenTelemetry
6. **Testes**: Cobertura de testes de 90%+
