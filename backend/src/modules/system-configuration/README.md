# Módulo de Configuração do Sistema

Este módulo gerencia as configurações do sistema da biblioteca, permitindo personalizar comportamentos e parâmetros sem alterar o código.

## Funcionalidades

### CRUD Básico
- **Criar Configuração**: Adiciona novas configurações ao sistema
- **Listar Configurações**: Lista todas as configurações com filtros e paginação
- **Buscar Configuração**: Busca configuração por ID ou chave
- **Atualizar Configuração**: Modifica valores e propriedades
- **Remover Configuração**: Remove configurações editáveis

### Funcionalidades Especiais
- **Configurações por Categoria**: Agrupa configurações por categoria
- **Configurações do Sistema**: Retorna configurações organizadas por funcionalidade
- **Validação de Tipos**: Valida valores conforme o tipo definido
- **Configurações Padrão**: Inicializa configurações padrão do sistema
- **Edição por Chave**: Atualiza configurações diretamente pela chave

## Endpoints

### POST `/system-configurations`
Cria uma nova configuração.

**Body:**
```json
{
  "key": "library.name",
  "value": "Biblioteca Central",
  "description": "Nome da biblioteca",
  "type": "string",
  "category": "library",
  "editable": true
}
```

**Validações:**
- Chave deve ser única
- Tipo deve ser suportado (string, number, boolean)
- Valor deve ser válido para o tipo

### GET `/system-configurations`
Lista todas as configurações com filtros e paginação.

**Query Parameters:**
- `key`: Filtrar por chave (busca parcial)
- `type`: Filtrar por tipo
- `category`: Filtrar por categoria
- `editable`: Filtrar por editabilidade
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10)

### GET `/system-configurations/categories`
Retorna configurações agrupadas por categoria.

### GET `/system-configurations/settings`
Retorna configurações organizadas por funcionalidade:
- **library**: Nome, endereço, telefone, email, horários
- **loans**: Dias padrão, renovações, limites, multas
- **reservations**: Limites e expiração
- **notifications**: Email, SMS, lembretes

### GET `/system-configurations/category/:category`
Lista configurações de uma categoria específica.

### GET `/system-configurations/key/:key`
Busca configuração por chave.

### GET `/system-configurations/:id`
Busca configuração por ID.

### PATCH `/system-configurations/:id`
Atualiza uma configuração existente.

**Body:**
```json
{
  "value": "Novo valor",
  "description": "Nova descrição"
}
```

### PATCH `/system-configurations/key/:key`
Atualiza configuração diretamente pela chave.

**Body:**
```json
{
  "value": "Novo valor"
}
```

### DELETE `/system-configurations/:id`
Remove uma configuração (apenas se for editável).

### POST `/system-configurations/initialize`
Inicializa configurações padrão do sistema.

## Modelo de Dados

### SystemConfiguration
```typescript
{
  id: string;
  key: string;           // Chave única
  value: string;         // Valor da configuração
  description?: string;  // Descrição opcional
  type: string;          // Tipo de dados
  category: string;      // Categoria
  editable: boolean;     // Se pode ser editada
  createdAt: Date;
  updatedAt: Date;
}
```

## Tipos de Configuração

### String
- **library.name**: Nome da biblioteca
- **library.address**: Endereço
- **library.phone**: Telefone
- **library.email**: Email
- **library.workingHours**: Horários de funcionamento

### Number
- **loans.defaultLoanDays**: Dias padrão para empréstimo
- **loans.maxRenewals**: Máximo de renovações
- **loans.maxLoansPerUser**: Máximo de empréstimos por usuário
- **loans.overdueFinePerDay**: Multa por dia de atraso
- **reservations.maxReservationsPerUser**: Máximo de reservas
- **reservations.reservationExpirationDays**: Dias para expiração
- **notifications.reminderDaysBefore**: Dias para lembrete

### Boolean
- **notifications.emailEnabled**: Habilitar notificações por email
- **notifications.smsEnabled**: Habilitar notificações por SMS

## Categorias

- **library**: Configurações da biblioteca
- **loans**: Configurações de empréstimos
- **reservations**: Configurações de reservas
- **notifications**: Configurações de notificações
- **security**: Configurações de segurança
- **backup**: Configurações de backup

## Regras de Negócio

1. **Unicidade**: Cada chave deve ser única no sistema
2. **Validação de Tipo**: Valores devem ser válidos para o tipo definido
3. **Editabilidade**: Configurações não editáveis não podem ser alteradas
4. **Categorização**: Configurações devem pertencer a uma categoria
5. **Valores Padrão**: Sistema inicializa com configurações padrão

## Exemplos de Uso

### Criar Configuração
```typescript
const config = await configService.create({
  key: 'custom.setting',
  value: 'custom value',
  description: 'Configuração personalizada',
  type: 'string',
  category: 'custom'
});
```

### Buscar por Categoria
```typescript
const libraryConfigs = await configService.findByCategory('library');
```

### Obter Configurações do Sistema
```typescript
const settings = await configService.getSystemSettings();
console.log(`Nome da biblioteca: ${settings.library.name}`);
console.log(`Dias de empréstimo: ${settings.loans.defaultLoanDays}`);
```

### Atualizar por Chave
```typescript
await configService.updateByKey('library.name', 'Nova Biblioteca');
```

## Configurações Padrão

O sistema inicializa automaticamente com as seguintes configurações:

### Biblioteca
- Nome, endereço, telefone, email, horários

### Empréstimos
- 7 dias padrão, 2 renovações, 3 empréstimos por usuário, R$ 0,50 por dia de atraso

### Reservas
- 5 reservas por usuário, 3 dias para expiração

### Notificações
- Email habilitado, SMS desabilitado, 1 dia para lembrete

## Tratamento de Erros

- **400**: Dados inválidos ou configuração não editável
- **404**: Configuração não encontrada
- **409**: Chave de configuração já existe

## Dependências

- Prisma Client para acesso ao banco
- Class Validator para validação de DTOs
- Swagger para documentação da API

## Segurança

- Configurações críticas podem ser marcadas como não editáveis
- Validação de tipos previne valores inválidos
- Categorização facilita gerenciamento e auditoria
