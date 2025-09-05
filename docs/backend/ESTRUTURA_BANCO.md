# 🗄️ Estrutura do Banco de Dados - Biblioteca Universitária

## 🎯 Visão Geral

O sistema Biblioteca Universitária utiliza **PostgreSQL** como banco de dados principal, com **Prisma ORM** para gerenciamento de schema, migrações e queries. O banco é projetado para suportar operações de alta performance com relacionamentos bem definidos e índices estratégicos.

---

## 🏗️ Arquitetura do Banco

### **Características Principais**
- **SGBD**: PostgreSQL 14+
- **ORM**: Prisma 5.7.1
- **Padrão**: Relacional com normalização
- **Performance**: Índices otimizados e queries eficientes
- **Integridade**: Constraints e foreign keys
- **Backup**: Estratégia de backup automático

### **Estrutura de Camadas**
```
┌─────────────────────────────────────┐
│         Application Layer           │ ← NestJS Controllers
├─────────────────────────────────────┤
│         Prisma Client               │ ← ORM Layer
├─────────────────────────────────────┤
│         PostgreSQL                  │ ← Database Engine
├─────────────────────────────────────┤
│         Storage Layer               │ ← File System
└─────────────────────────────────────┘
```

---

## 📊 Schema do Banco

### **Modelo Principal - User (Usuários)**

```prisma
model User {
  id                 String        @id @default(cuid())
  name               String        @db.VarChar(255)
  email              String        @unique @db.VarChar(255)
  phone              String?       @db.VarChar(20)
  password           String        @db.VarChar(255)
  registrationDate   DateTime      @default(now())
  type               UserType
  active             Boolean       @default(true)
  registrationNumber String?       @unique @db.VarChar(20)
  course             String?       @db.VarChar(255)
  level              StudentLevel?
  department         String?       @db.VarChar(255)
  title              String?       @db.VarChar(100)
  admissionDate      DateTime?
  loanLimit          Int           @default(3)
  loanDays           Int           @default(7)
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt

  // Relacionamentos
  fines              Fine[]
  loansMade          Loan[]        @relation("LibrarianLoan")
  loans              Loan[]
  reservations       Reservation[]
  reviews            Review[]

  // Índices
  @@index([email])
  @@index([registrationNumber])
  @@index([type])
  @@index([active])
  @@map("users")
}
```

**Campos Principais:**
- **Identificação**: `id` (CUID), `email`, `registrationNumber`
- **Dados Pessoais**: `name`, `phone`, `course`, `department`
- **Acadêmicos**: `type`, `level`, `title`, `admissionDate`
- **Limites**: `loanLimit`, `loanDays`
- **Controle**: `active`, `createdAt`, `updatedAt`

### **Modelo - Material (Materiais)**

```prisma
model Material {
  id               String         @id @default(cuid())
  title            String         @db.VarChar(500)
  author           String         @db.VarChar(255)
  isbn             String?        @unique @db.VarChar(20)
  issn             String?        @unique @db.VarChar(20)
  publisher        String?        @db.VarChar(255)
  publicationYear  Int?
  edition          String?        @db.VarChar(50)
  category         String         @db.VarChar(100)
  subcategory      String?        @db.VarChar(100)
  location         String         @db.VarChar(50)
  status           MaterialStatus @default(AVAILABLE)
  type             MaterialType   @default(BOOK)
  numberOfPages    Int?
  language         String         @default("Português") @db.VarChar(50)
  description      String?
  keywords         String?
  assetNumber      String?        @unique @db.VarChar(20)
  acquisitionValue Decimal?       @db.Decimal(10, 2)
  acquisitionDate  DateTime?
  supplier         String?        @db.VarChar(255)
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt

  // Relacionamentos
  loans            Loan[]
  reservations     Reservation[]
  reviews          Review[]

  // Índices
  @@index([title])
  @@index([author])
  @@index([isbn])
  @@index([category])
  @@index([status])
  @@index([type])
  @@index([location])
  @@map("materials")
}
```

