# 📊 Módulo Report

Sistema completo de geração de relatórios e análises para a biblioteca universitária.

## 📋 Visão Geral

O módulo Report é responsável pela geração de relatórios detalhados sobre todas as atividades da biblioteca, incluindo empréstimos, usuários, materiais, multas e estatísticas gerais. Suporta múltiplos formatos de saída e oferece dashboards interativos.

## 🏗️ Estrutura do Módulo

```
src/modules/report/
├── report.service.ts                   # Serviço principal de relatórios
├── report.module.ts                    # Módulo NestJS
└── index.ts                           # Exportações do módulo
```

## 🎯 Funcionalidades

### ✅ Relatórios de Empréstimos
- **Relatório diário**: Empréstimos do dia com detalhes
- **Relatório mensal**: Estatísticas mensais de empréstimos
- **Materiais mais emprestados**: Ranking de popularidade
- **Usuários mais ativos**: Ranking de empréstimos por usuário
- **Atrasos e devoluções**: Análise de pontualidade

### ✅ Relatórios de Usuários
- **Cadastros por período**: Novos usuários registrados
- **Atividade por tipo**: Estudantes vs Professores vs Funcionários
- **Uso da biblioteca**: Frequência e padrões de uso
- **Inadimplência**: Usuários com multas pendentes

### ✅ Relatórios de Acervo
- **Inventário completo**: Status de todo o acervo
- **Materiais por categoria**: Distribuição por tipo e área
- **Rotatividade**: Análise de circulação dos materiais
- **Sugestões de aquisição**: Baseado em demanda

### ✅ Relatórios Financeiros
- **Multas arrecadadas**: Valores por período
- **Custos operacionais**: Análise de gastos
- **ROI do acervo**: Retorno sobre investimento
- **Projeções**: Tendências financeiras

## 📊 Principais Métodos

### Relatórios Diários
```typescript
// Relatório diário de empréstimos
generateDailyLoansReport(
  date: string,
  format: string,
  includeCharts?: boolean,
  customFilters?: Record<string, any>
): Promise<ReportResult>

// Relatório diário de usuários
generateDailyUsersReport(
  date: string,
  format: string,
  includeCharts?: boolean
): Promise<ReportResult>

// Relatório diário de multas
generateDailyFinesReport(
  date: string,
  format: string
): Promise<ReportResult>
```

### Relatórios Mensais/Anuais
```typescript
// Estatísticas mensais
generateMonthlyStatisticsReport(
  year: number,
  month: number,
  format: string,
  includeCharts?: boolean
): Promise<ReportResult>

// Relatório anual completo
generateAnnualReport(
  year: number,
  sections: string[],
  format: string
): Promise<ReportResult>

// Tendências de uso
generateUsageTrendsReport(
  startDate: string,
  endDate: string,
  granularity: 'daily' | 'weekly' | 'monthly'
): Promise<ReportResult>
```

### Relatórios Personalizados
```typescript
// Relatório customizado
generateCustomReport(
  config: CustomReportConfig
): Promise<ReportResult>

// Dashboard em tempo real
generateDashboardData(
  widgets: string[]
): Promise<DashboardData>

// Relatório comparativo
generateComparisonReport(
  periods: DateRange[],
  metrics: string[]
): Promise<ReportResult>
```

## 🔧 Interfaces e DTOs

### ReportResult
```typescript
interface ReportResult {
  success: boolean;
  reportUrl: string;
  recordCount: number;
  generationTime: number;
  format: ReportFormat;
  size: number;            // Tamanho do arquivo em bytes
  expiresAt: Date;         // Data de expiração do link
  metadata: ReportMetadata;
}
```

### CustomReportConfig
```typescript
interface CustomReportConfig {
  name: string;
  description?: string;
  dataSource: string[];        // Tabelas/módulos fonte
  filters: ReportFilter[];
  groupBy: string[];
  orderBy: ReportSort[];
  metrics: ReportMetric[];
  format: ReportFormat;
  template?: string;
  charts?: ChartConfig[];
  schedule?: ScheduleConfig;
}
```

### DashboardData
```typescript
interface DashboardData {
  widgets: DashboardWidget[];
  lastUpdated: Date;
  refreshInterval: number;
  alerts: Alert[];
}

interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'list';
  title: string;
  data: any;
  config: WidgetConfig;
}
```

## 📈 Formatos de Relatório

### Formatos Suportados
```typescript
enum ReportFormat {
  PDF = 'pdf',           // Relatórios formais
  EXCEL = 'xlsx',        // Análise de dados
  CSV = 'csv',           // Importação/exportação
  JSON = 'json',         // APIs e integração
  HTML = 'html',         // Visualização web
  PNG = 'png',           // Gráficos
  SVG = 'svg'            // Gráficos vetoriais
}
```

### Templates Disponíveis
```typescript
const REPORT_TEMPLATES = {
  'executive-summary': {
    name: 'Resumo Executivo',
    description: 'Relatório sintético para gestores',
    format: [ReportFormat.PDF, ReportFormat.HTML],
    sections: ['overview', 'kpis', 'trends', 'recommendations']
  },
  'detailed-analysis': {
    name: 'Análise Detalhada',
    description: 'Relatório completo com todos os dados',
    format: [ReportFormat.PDF, ReportFormat.EXCEL],
    sections: ['data', 'charts', 'tables', 'appendix']
  },
  'dashboard': {
    name: 'Dashboard Interativo',
    description: 'Visualização em tempo real',
    format: [ReportFormat.HTML],
    sections: ['widgets', 'charts', 'alerts']
  }
};
```

## 📊 Tipos de Gráficos

