# Módulo de Reservas (Reservation)

Este módulo gerencia o sistema de reservas de materiais da biblioteca universitária, permitindo que usuários reservem materiais que estão temporariamente indisponíveis.

## Funcionalidades

### Operações CRUD Básicas
- **Criar reserva**: `POST /reservations`
- **Listar reservas**: `GET /reservations`
- **Buscar reserva por ID**: `GET /reservations/:id`
- **Atualizar reserva**: `PATCH /reservations/:id`
- **Remover reserva**: `DELETE /reservations/:id`

### Operações Específicas
- **Cancelar reserva**: `PATCH /reservations/:id/cancel`
- **Marcar como atendida**: `PATCH /reservations/:id/fulfill`
- **Obter estatísticas**: `GET /reservations/statistics`
- **Ver fila de reservas**: `GET /reservations/queue/:materialId`

## Estrutura de Dados

### CreateReservationDto
```typescript
{
  userId: string;           // ID do usuário que está fazendo a reserva
  materialId: string;       // ID do material a ser reservado
  reservationDate?: string; // Data da reserva (opcional, padrão: atual)
  expirationDate: string;   // Data de expiração da reserva
  status?: ReservationStatus; // Status da reserva (opcional, padrão: ACTIVE)
  priority?: number;        // Prioridade da reserva (1-10, padrão: 1)
  observations?: string;    // Observações adicionais
}
```

### ReservationResponseDto
```typescript
{
  id: string;
  userId: string;
  materialId: string;
  reservationDate: Date;
  expirationDate: Date;
  status: ReservationStatus;
  priority: number;
  observations?: string;
  createdAt: Date;
  updatedAt: Date;
  statusLabel: string;      // Rótulo em português
  statusColor: string;      // Cor para interface
  statusIcon: string;       // Ícone para interface
  isExpired: boolean;       // Indica se está expirada
  daysUntilExpiration: number; // Dias até expiração
  user?: UserInfo;          // Informações do usuário
  material?: MaterialInfo;  // Informações do material
}
```

## Status das Reservas

- **ACTIVE**: Reserva ativa e válida
- **FULFILLED**: Reserva atendida (material foi emprestado)
- **EXPIRED**: Reserva expirada
- **CANCELLED**: Reserva cancelada

## Filtros Disponíveis

- `userId`: Filtrar por usuário específico
- `materialId`: Filtrar por material específico
- `status`: Filtrar por status
- `reservationDateFrom/To`: Filtrar por período de reserva
- `expirationDateFrom/To`: Filtrar por período de expiração
- `priorityMin/Max`: Filtrar por faixa de prioridade
- `active`: Filtrar apenas reservas ativas
- `expired`: Filtrar apenas reservas expiradas
- `observations`: Filtrar por texto nas observações

## Paginação

O endpoint de listagem suporta paginação com os parâmetros:
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10)

## Estatísticas

O endpoint de estatísticas retorna:
- Total de reservas por status
- Contagem por mês
- Reservas expiradas hoje
- Reservas que expiram amanhã
- Distribuição por prioridade

## Fila de Reservas

Permite visualizar a ordem de espera para um material específico:
- Lista de usuários aguardando
- Prioridades
- Tempo de espera
- Data estimada de disponibilidade

## Validações

- Usuário deve existir
- Material deve existir
- Usuário não pode ter reserva ativa duplicada para o mesmo material
- Data de expiração deve ser futura
- Prioridade deve estar entre 1 e 10
- Observações limitadas a 500 caracteres

## Exemplos de Uso

### Criar uma reserva
```bash
POST /reservations
{
  "userId": "clx1234567890abcdef",
  "materialId": "clx1234567890abcdef",
  "expirationDate": "2024-02-15T10:00:00Z",
  "priority": 5,
  "observations": "Reserva para pesquisa acadêmica"
}
```

### Listar reservas com filtros
```bash
GET /reservations?page=1&limit=20&status=ACTIVE&active=true
```

### Obter estatísticas
```bash
GET /reservations/statistics
```

### Ver fila de um material
```bash
GET /reservations/queue/clx1234567890abcdef
```

## Dependências

- Prisma Client para acesso ao banco de dados
- Class Validator para validação de dados
- Class Transformer para transformação de dados
- Swagger para documentação da API

## Arquivos do Módulo

- `reservation.module.ts` - Configuração do módulo
- `reservation.service.ts` - Lógica de negócio
- `reservation.controller.ts` - Endpoints da API
- `reservation.entity.ts` - Entidade com métodos de negócio
- `dto/` - Data Transfer Objects
  - `create-reservation.dto.ts`
  - `update-reservation.dto.ts`
  - `reservation-response.dto.ts`
  - `reservation-filters.dto.ts`
  - `paginated-reservations.dto.ts`
  - `reservation-statistics.dto.ts`
  - `reservation-queue.dto.ts`
- `index.ts` - Exportações do módulo