**Campos Principais:**
- **Identificação**: `id`, `isbn`, `issn`, `assetNumber`
- **Conteúdo**: `title`, `author`, `description`, `keywords`
- **Metadados**: `publisher`, `publicationYear`, `edition`, `language`
- **Classificação**: `category`, `subcategory`, `type`
- **Controle**: `status`, `location`, `acquisitionValue`

### **Modelo - Loan (Empréstimos)**

```prisma
model Loan {
  id           String     @id @default(cuid())
  userId       String
  materialId   String
  librarianId  String?
  loanDate     DateTime   @default(now())
  dueDate      DateTime
  returnDate   DateTime?
  renewalDate  DateTime?
  status       LoanStatus @default(ACTIVE)
  renewals     Int        @default(0)
  maxRenewals  Int        @default(2)
  observations String?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  // Relacionamentos
  fines        Fine[]
  librarian    User?      @relation("LibrarianLoan", fields: [librarianId], references: [id])
  material     Material   @relation(fields: [materialId], references: [id])
  user         User       @relation(fields: [userId], references: [id])

  // Índices
  @@index([userId])
  @@index([materialId])
  @@index([status])
  @@index([dueDate])
  @@index([loanDate])
  @@map("loans")
}
```

**Campos Principais:**
- **Identificação**: `id`, `userId`, `materialId`, `librarianId`
- **Datas**: `loanDate`, `dueDate`, `returnDate`, `renewalDate`
- **Controle**: `status`, `renewals`, `maxRenewals`
- **Observações**: `observations`

### **Modelo - Reservation (Reservas)**

```prisma
model Reservation {
  id           String            @id @default(cuid())
  userId       String
  materialId   String
  reservationDate DateTime       @default(now())
  expiryDate   DateTime
  status       ReservationStatus @default(PENDING)
  priority     Int               @default(1)
  notes        String?
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt

  // Relacionamentos
  user         User              @relation(fields: [userId], references: [id])
  material     Material          @relation(fields: [materialId], references: [id])

  // Índices
  @@index([userId])
  @@index([materialId])
  @@index([status])
  @@index([expiryDate])
  @@index([priority])
  @@map("reservations")
}
```

### **Modelo - Fine (Multas)**

```prisma
model Fine {
  id           String     @id @default(cuid())
  userId       String
  loanId       String
  amount       Decimal    @db.Decimal(10, 2)
  reason       String     @db.VarChar(255)
  status       FineStatus @default(PENDING)
  dueDate      DateTime
  paidDate     DateTime?
  discount     Decimal?   @db.Decimal(10, 2)
  observations String?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  // Relacionamentos
  user         User       @relation(fields: [userId], references: [id])
  loan         Loan       @relation(fields: [loanId], references: [id])

  // Índices
  @@index([userId])
  @@index([loanId])
  @@index([status])
  @@index([dueDate])
  @@map("fines")
}
```

### **Modelo - Review (Avaliações)**

```prisma
model Review {
  id           String   @id @default(cuid())
  userId       String
  materialId   String
  rating       Int      @db.Int
  comment      String?  @db.Text
  approved     Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relacionamentos
  user         User     @relation(fields: [userId], references: [id])
  material     Material @relation(fields: [materialId], references: [id])

  // Índices
  @@index([userId])
  @@index([materialId])
  @@index([rating])
  @@index([approved])
  @@map("reviews")
}
```

---

## 🔗 Relacionamentos e Constraints

### **Relacionamentos Principais**

#### **User ↔ Loan (1:N)**
- Um usuário pode ter múltiplos empréstimos
- Constraint: `ON DELETE RESTRICT` (não permite deletar usuário com empréstimos ativos)

#### **Material ↔ Loan (1:N)**
- Um material pode ser emprestado múltiplas vezes
- Constraint: `ON DELETE RESTRICT` (não permite deletar material com empréstimos ativos)