### Gráficos Disponíveis
```typescript
interface ChartConfig {
  type: ChartType;
  title: string;
  data: ChartData;
  options: ChartOptions;
}

enum ChartType {
  LINE = 'line',              // Tendências temporais
  BAR = 'bar',                // Comparações
  PIE = 'pie',                // Proporções
  SCATTER = 'scatter',        // Correlações
  HEATMAP = 'heatmap',        // Densidade
  GAUGE = 'gauge',            // Métricas
  FUNNEL = 'funnel',          // Conversões
  TREEMAP = 'treemap'         // Hierarquias
}
```

## 🔐 Segurança e Autorização

### Permissões por Tipo de Relatório
- **Relatórios básicos**: Bibliotecários e Administradores
- **Relatórios financeiros**: Apenas Administradores
- **Dados pessoais**: Anonimizados para não-administradores
- **Exportação**: Log de todas as exportações

### Controle de Acesso
```typescript
interface ReportPermission {
  userId: string;
  reportTypes: ReportType[];
  dataScopes: DataScope[];    // Quais dados pode acessar
  exportFormats: ReportFormat[];
  maxRecords: number;         // Limite de registros
  retentionDays: number;      // Dias para manter o relatório
}
```

## 🔄 Integração com Outros Módulos

### Dependências
- **User**: Dados de usuários para relatórios
- **Loan**: Estatísticas de empréstimos
- **Material**: Dados do acervo
- **Fine**: Informações financeiras
- **Queue**: Geração assíncrona de relatórios
- **Email**: Envio de relatórios por email

### Fontes de Dados
```typescript
const DATA_SOURCES = {
  users: 'Dados de usuários e perfis',
  loans: 'Histórico de empréstimos',
  materials: 'Catálogo e status dos materiais',
  fines: 'Multas e pagamentos',
  reservations: 'Reservas ativas e históricas',
  notifications: 'Histórico de comunicações',
  system_logs: 'Logs de sistema e auditoria'
};
```

## 📅 Agendamento de Relatórios

### Relatórios Automáticos
```typescript
interface ScheduledReport {
  id: string;
  name: string;
  config: CustomReportConfig;
  schedule: CronExpression;
  recipients: string[];       // Emails para envio
  active: boolean;
  lastRun?: Date;
  nextRun: Date;
  failures: number;           // Contador de falhas
}

// Exemplos de agendamento
const SCHEDULED_REPORTS = [
  {
    name: 'Relatório Diário de Empréstimos',
    schedule: '0 8 * * *',     // Todo dia às 8h
    recipients: ['bibliotecario@uni.edu']
  },
  {
    name: 'Relatório Mensal de Estatísticas',
    schedule: '0 9 1 * *',     // Primeiro dia do mês às 9h
    recipients: ['diretor@uni.edu', 'bibliotecario@uni.edu']
  }
];
```

## 🧪 Funcionalidades Especiais

### Cache Inteligente
```typescript
interface ReportCache {
  key: string;
  parameters: Record<string, any>;
  generatedAt: Date;
  expiresAt: Date;
  filePath: string;
  accessCount: number;
  lastAccessed: Date;
}
```

### Análise Preditiva
```typescript
interface PredictiveAnalysis {
  metric: string;             // Métrica a prever
  algorithm: 'linear' | 'polynomial' | 'arima';
  trainingPeriod: number;     // Meses de dados históricos
  forecastPeriod: number;     // Meses a prever
  confidence: number;         // Intervalo de confiança
  accuracy: number;           // Precisão do modelo
}
```

### Benchmarking
```typescript
interface BenchmarkReport {
  institution: string;
  metrics: BenchmarkMetric[];
  period: DateRange;
  comparison: 'sector' | 'size' | 'region';
  anonymized: boolean;
}
```

## 📝 Exemplos de Uso

### Relatório Simples
```typescript
const dailyReport = await this.reportService.generateDailyLoansReport(
  '2024-12-05',
  'pdf',
  true,  // incluir gráficos
  {
    userType: 'STUDENT',
    materialType: 'BOOK'
  }
);

console.log(`Relatório gerado: ${dailyReport.reportUrl}`);
```

### Relatório Customizado
```typescript
const customConfig = {
  name: 'Análise de Uso por Curso',
  dataSource: ['users', 'loans', 'materials'],
  filters: [
    { field: 'user.userType', operator: 'eq', value: 'STUDENT' },
    { field: 'loan.loanDate', operator: 'gte', value: '2024-01-01' }
  ],
  groupBy: ['user.course', 'material.category'],
  metrics: [
    { field: 'loan.id', aggregation: 'count', alias: 'total_loans' },
    { field: 'loan.dueDate', aggregation: 'avg_days', alias: 'avg_loan_period' }
  ],
  format: ReportFormat.EXCEL,
  charts: [
    {
      type: ChartType.BAR,
      title: 'Empréstimos por Curso',
      x: 'user.course',
      y: 'total_loans'
    }
  ]
};

const customReport = await this.reportService.generateCustomReport(customConfig);
```

### Dashboard em Tempo Real
```typescript
const dashboardData = await this.reportService.generateDashboardData([
  'active_loans',
  'overdue_materials',
  'daily_registrations',
  'popular_materials',
  'system_health'
]);

// Retorna dados para widgets do dashboard
```

## 🚀 Melhorias Futuras

- [ ] Machine Learning para insights automáticos
- [ ] Relatórios interativos com drill-down
- [ ] Integração com ferramentas de BI (Tableau, Power BI)
- [ ] Relatórios colaborativos com comentários
- [ ] API para relatórios em tempo real
- [ ] Geração de relatórios por voz (assistente virtual)
- [ ] Relatórios geoespaciais para análise de localização
