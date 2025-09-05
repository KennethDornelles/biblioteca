# 🔧 Módulo Maintenance

Sistema de manutenção automatizada para otimização e limpeza do sistema da biblioteca.

## 📋 Visão Geral

O módulo Maintenance é responsável por tarefas automatizadas de manutenção do sistema, incluindo limpeza de banco de dados, rotação de logs, otimização de performance, backup automático e monitoramento de saúde do sistema.

## 🏗️ Estrutura do Módulo

```
src/modules/maintenance/
├── maintenance.service.ts              # Serviço principal de manutenção
├── maintenance.module.ts               # Módulo NestJS
└── index.ts                           # Exportações do módulo
```

## 🎯 Funcionalidades

### ✅ Limpeza de Banco de Dados
- **Logs antigos**: Remoção de logs expirados
- **Sessões inativas**: Limpeza de sessões antigas
- **Dados temporários**: Remoção de dados de cache
- **Notificações antigas**: Limpeza de notificações lidas
- **Tokens expirados**: Remoção de tokens JWT expirados

### ✅ Rotação de Logs
- **Logs de aplicação**: Rotação baseada em tamanho/tempo
- **Logs de acesso**: Arquivo de logs HTTP
- **Logs de erro**: Logs de erros e exceções
- **Logs de auditoria**: Logs de ações sensíveis
- **Compressão**: Compactação de logs antigos

### ✅ Otimização de Performance
- **Índices de banco**: Análise e otimização
- **Cache warming**: Pré-carregamento de cache
- **Análise de queries**: Identificação de queries lentas
- **Estatísticas**: Atualização de estatísticas do banco

### ✅ Backup Automatizado
- **Backup de banco**: Backup incremental e completo
- **Backup de arquivos**: Arquivos de configuração e uploads
- **Verificação de integridade**: Validação dos backups
- **Retenção**: Política de retenção de backups

## 📊 Principais Métodos

### Limpeza de Dados
```typescript
// Limpeza geral do banco
performDatabaseCleanup(
  cleanupType: string,
  olderThan: string,
  maxRecords: number,
  dryRun?: boolean
): Promise<MaintenanceResult>

// Limpeza de logs
performLogRotation(
  logTypes: string[],
  maxSize: string,
  maxFiles: number,
  compressOld?: boolean
): Promise<MaintenanceResult>

// Limpeza de cache
performCacheCleanup(
  cacheTypes: string[],
  strategy: 'age' | 'size' | 'usage'
): Promise<MaintenanceResult>
```

### Otimização
```typescript
// Otimização de índices
optimizeDatabaseIndexes(
  tables?: string[],
  analyzeOnly?: boolean
): Promise<OptimizationResult>

// Atualização de estatísticas
updateDatabaseStatistics(
  tables?: string[]
): Promise<StatisticsResult>

// Análise de performance
analyzeSystemPerformance(
  duration: string
): Promise<PerformanceReport>
```

### Backup
```typescript
// Backup completo
performFullBackup(
  destination: string,
  includeFiles?: boolean
): Promise<BackupResult>

// Backup incremental
performIncrementalBackup(
  destination: string,
  since?: Date
): Promise<BackupResult>

// Verificação de backup
verifyBackup(
  backupPath: string
): Promise<VerificationResult>
```

## 🔧 Interfaces e Tipos

### MaintenanceResult
```typescript
interface MaintenanceResult {
  taskType: string;                     // Tipo da tarefa executada
  startTime: Date;                      // Início da execução
  endTime: Date;                        // Fim da execução
  duration: number;                     // Duração em milissegundos
  affectedRecords: number;              // Registros processados
  bytesProcessed?: number;              // Bytes processados
  warnings: string[];                   // Avisos encontrados
  recommendations: string[];            // Recomendações
  success: boolean;                     // Se foi bem-sucedida
  error?: string;                       // Erro, se houver
}
```

### PerformanceReport
```typescript
interface PerformanceReport {
  period: {
    start: Date;
    end: Date;
  };
  database: {
    slowQueries: SlowQuery[];           // Queries lentas
    indexUsage: IndexUsage[];           // Uso de índices
    connectionStats: ConnectionStats;    // Estatísticas de conexão
  };
  memory: {
    usage: number;                      // Uso de memória (%)
    peak: number;                       // Pico de uso
    leaks: MemoryLeak[];                // Possíveis vazamentos
  };
  cpu: {
    average: number;                    // CPU média (%)
    peak: number;                       // Pico de CPU
  };
  disk: {
    usage: number;                      // Uso de disco (%)
    growth: number;                     // Crescimento por dia
  };
  recommendations: string[];
}
```

### BackupResult
```typescript
interface BackupResult {
  backupId: string;                     // ID único do backup
  type: 'full' | 'incremental';        // Tipo do backup
  startTime: Date;
  endTime: Date;
  size: number;                         // Tamanho em bytes
  checksum: string;                     // Hash para verificação
  location: string;                     // Localização do arquivo
  tables: string[];                     // Tabelas incluídas
  compressionRatio?: number;            // Taxa de compressão
  success: boolean;
  error?: string;
}
```

## ⏰ Tarefas Agendadas