#### **User ↔ Review (1:N)**
- Um usuário pode fazer múltiplas avaliações
- Constraint: `ON DELETE CASCADE` (deleta avaliações quando usuário é removido)

#### **Material ↔ Review (1:N)**
- Um material pode ter múltiplas avaliações
- Constraint: `ON DELETE CASCADE` (deleta avaliações quando material é removido)

#### **Loan ↔ Fine (1:N)**
- Um empréstimo pode gerar múltiplas multas
- Constraint: `ON DELETE CASCADE` (deleta multas quando empréstimo é removido)

### **Constraints de Integridade**

```sql
-- Exemplo de constraint para limite de empréstimos
ALTER TABLE loans 
ADD CONSTRAINT check_user_loan_limit 
CHECK (
  (SELECT COUNT(*) FROM loans l2 
   WHERE l2.userId = loans.userId 
   AND l2.status = 'ACTIVE') <= 
  (SELECT loanLimit FROM users WHERE id = loans.userId)
);

-- Constraint para data de vencimento
ALTER TABLE loans 
ADD CONSTRAINT check_due_date 
CHECK (dueDate > loanDate);

-- Constraint para rating de avaliação
ALTER TABLE reviews 
ADD CONSTRAINT check_rating_range 
CHECK (rating >= 1 AND rating <= 5);
```

---

## 📈 Índices e Performance

### **Índices Primários**
- **Primary Keys**: Todos os modelos têm `id` como chave primária
- **Unique Indexes**: `email`, `isbn`, `issn`, `assetNumber`, `registrationNumber`

### **Índices Secundários (Performance)**

