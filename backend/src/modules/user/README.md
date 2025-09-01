# Módulo de Usuários

Este módulo gerencia todos os usuários do sistema de biblioteca universitária, incluindo estudantes, professores, bibliotecários, administradores e funcionários.

## Funcionalidades

### Operações CRUD Básicas
- ✅ **Criar usuário** - `POST /users`
- ✅ **Listar usuários** - `GET /users` (com filtros e paginação)
- ✅ **Buscar usuário por ID** - `GET /users/:id`
- ✅ **Atualizar usuário** - `PATCH /users/:id`
- ✅ **Excluir usuário** - `DELETE /users/:id`

### Operações Específicas
- ✅ **Buscar por email** - `GET /users/email/:email`
- ✅ **Buscar por tipo** - `GET /users/type/:type`
- ✅ **Buscar por curso** - `GET /users/course/:course`
- ✅ **Buscar por departamento** - `GET /users/department/:department`
- ✅ **Alterar senha** - `PATCH /users/:id/change-password`
- ✅ **Ativar usuário** - `PATCH /users/:id/activate`
- ✅ **Desativar usuário** - `PATCH /users/:id/deactivate`

## Tipos de Usuário

### 1. Estudante (STUDENT)
**Campos obrigatórios:**
- `name` - Nome completo
- `email` - Email único
- `password` - Senha
- `type` - Deve ser "STUDENT"
- `registrationNumber` - Número de matrícula único
- `course` - Curso
- `level` - Nível acadêmico (UNDERGRADUATE, POSTGRADUATE, MASTERS, DOCTORATE, TECHNICAL)

**Campos opcionais:**
- `phone` - Telefone
- `active` - Status ativo (padrão: true)
- `loanLimit` - Limite de empréstimos (padrão: 3)
- `loanDays` - Dias de empréstimo (padrão: 7)

### 2. Professor (PROFESSOR)
**Campos obrigatórios:**
- `name` - Nome completo
- `email` - Email único
- `password` - Senha
- `type` - Deve ser "PROFESSOR"
- `department` - Departamento
- `title` - Título acadêmico

**Campos opcionais:**
- `phone` - Telefone
- `active` - Status ativo (padrão: true)
- `admissionDate` - Data de admissão
- `loanLimit` - Limite de empréstimos (padrão: 3)
- `loanDays` - Dias de empréstimo (padrão: 7)

### 3. Bibliotecário (LIBRARIAN)
**Campos obrigatórios:**
- `name` - Nome completo
- `email` - Email único
- `password` - Senha
- `type` - Deve ser "LIBRARIAN"

**Campos opcionais:**
- `phone` - Telefone
- `active` - Status ativo (padrão: true)
- `admissionDate` - Data de admissão
- `loanLimit` - Limite de empréstimos (padrão: 3)
- `loanDays` - Dias de empréstimo (padrão: 7)

### 4. Administrador (ADMIN)
**Campos obrigatórios:**
- `name` - Nome completo
- `email` - Email único
- `password` - Senha
- `type` - Deve ser "ADMIN"

**Campos opcionais:**
- `phone` - Telefone
- `active` - Status ativo (padrão: true)
- `admissionDate` - Data de admissão
- `loanLimit` - Limite de empréstimos (padrão: 3)
- `loanDays` - Dias de empréstimo (padrão: 7)

### 5. Funcionário (STAFF)
**Campos obrigatórios:**
- `name` - Nome completo
- `email` - Email único
- `password` - Senha
- `type` - Deve ser "STAFF"

**Campos opcionais:**
- `phone` - Telefone
- `active` - Status ativo (padrão: true)
- `admissionDate` - Data de admissão
- `loanLimit` - Limite de empréstimos (padrão: 3)
- `loanDays` - Dias de empréstimo (padrão: 7)

## Exemplos de Uso

### Criar um Estudante
```json
POST /users
{
  "name": "João Silva",
  "email": "joao.silva@email.com",
  "password": "senha123",
  "type": "STUDENT",
  "registrationNumber": "2023001",
  "course": "Ciência da Computação",
  "level": "UNDERGRADUATE",
  "phone": "(11) 99999-9999"
}
```

### Criar um Professor
```json
POST /users
{
  "name": "Maria Santos",
  "email": "maria.santos@email.com",
  "password": "senha123",
  "type": "PROFESSOR",
  "department": "Departamento de Computação",
  "title": "Doutor",
  "admissionDate": "2023-01-15"
}
```

### Listar Usuários com Filtros
```
GET /users?page=1&limit=10&type=STUDENT&active=true&course=Ciência da Computação
```