### Configuração de Cron Jobs
```typescript
// Limpeza diária (02:00)
@Cron('0 2 * * *')
async dailyCleanup() {
  await this.performDatabaseCleanup('daily', '30d', 10000);
  await this.performLogRotation(['application'], '100MB', 10);
}

// Backup semanal (domingo 03:00)
@Cron('0 3 * * 0')
async weeklyBackup() {
  await this.performFullBackup('/backups/weekly');
}

// Otimização mensal (primeiro dia 04:00)
@Cron('0 4 1 * *')
async monthlyOptimization() {
  await this.optimizeDatabaseIndexes();
  await this.updateDatabaseStatistics();
}

// Análise de performance (a cada 6 horas)
@Cron('0 */6 * * *')
async performanceCheck() {
  const report = await this.analyzeSystemPerformance('6h');
  if (report.cpu.average > 80) {
    await this.notificationService.sendAlert('High CPU usage detected');
  }
}
```

## 🔐 Configurações e Segurança

### Configurações de Manutenção
```typescript
interface MaintenanceConfig {
  cleanup: {
    enabled: boolean;
    retentionPeriods: {
      logs: string;                     // '30d'
      sessions: string;                 // '7d'
      notifications: string;            // '90d'
      tempFiles: string;                // '1d'
    };
    batchSize: number;                  // Tamanho do lote para processamento
  };
  backup: {
    enabled: boolean;
    schedule: string;                   // Expressão cron
    location: string;                   // Diretório de backup
    retention: number;                  // Dias de retenção
    compression: boolean;
  };
  optimization: {
    autoOptimize: boolean;
    schedule: string;
    indexThreshold: number;             // % de fragmentação para reindexar
  };
}
```

### Permissões e Acesso
```typescript
// Apenas administradores podem executar manutenção
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserType.ADMIN)
async performMaintenance() {
  // Lógica de manutenção
}
```

## 📊 Monitoramento e Alertas

### Métricas de Sistema
```typescript
interface SystemMetrics {
  timestamp: Date;
  database: {
    connections: number;                // Conexões ativas
    queries: number;                    // Queries por minuto
    avgResponseTime: number;            // Tempo médio de resposta (ms)
    errorRate: number;                  // Taxa de erro (%)
  };
  memory: {
    used: number;                       // Memória usada (MB)
    available: number;                  // Memória disponível (MB)
    usage: number;                      // Percentual de uso
  };
  disk: {
    used: number;                       // Espaço usado (GB)
    available: number;                  // Espaço disponível (GB)
    usage: number;                      // Percentual de uso
  };
  queues: {
    pending: number;                    // Jobs pendentes
    failed: number;                     // Jobs falhados
    processing: number;                 // Jobs em processamento
  };
}
```

### Alertas Automáticos
```typescript
interface AlertRule {
  name: string;
  metric: string;                       // 'cpu.usage', 'memory.usage', etc.
  operator: '>' | '<' | '=' | '!=';
  threshold: number;
  duration: string;                     // '5m' - duração para disparar
  severity: 'low' | 'medium' | 'high' | 'critical';
  actions: AlertAction[];
}

interface AlertAction {
  type: 'email' | 'webhook' | 'auto-remediate';
  target: string;
  parameters?: Record<string, any>;
}
```

## 🧪 Modo de Teste (Dry Run)

### Execução Segura
```typescript
// Executar em modo de teste primeiro
const result = await this.maintenanceService.performDatabaseCleanup(
  'old_logs',
  '30d',
  1000,
  true  // dry run = true
);

console.log(`Seria removido: ${result.affectedRecords} registros`);

// Se resultado for satisfatório, executar de verdade
if (result.affectedRecords < 5000) {
  await this.maintenanceService.performDatabaseCleanup(
    'old_logs',
    '30d',
    1000,
    false  // dry run = false
  );
}
```

## 📝 Exemplos de Uso

### Limpeza Personalizada
```typescript
// Limpeza de logs antigos
const cleanupResult = await this.maintenanceService.performDatabaseCleanup(
  'application_logs',
  '90d',        // Mais antigo que 90 dias
  5000,         // Máximo 5000 registros por vez
  false         // Executar de verdade
);

console.log(`Removidos: ${cleanupResult.affectedRecords} logs`);
```

### Backup com Verificação
```typescript
// Fazer backup
const backup = await this.maintenanceService.performFullBackup(
  '/storage/backups',
  true  // Incluir arquivos
);

// Verificar integridade
const verification = await this.maintenanceService.verifyBackup(
  backup.location
);

if (!verification.valid) {
  throw new Error('Backup corrompido!');
}
```

### Análise de Performance
```typescript
// Analisar últimas 24 horas
const report = await this.maintenanceService.analyzeSystemPerformance('24h');

if (report.database.slowQueries.length > 10) {
  console.log('Atenção: Muitas queries lentas detectadas');
  
  // Otimizar índices automaticamente
  await this.maintenanceService.optimizeDatabaseIndexes();
}
```

## 🚀 Melhorias Futuras

- [ ] Machine Learning para predição de necessidades de manutenção
- [ ] Integração com ferramentas de monitoramento (Grafana, Prometheus)
- [ ] Auto-scaling baseado em métricas
- [ ] Manutenção distribuída para alta disponibilidade
- [ ] Integração com clouds para backup automático
- [ ] Dashboard em tempo real de saúde do sistema
- [ ] Automação de recuperação de desastres