#### **User Table**
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(type);
CREATE INDEX idx_users_active ON users(active);
CREATE INDEX idx_users_registration_number ON users(registration_number);
```

#### **Material Table**
```sql
CREATE INDEX idx_materials_title ON materials(title);
CREATE INDEX idx_materials_author ON materials(author);
CREATE INDEX idx_materials_category ON materials(category);
CREATE INDEX idx_materials_status ON materials(status);
CREATE INDEX idx_materials_type ON materials(type);
CREATE INDEX idx_materials_location ON materials(location);
```

#### **Loan Table**
```sql
CREATE INDEX idx_loans_user_id ON loans(user_id);
CREATE INDEX idx_loans_material_id ON loans(material_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loans_due_date ON loans(due_date);
CREATE INDEX idx_loans_loan_date ON loans(loan_date);
CREATE INDEX idx_loans_user_status ON loans(user_id, status);
```

#### **Reservation Table**
```sql
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_material_id ON reservations(material_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_expiry_date ON reservations(expiry_date);
CREATE INDEX idx_reservations_priority ON reservations(priority);
```

#### **Fine Table**
```sql
CREATE INDEX idx_fines_user_id ON fines(user_id);
CREATE INDEX idx_fines_loan_id ON fines(loan_id);
CREATE INDEX idx_fines_status ON fines(status);
CREATE INDEX idx_fines_due_date ON fines(due_date);
CREATE INDEX idx_fines_user_status ON fines(user_id, status);
```

### **Índices Compostos (Multi-column)**
```sql
-- Índice composto para busca eficiente de empréstimos por usuário e status
CREATE INDEX idx_loans_user_status ON loans(user_id, status);

-- Índice composto para busca de materiais por categoria e status
CREATE INDEX idx_materials_category_status ON materials(category, status);

-- Índice composto para busca de reservas por material e prioridade
CREATE INDEX idx_reservations_material_priority ON reservations(material_id, priority);
```

---

## 🗂️ Estrutura de Arquivos

### **Organização do Prisma**
```
src/database/
├── schema.prisma           # Schema principal
├── migrations/             # Migrações do banco
│   ├── 20250901180239_initial_database/
│   │   └── migration.sql
│   └── 20250901191034_migrate_structure/
│       └── migration.sql
├── seed.ts                 # Dados iniciais
└── database.config.ts      # Configuração de conexão
```

### **Arquivo de Configuração**
```typescript
// database.config.ts
export const databaseConfig = {
  url: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production',
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
};
```

---

## 🔄 Migrações e Versionamento

### **Sistema de Migrações**
```bash
# Gerar nova migração
npx prisma migrate dev --name add_new_feature

# Aplicar migrações em produção
npx prisma migrate deploy

# Reset do banco (desenvolvimento)
npx prisma migrate reset

# Ver status das migrações
npx prisma migrate status
```

### **Estrutura de Migração**
```sql
-- Exemplo de migração
-- Migration: 20250115000000_add_user_preferences

-- AlterTable
ALTER TABLE "users" ADD COLUMN "preferences" JSONB;

-- CreateIndex
CREATE INDEX "idx_users_preferences" ON "users" USING GIN ("preferences");
```

---

## 🌱 Seed Data e Dados Iniciais

### **Arquivo de Seed**
```typescript
// seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criar tipos de usuário
  const userTypes = ['STUDENT', 'TEACHER', 'LIBRARIAN', 'ADMIN'];
  
  // Criar categorias de materiais
  const categories = [
    'Ciências Exatas',
    'Ciências Humanas',
    'Tecnologia',
    'Literatura',
    'Periódicos'
  ];

  // Criar usuário admin padrão
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@biblioteca.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@biblioteca.com',
      password: '$2a$10$...', // Hash da senha
      type: 'ADMIN',
      active: true,
    },
  });

  console.log('Seed data criado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 📊 Monitoramento e Manutenção

### **Queries de Monitoramento**

#### **Verificar Performance**
```sql
-- Verificar queries lentas
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Verificar uso de índices
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes 
ORDER BY idx_scan DESC;

-- Verificar tamanho das tabelas
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### **Verificar Integridade**
```sql
-- Verificar foreign keys órfãs
SELECT l.user_id, l.id as loan_id
FROM loans l
LEFT JOIN users u ON l.user_id = u.id
WHERE u.id IS NULL;

-- Verificar empréstimos em atraso
SELECT 
  u.name,
  m.title,
  l.due_date,
  l.loan_date
FROM loans l
JOIN users u ON l.user_id = u.id
JOIN materials m ON l.material_id = m.id
WHERE l.status = 'ACTIVE' 
AND l.due_date < CURRENT_DATE;
```

### **Manutenção Automática**
```sql
-- Vacuum e analyze automático
VACUUM ANALYZE;

-- Reindexar tabelas
REINDEX TABLE users;
REINDEX TABLE materials;
REINDEX TABLE loans;

-- Atualizar estatísticas
ANALYZE;
```

---

## 🔒 Segurança e Backup

### **Políticas de Segurança**
- **Acesso**: Apenas usuários autorizados
- **Backup**: Diário automático
- **Logs**: Auditoria de todas as operações
- **Criptografia**: Senhas hasheadas com bcrypt

### **Estratégia de Backup**
```bash
# Backup completo
pg_dump -h localhost -U username -d biblioteca > backup_$(date +%Y%m%d).sql

# Backup incremental
pg_dump -h localhost -U username -d biblioteca --data-only > data_backup_$(date +%Y%m%d).sql

# Restore
psql -h localhost -U username -d biblioteca < backup_file.sql
```

---

## 📚 Recursos Adicionais

### **Ferramentas de Desenvolvimento**
- **Prisma Studio**: Interface visual para o banco
- **pgAdmin**: Administração PostgreSQL
- **DBeaver**: Cliente universal de banco

### **Documentação Relacionada**
- [Documentação Técnica](./DOCUMENTACAO_TECNICA.md)
- [Configuração de Ambiente](./CONFIGURACAO_AMBIENTE.md)
- [Testes](./TESTES.md)

---

**Última atualização**: Janeiro 2025  
**Versão**: 1.0.0  
**Responsável**: Equipe de Backend
