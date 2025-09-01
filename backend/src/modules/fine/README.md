# Módulo de Multas (Fine)

Este módulo gerencia o sistema de multas da biblioteca universitária, permitindo o controle de penalizações por atrasos na devolução de materiais emprestados.

## Funcionalidades

### Operações CRUD Básicas
- **Criar multa**: `POST /fines`
- **Listar multas**: `GET /fines`
- **Buscar multa por ID**: `GET /fines/:id`
- **Atualizar multa**: `PATCH /fines/:id`
- **Remover multa**: `DELETE /fines/:id`

### Operações Específicas
- **Pagar multa**: `POST /fines/pay`
- **Parcelar multa**: `POST /fines/installment`
- **Cancelar multa**: `PATCH /fines/:id/cancel`
- **Obter estatísticas**: `GET /fines/statistics`

## Estrutura de Dados

### CreateFineDto
```typescript
{
  loanId: string;           // ID do empréstimo relacionado
  userId: string;           // ID do usuário que recebeu a multa
  amount: number;           // Valor da multa (mínimo: 0.01)
  daysOverdue: number;      // Número de dias em atraso (mínimo: 1)
  dueDate: string;          // Data de vencimento da multa
  status?: FineStatus;      // Status da multa (opcional, padrão: PENDING)
  description?: string;     // Descrição da multa
}
```

### FineResponseDto
```typescript
{
  id: string;
  loanId: string;
  userId: string;
  amount: number;
  daysOverdue: number;
  creationDate: Date;
  dueDate: Date;
  paymentDate?: Date;
  status: FineStatus;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  statusLabel: string;      // Rótulo em português
  statusColor: string;      // Cor para interface
  statusIcon: string;       // Ícone para interface
  isOverdue: boolean;       // Indica se está em atraso
  daysUntilDue: number;     // Dias até o vencimento
  formattedAmount: string;  // Valor formatado em moeda brasileira
  user?: UserInfo;          // Informações do usuário
  loan?: LoanInfo;          // Informações do empréstimo
}
```

## Status das Multas

- **PENDING**: Multa pendente de pagamento
- **PAID**: Multa paga
- **CANCELLED**: Multa cancelada
- **INSTALLMENT**: Multa parcelada

## Filtros Disponíveis

- `userId`: Filtrar por usuário específico
- `loanId`: Filtrar por empréstimo específico
- `status`: Filtrar por status
- `amountFrom/To`: Filtrar por faixa de valor
- `creationDateFrom/To`: Filtrar por período de criação
- `dueDateFrom/To`: Filtrar por período de vencimento
- `overdue`: Filtrar apenas multas em atraso
- `paid`: Filtrar apenas multas pagas
- `description`: Filtrar por texto na descrição
- `daysOverdueMin/Max`: Filtrar por faixa de dias de atraso

## Paginação

O endpoint de listagem suporta paginação com os parâmetros:
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10)

## Estatísticas

O endpoint de estatísticas retorna:
- Total de multas por status
- Valores totais por status
- Contagem por mês
- Multas vencidas hoje
- Multas que vencem amanhã
- Multas em atraso
- Valores em atraso
- Dias médios de atraso

## Sistema de Pagamento

### Pagamento Direto
```typescript
{
  fineId: string;           // ID da multa
  amount: number;           // Valor do pagamento
  paymentMethod: string;    // Método de pagamento
  paymentDate?: string;     // Data do pagamento (opcional)
  observations?: string;    // Observações
  receiptNumber?: string;   // Número do comprovante
}
```

### Parcelamento
```typescript
{
  fineId: string;           // ID da multa
  numberOfInstallments: number; // Número de parcelas (2-12)
  installmentAmount: number;    // Valor de cada parcela
  firstDueDate: string;         // Data de vencimento da primeira parcela
  observations?: string;        // Observações
}
```

## Validações

- Usuário deve existir
- Empréstimo deve existir
- Não pode haver multa ativa duplicada para o mesmo empréstimo
- Valor da multa deve ser maior que zero
- Dias de atraso deve ser maior que zero
- Data de vencimento deve ser futura
- Para pagamento: valor deve ser igual ou maior ao valor da multa
- Para parcelamento: número de parcelas entre 2 e 12
- Para parcelamento: valor total das parcelas deve ser igual ao valor da multa

## Cálculo de Juros

O sistema calcula automaticamente juros para multas em atraso:
- Taxa diária padrão: R$ 1,00 por dia
- Juros são aplicados apenas a multas pendentes ou parceladas
- O valor total inclui a multa original + juros acumulados

## Exemplos de Uso

### Criar uma multa
```bash
POST /fines
{
  "loanId": "clx1234567890abcdef",
  "userId": "clx1234567890abcdef",
  "amount": 15.50,
  "daysOverdue": 5,
  "dueDate": "2024-02-15T10:00:00Z",
  "description": "Multa por atraso na devolução"
}
```

### Pagar uma multa
```bash
POST /fines/pay
{
  "fineId": "clx1234567890abcdef",
  "amount": 15.50,
  "paymentMethod": "PIX",
  "observations": "Pagamento via PIX"
}
```

### Parcelar uma multa
```bash
POST /fines/installment
{
  "fineId": "clx1234567890abcdef",
  "numberOfInstallments": 3,
  "installmentAmount": 5.17,
  "firstDueDate": "2024-02-15T10:00:00Z"
}
```

### Listar multas com filtros
```bash
GET /fines?page=1&limit=20&status=PENDING&overdue=true
```

### Obter estatísticas
```bash
GET /fines/statistics
```

## Dependências

- Prisma Client para acesso ao banco de dados
- Class Validator para validação de dados
- Class Transformer para transformação de dados
- Swagger para documentação da API

## Arquivos do Módulo

- `fine.module.ts` - Configuração do módulo
- `fine.service.ts` - Lógica de negócio
- `fine.controller.ts` - Endpoints da API
- `fine.entity.ts` - Entidade com métodos de negócio
- `dto/` - Data Transfer Objects
  - `create-fine.dto.ts`
  - `update-fine.dto.ts`
  - `fine-response.dto.ts`
  - `fine-filters.dto.ts`
  - `paginated-fines.dto.ts`
  - `fine-statistics.dto.ts`
  - `fine-payment.dto.ts`
- `index.ts` - Exportações do módulo

## Fluxo de Negócio

1. **Criação**: Multa é criada automaticamente quando um empréstimo é devolvido com atraso
2. **Pagamento**: Usuário pode pagar a multa diretamente ou solicitar parcelamento
3. **Parcelamento**: Multa é convertida para status INSTALLMENT
4. **Cancelamento**: Bibliotecário pode cancelar multas em casos especiais
5. **Juros**: Calculados automaticamente para multas em atraso