### Alterar Senha
```json
PATCH /users/:id/change-password
{
  "currentPassword": "senha123",
  "newPassword": "novaSenha123",
  "confirmPassword": "novaSenha123"
}
```

## Validações

### Validações de Negócio
- ✅ Email deve ser único
- ✅ Número de matrícula deve ser único (para estudantes)
- ✅ Estudantes devem ter curso e nível acadêmico
- ✅ Professores devem ter departamento e título
- ✅ Não é possível excluir usuários com empréstimos ativos
- ✅ Não é possível excluir usuários com reservas ativas

### Validações de Dados
- ✅ Nome: 2-255 caracteres
- ✅ Email: formato válido, 5-255 caracteres
- ✅ Senha: mínimo 6 caracteres
- ✅ Telefone: 10-20 caracteres
- ✅ Limite de empréstimos: 1-10
- ✅ Dias de empréstimo: 1-30

## Respostas

### Sucesso
- **201** - Usuário criado
- **200** - Operação realizada com sucesso
- **204** - Usuário excluído

### Erro
- **400** - Dados inválidos ou regras de negócio violadas
- **404** - Usuário não encontrado
- **409** - Conflito (email ou matrícula já existe)

## Segurança

- ✅ Senhas são criptografadas com bcrypt (salt rounds: 10)
- ✅ Validação de entrada com class-validator
- ✅ Sanitização de dados
- ✅ Validação de UUID para IDs
- ✅ Verificação de permissões (a ser implementado)

## Testes

O módulo inclui testes unitários para:
- ✅ UserService
- ✅ UserController
- ✅ Validações de DTOs
- ✅ Casos de sucesso e erro

Para executar os testes:
```bash
npm run test src/modules/user
```

## Dependências

- `@nestjs/common` - Framework NestJS
- `@prisma/client` - Cliente Prisma ORM
- `bcryptjs` - Criptografia de senhas
- `class-validator` - Validação de DTOs
- `@nestjs/swagger` - Documentação da API

## Estrutura de Arquivos

```
src/modules/user/
├── dto/
│   ├── create-user.dto.ts
│   ├── update-user.dto.ts
│   ├── user-response.dto.ts
│   ├── change-password.dto.ts
│   ├── user-filters.dto.ts
│   └── paginated-users.dto.ts
├── entities/
│   └── user.entity.ts
├── enums/
│   ├── user-type.enum.ts
│   ├── student-level.enum.ts
│   ├── user-status.enum.ts
│   └── index.ts
├── interfaces/
│   └── user.interface.ts
├── types/
│   └── user.types.ts
├── constants/
│   └── user.constants.ts
├── utils/
│   ├── user.utils.ts
│   └── index.ts
├── config/
│   ├── user.config.ts
│   └── index.ts
├── user.controller.ts
├── user.service.ts
├── user.module.ts
├── user.service.spec.ts
├── user.controller.spec.ts
├── index.ts
└── README.md
```

## Arquivos de Suporte

### Enums
- **`user-type.enum.ts`** - Tipos de usuário (STUDENT, PROFESSOR, etc.)
- **`student-level.enum.ts`** - Níveis acadêmicos (UNDERGRADUATE, MASTERS, etc.)
- **`user-status.enum.ts`** - Status de usuário (ACTIVE, INACTIVE, etc.)

### Interfaces
- **`user.interface.ts`** - Interfaces TypeScript para tipagem

### Types
- **`user.types.ts`** - Tipos TypeScript avançados e unions

### Constants
- **`user.constants.ts`** - Constantes de validação, mensagens e configurações

### Utils
- **`user.utils.ts`** - Funções utilitárias para validação, formatação e lógica de negócio

### Config
- **`user.config.ts`** - Configurações de validação, segurança e sistema

## Uso dos Arquivos de Suporte

### Importando Enums
```typescript
import { UserType, StudentLevel, UserStatus } from '../enums';
```

### Importando Interfaces
```typescript
import { IUser, ICreateUser, IUserResponse } from '../interfaces/user.interface';
```

### Importando Utilitários
```typescript
import { 
  validateRequiredFields, 
  formatUserName, 
  canUserBorrow 
} from '../utils';
```

### Importando Constantes
```typescript
import { 
  USER_DEFAULTS, 
  USER_ERROR_MESSAGES, 
  USER_SUCCESS_MESSAGES 
} from '../constants/user.constants';
```

### Importando Configurações
```typescript
import { 
  PASSWORD_VALIDATION_CONFIG, 
  SECURITY_CONFIG 
} from '../config';
```
