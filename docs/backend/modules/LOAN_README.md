# 📋 Módulo Loan (Empréstimo)

Sistema completo de gerenciamento de empréstimos de materiais bibliográficos.

## 📋 Visão Geral

O módulo Loan é responsável pelo controle completo de empréstimos da biblioteca, incluindo criação, renovação, devolução, controle de prazos, cálculo de multas e histórico de movimentações. É o coração operacional do sistema de biblioteca.

## 🏗️ Estrutura do Módulo

```
src/modules/loan/
├── dto/
│   ├── create-loan.dto.ts          # DTO para criação de empréstimo
│   ├── update-loan.dto.ts          # DTO para atualização
│   ├── loan-filters.dto.ts         # DTO para filtros de busca
│   ├── loan-response.dto.ts        # DTO para resposta
│   ├── paginated-loans.dto.ts      # DTO para paginação
│   ├── renew-loan.dto.ts           # DTO para renovação
│   ├── return-loan.dto.ts          # DTO para devolução
│   └── index.ts                    # Exportações
├── entities/
│   ├── loan.entity.ts              # Entidade Loan com Swagger
│   └── index.ts                    # Exportações
├── loan.controller.ts              # Controlador REST com Swagger
├── loan.service.ts                 # Serviço com lógica de negócio
├── loan.module.ts                  # Módulo NestJS
└── index.ts                        # Exportações do módulo
```

## 🎯 Funcionalidades

### ✅ Gestão de Empréstimos
- **Criar empréstimo**: Validações de disponibilidade e limites
- **Renovar empréstimo**: Controle de limite de renovações
- **Devolver material**: Cálculo automático de multas
- **Histórico completo**: Rastreamento de todas as movimentações
- **Controle de prazos**: Alertas e notificações automáticas

### ✅ Validações de Negócio
- **Limite por usuário**: Controle por tipo de usuário
- **Disponibilidade**: Verificação em tempo real
- **Situação do usuário**: Bloqueios por multas pendentes
- **Prazo de devolução**: Cálculo baseado no tipo de material
- **Renovações**: Limite máximo configurável

### ✅ Controle de Multas
- **Cálculo automático**: Por atraso na devolução
- **Valores diferenciados**: Por tipo de material e usuário
- **Suspensão automática**: Usuários com multas em atraso
- **Relatórios**: Multas pendentes e pagas

### ✅ Relatórios e Estatísticas
- **Empréstimos ativos**: Por usuário, material, período
- **Histórico**: Movimentações completas
- **Atrasos**: Relatórios de materiais em atraso
- **Renovações**: Análise de padrões de uso

## 📊 Endpoints da API

### Empréstimos
```typescript
POST   /loans                       # Criar empréstimo
GET    /loans                       # Listar empréstimos (paginado)
GET    /loans/:id                   # Buscar por ID
PATCH  /loans/:id                   # Atualizar empréstimo
DELETE /loans/:id                   # Cancelar empréstimo

# Operações Específicas
POST   /loans/:id/renew             # Renovar empréstimo
POST   /loans/:id/return            # Devolver material
GET    /loans/:id/history           # Histórico do empréstimo

# Relatórios
GET    /loans/overdue               # Empréstimos em atraso
GET    /loans/statistics            # Estatísticas gerais
GET    /loans/user/:userId          # Empréstimos por usuário
GET    /loans/material/:materialId  # Histórico por material
```

## 🔧 DTOs e Validações

### CreateLoanDto
```typescript
{
  userId: string;           // ID do usuário (UUID)
  materialId: string;       // ID do material (UUID)
  dueDate?: Date;           // Data de vencimento (opcional, calculada automaticamente)
  observations?: string;    // Observações adicionais
}
```

### RenewLoanDto
```typescript
{
  renewalPeriod?: number;   // Período adicional em dias
  observations?: string;    // Motivo da renovação
}
```

### ReturnLoanDto
```typescript
{
  returnDate?: Date;        // Data de devolução (padrão: agora)
  condition?: string;       // Estado do material na devolução
  observations?: string;    // Observações sobre a devolução
  fineAmount?: number;      // Multa aplicada (calculada automaticamente)
}
```

### LoanFiltersDto
```typescript
{
  userId?: string;
  materialId?: string;
  status?: LoanStatus;
  isOverdue?: boolean;      // Apenas empréstimos em atraso
  dueDateFrom?: Date;       // Vencimento a partir de
  dueDateTo?: Date;         // Vencimento até
  loanDateFrom?: Date;      // Empréstimo a partir de
  loanDateTo?: Date;        // Empréstimo até
  renewalsCount?: number;   // Número de renovações
  search?: string;          // Busca em usuário ou material
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}
```

