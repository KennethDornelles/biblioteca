# 👤 Módulo User (Usuário)

Sistema completo de gerenciamento de usuários para a biblioteca universitária.

## 📋 Visão Geral

O módulo User é responsável pelo gerenciamento completo de usuários do sistema, incluindo estudantes, professores, funcionários e administradores. Oferece funcionalidades de CRUD, autenticação, perfis personalizados e controle de acesso baseado em roles.

## 🏗️ Estrutura do Módulo

```
src/modules/user/
├── dto/
│   ├── create-user.dto.ts          # DTO para criação de usuário
│   ├── update-user.dto.ts          # DTO para atualização
│   ├── user-filters.dto.ts         # DTO para filtros de busca
│   ├── user-response.dto.ts        # DTO para resposta
│   ├── paginated-users.dto.ts      # DTO para paginação
│   ├── change-password.dto.ts      # DTO para mudança de senha
│   └── index.ts                    # Exportações
├── user.controller.ts              # Controlador REST com Swagger
├── user.service.ts                 # Serviço com lógica de negócio
├── user.module.ts                  # Módulo NestJS
├── user.controller.spec.ts         # Testes do controlador
├── user.service.spec.ts            # Testes do serviço
└── index.ts                        # Exportações do módulo
```

## 🎯 Funcionalidades

### ✅ CRUD Completo
- **Criar usuário**: Registro com validações específicas por tipo
- **Listar usuários**: Paginação, filtros e ordenação
- **Buscar usuário**: Por ID, email ou matrícula
- **Atualizar usuário**: Atualizações parciais com validação
- **Deletar usuário**: Soft delete com verificações de dependências

### ✅ Autenticação e Segurança
- **Mudança de senha**: Com validação de senha atual
- **Reset de senha**: Sistema de tokens temporários
- **Controle de acesso**: Baseado em roles e guards
- **Validação de email**: Verificação de domínio institucional

### ✅ Tipos de Usuário
- **Estudante**: Graduação, pós-graduação, doutorado
- **Professor**: Efetivo, visitante, substituto
- **Funcionário**: Bibliotecário, administrador, técnico
- **Administrador**: Acesso total ao sistema

### ✅ Perfis Personalizados
- **Configurações pessoais**: Preferências e notificações
- **Histórico de atividades**: Log de empréstimos e multas
- **Estatísticas**: Dados de uso da biblioteca

## 📊 Endpoints da API

### Usuários
```typescript
POST   /users                    # Criar usuário
GET    /users                    # Listar usuários (paginado)
GET    /users/:id                # Buscar por ID
GET    /users/search/:term       # Buscar por termo
PATCH  /users/:id                # Atualizar usuário
DELETE /users/:id                # Deletar usuário

# Autenticação
PATCH  /users/:id/password       # Alterar senha
POST   /users/:id/reset-password # Reset de senha

# Perfil
GET    /users/:id/profile        # Dados do perfil
PATCH  /users/:id/profile        # Atualizar perfil
GET    /users/:id/statistics     # Estatísticas do usuário
```

## 🔧 DTOs e Validações

### CreateUserDto
```typescript
{
  name: string;           // Nome completo (3-100 chars)
  email: string;          // Email institucional válido
  userType: UserType;     // STUDENT | TEACHER | STAFF | ADMIN
  registration?: string;  // Matrícula (estudantes/funcionários)
  studentLevel?: StudentLevel; // Nível acadêmico (estudantes)
  phone?: string;         // Telefone com formato brasileiro
  address?: string;       // Endereço completo
}
```

### UserFiltersDto
```typescript
{
  userType?: UserType;
  status?: UserStatus;
  studentLevel?: StudentLevel;
  search?: string;        // Busca em nome, email ou matrícula
  startDate?: Date;       // Filtro por data de criação
  endDate?: Date;
  sortBy?: string;        // Campo para ordenação
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}
```

## 🔐 Segurança e Autorização

### Guards Aplicados
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserType.ADMIN, UserType.LIBRARIAN)
```

### Permissões por Endpoint
- **Criar usuário**: Admin, Bibliotecário
- **Listar usuários**: Todos os usuários autenticados
- **Atualizar usuário**: Admin, Bibliotecário, próprio usuário
- **Deletar usuário**: Apenas Admin
- **Alterar senha**: Próprio usuário ou Admin

## 📈 Enums Relacionados

### UserType
```typescript
enum UserType {
  STUDENT = 'student',
  TEACHER = 'teacher', 
  STAFF = 'staff',
  ADMIN = 'admin'
}
```

### UserStatus
```typescript
enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BLOCKED = 'blocked'
}
```

### StudentLevel
```typescript
enum StudentLevel {
  UNDERGRADUATE = 'undergraduate',
  GRADUATE = 'graduate',
  POSTGRADUATE = 'postgraduate',
  DOCTORATE = 'doctorate'
}
```

## 🧪 Testes

### Cobertura de Testes
- **Controller**: Testes de endpoints e validações
- **Service**: Testes de lógica de negócio
- **DTOs**: Testes de validação de entrada
- **Guards**: Testes de autorização

### Cenários Testados
- Criação de usuários por tipo
- Validações de email institucional
- Controle de acesso por roles
- Alteração de senhas com segurança
- Filtros e paginação

## 🔄 Integração com Outros Módulos

### Dependências
- **Auth**: Sistema de autenticação
- **Loan**: Histórico de empréstimos
- **Fine**: Multas associadas
- **Reservation**: Reservas do usuário
- **Notification**: Envio de notificações

### Relacionamentos
```typescript
// Prisma Schema
model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  userType      UserType
  loans         Loan[]
  reservations  Reservation[]
  fines         Fine[]
  reviews       Review[]
  notifications Notification[]
}
```

## 📝 Exemplos de Uso

### Criar Estudante
```typescript
const newStudent = {
  name: "João Silva",
  email: "joao.silva@universidade.edu.br",
  userType: UserType.STUDENT,
  studentLevel: StudentLevel.UNDERGRADUATE,
  registration: "2024001001",
  phone: "(11) 99999-9999"
};
```

### Buscar com Filtros
```typescript
const filters = {
  userType: UserType.STUDENT,
  status: UserStatus.ACTIVE,
  studentLevel: StudentLevel.GRADUATE,
  search: "silva",
  page: 1,
  limit: 10
};
```

## 🚀 Melhorias Futuras

- [ ] Sistema de badges e conquistas
- [ ] Integração com sistemas acadêmicos externos
- [ ] Dashboard personalizado por usuário
- [ ] Sistema de mentoria entre usuários
- [ ] Análise de comportamento de uso