## 🔐 Segurança e Autorização

### Permissões por Endpoint
- **Criar empréstimo**: Admin, Bibliotecário
- **Listar empréstimos**: Todos (próprios) ou Admin/Bibliotecário (todos)
- **Renovar empréstimo**: Próprio usuário ou Admin/Bibliotecário
- **Devolver material**: Admin, Bibliotecário
- **Relatórios**: Admin, Bibliotecário

## 📈 Enums Relacionados

### LoanStatus
```typescript
enum LoanStatus {
  ACTIVE = 'active',        // Empréstimo ativo
  RETURNED = 'returned',    // Devolvido no prazo
  OVERDUE = 'overdue',      // Em atraso
  RENEWED = 'renewed',      // Renovado
  CANCELLED = 'cancelled'   // Cancelado
}
```

## 🔄 Integração com Outros Módulos

### Dependências
- **User**: Validação de usuário e limites
- **Material**: Verificação de disponibilidade
- **Fine**: Cálculo e aplicação de multas
- **Notification**: Alertas de vencimento
- **Queue**: Processamento assíncrono

### Relacionamentos
```typescript
// Prisma Schema
model Loan {
  id            String      @id @default(uuid())
  user          User        @relation(fields: [userId], references: [id])
  userId        String
  material      Material    @relation(fields: [materialId], references: [id])
  materialId    String
  loanDate      DateTime    @default(now())
  dueDate       DateTime
  returnDate    DateTime?
  status        LoanStatus  @default(ACTIVE)
  renewalsCount Int         @default(0)
  fines         Fine[]
}
```

## 🧪 Regras de Negócio

### Limites de Empréstimo por Tipo de Usuário
```typescript
const LOAN_LIMITS = {
  [UserType.STUDENT]: 3,      // Estudantes: 3 materiais
  [UserType.TEACHER]: 10,     // Professores: 10 materiais
  [UserType.STAFF]: 5,        // Funcionários: 5 materiais
  [UserType.ADMIN]: 15        // Administradores: 15 materiais
};
```

### Período de Empréstimo por Material
```typescript
const LOAN_PERIODS = {
  [MaterialType.BOOK]: 15,        // Livros: 15 dias
  [MaterialType.MAGAZINE]: 7,     // Revistas: 7 dias
  [MaterialType.DVD]: 3,          // DVDs: 3 dias
  [MaterialType.THESIS]: 30       // Teses: 30 dias
};
```

### Cálculo de Multas
```typescript
interface FineCalculation {
  baseAmount: number;           // Valor base por dia de atraso
  multiplier: number;           // Multiplicador por tipo de material
  maxAmount: number;            // Valor máximo da multa
  gracePeriod: number;          // Período de carência (dias)
}
```

## 📊 Funcionalidades Especiais

### Renovação Automática
```typescript
interface AutoRenewalConfig {
  enabled: boolean;
  maxRenewals: number;
  daysBeforeExpiry: number;
  requiresApproval: boolean;
}
```

### Alertas de Vencimento
```typescript
interface ExpiryAlert {
  daysBeforeExpiry: number[];   // [7, 3, 1] dias antes
  notificationMethods: string[]; // ['email', 'sms', 'push']
  escalation: boolean;          // Escalar para bibliotecário
}
```

### Estatísticas Avançadas
```typescript
interface LoanStatistics {
  totalLoans: number;
  activeLoans: number;
  overdueLoans: number;
  averageLoanPeriod: number;
  mostLoanedMaterials: Material[];
  userRanking: UserLoanStats[];
  monthlyTrends: MonthlyStats[];
}
```

## 📝 Exemplos de Uso

### Criar Empréstimo
```typescript
const newLoan = {
  userId: "550e8400-e29b-41d4-a716-446655440000",
  materialId: "550e8400-e29b-41d4-a716-446655440001",
  observations: "Empréstimo para pesquisa de TCC"
};
```

### Renovar Empréstimo
```typescript
const renewal = {
  renewalPeriod: 15,
  observations: "Necessário mais tempo para pesquisa"
};
```

### Busca com Filtros
```typescript
const filters = {
  status: LoanStatus.ACTIVE,
  isOverdue: true,
  dueDateFrom: new Date('2024-01-01'),
  dueDateTo: new Date('2024-12-31'),
  search: "João Silva",
  sortBy: "dueDate",
  sortOrder: "ASC"
};
```

## 🚀 Melhorias Futuras

- [ ] Sistema de reserva automática após devolução
- [ ] Empréstimos digitais com DRM
- [ ] Integração com bibliotecas parceiras
- [ ] Sistema de recomendações baseado em histórico
- [ ] Análise preditiva de atrasos
- [ ] Chatbot para consultas de empréstimos
