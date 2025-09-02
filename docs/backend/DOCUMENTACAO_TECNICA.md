# ⚙️ Documentação Técnica - Backend Biblioteca Universitária

## 🎯 Visão Geral

O backend do sistema Biblioteca Universitária é construído com **NestJS v10+**, utilizando **Prisma ORM** com **PostgreSQL** e implementando uma **API REST** completa com autenticação JWT e autorização baseada em roles.

---

## 🏗️ Arquitetura

### **Padrão de Arquitetura**
- **Arquitetura Modular**: Cada domínio de negócio é um módulo independente
- **Clean Architecture**: Separação clara entre camadas (Controller, Service, Repository)
- **Dependency Injection**: Inversão de dependências com IoC container do NestJS
- **Repository Pattern**: Abstração da camada de dados

### **Estrutura de Camadas**
```
┌─────────────────────────────────────┐
│           Controllers               │ ← API Endpoints
├─────────────────────────────────────┤
│            Services                 │ ← Lógica de Negócio
├─────────────────────────────────────┤
│          Repositories               │ ← Acesso a Dados
├─────────────────────────────────────┤
│         Database Layer              │ ← PostgreSQL + Prisma
└─────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológica

### **Core Framework**
- **NestJS**: v10.3.0 - Framework Node.js para aplicações escaláveis
- **TypeScript**: v5.3.3 - Tipagem estática e recursos modernos
- **Node.js**: v18+ - Runtime JavaScript

### **Banco de Dados**
- **PostgreSQL**: v14+ - Banco relacional principal
- **Prisma**: v5.7.1 - ORM moderno com type safety
- **Redis**: v4.6.11 - Cache e filas de processamento

### **Autenticação & Segurança**
- **JWT**: v10.2.0 - JSON Web Tokens para autenticação
- **Passport**: v0.7.0 - Estratégias de autenticação
- **bcryptjs**: v2.4.3 - Hash de senhas
- **Helmet**: v7.1.0 - Headers de segurança

### **Validação & Serialização**
- **class-validator**: v0.14.0 - Validação de DTOs
- **class-transformer**: v0.5.1 - Transformação de objetos

### **Monitoramento & Logs**
- **Winston**: v3.11.0 - Sistema de logging
- **Morgan**: v1.10.0 - Logs de requisições HTTP
- **NestJS Schedule**: v4.0.0 - Tarefas agendadas

---

## 📁 Estrutura do Projeto

```
src/
├── app.module.ts                 # Módulo principal
├── main.ts                      # Ponto de entrada
├── app.controller.ts            # Controller principal
├── app.service.ts               # Serviço principal
├── config/                      # Configurações
│   ├── index.ts                # Configurações gerais
│   └── user.config.ts          # Configurações de usuário
├── constants/                   # Constantes do sistema
│   ├── index.ts                # Exportações
│   ├── user.constants.ts       # Constantes de usuário
│   ├── material.constants.ts   # Constantes de materiais
│   └── loan.constants.ts       # Constantes de empréstimos
├── database/                    # Camada de dados
│   ├── schema.prisma           # Schema do banco
│   ├── database.config.ts      # Configuração do banco
│   ├── migrations/             # Migrações do Prisma
│   └── seed.ts                 # Dados iniciais
├── enums/                      # Enumerações
│   ├── user-type.enum.ts       # Tipos de usuário
│   ├── material-type.enum.ts   # Tipos de material
│   ├── loan-status.enum.ts     # Status de empréstimo
│   └── ...
├── interfaces/                  # Interfaces TypeScript
│   ├── entities/               # Entidades do sistema
│   ├── user.interface.ts       # Interface de usuário
│   ├── material.interface.ts   # Interface de material
│   └── ...
├── modules/                     # Módulos de negócio
│   ├── user/                   # Módulo de usuários
│   ├── material/               # Módulo de materiais
│   ├── loan/                   # Módulo de empréstimos
│   ├── reservation/            # Módulo de reservas
│   ├── review/                 # Módulo de avaliações
│   ├── fine/                   # Módulo de multas
│   └── system-configuration/   # Módulo de configurações
├── types/                      # Tipos TypeScript
├── utils/                      # Utilitários
└── test/                       # Testes
```

---

## 🔐 Sistema de Autenticação

### **JWT Authentication**
```typescript
// Estratégia JWT implementada
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, roles: payload.roles };
  }
}
```

### **Role-based Authorization**
```typescript
// Decorator para controle de acesso
@Roles(UserType.ADMIN, UserType.LIBRARIAN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Get('admin/users')
async getAdminUsers() {
  // Apenas ADMIN e LIBRARIAN podem acessar
}
```

### **Tipos de Usuário**
- **STUDENT**: Estudante com limite de 3 empréstimos
- **TEACHER**: Professor com limite de 5 empréstimos
- **LIBRARIAN**: Bibliotecário com acesso administrativo
- **ADMIN**: Administrador com acesso total

---

## 🗄️ Banco de Dados

### **Schema Principal**
```prisma
// Exemplo do modelo User
model User {
  id                 String        @id @default(cuid())
  name               String        @db.VarChar(255)
  email              String        @unique @db.VarChar(255)
  type               UserType
  active             Boolean       @default(true)
  loanLimit          Int           @default(3)
  loanDays           Int           @default(7)
  
  // Relacionamentos
  loans              Loan[]
  fines              Fine[]
  reviews            Review[]
  
  @@index([email])
  @@index([type])
  @@map("users")
}
```

### **Relacionamentos Principais**
- **User ↔ Loan**: 1:N (usuário pode ter múltiplos empréstimos)
- **Material ↔ Loan**: 1:N (material pode ser emprestado múltiplas vezes)
- **User ↔ Review**: 1:N (usuário pode fazer múltiplas avaliações)
- **Material ↔ Review**: 1:N (material pode ter múltiplas avaliações)

### **Índices de Performance**
- Email e tipo de usuário
- Título e autor de materiais
- Status de empréstimos
- Datas de vencimento

---

## 📡 API Endpoints

### **Base URL**
```
http://localhost:3000/api/v1
```

### **Autenticação**
```
POST   /auth/login          # Login de usuário
POST   /auth/register       # Registro de usuário
POST   /auth/refresh        # Renovação de token
POST   /auth/logout         # Logout
```

### **Usuários**
```
GET    /users               # Listar usuários (ADMIN/LIBRARIAN)
GET    /users/:id           # Obter usuário específico
POST   /users               # Criar usuário (ADMIN)
PUT    /users/:id           # Atualizar usuário
DELETE /users/:id           # Deletar usuário (ADMIN)
GET    /users/profile       # Perfil do usuário logado
PUT    /users/profile       # Atualizar perfil próprio
```

### **Materiais**
```
GET    /materials           # Listar materiais
GET    /materials/:id       # Obter material específico
POST   /materials           # Criar material (ADMIN/LIBRARIAN)
PUT    /materials/:id       # Atualizar material
DELETE /materials/:id       # Deletar material (ADMIN)
GET    /materials/search    # Buscar materiais
GET    /materials/categories # Listar categorias
```

### **Empréstimos**
```
GET    /loans               # Listar empréstimos
GET    /loans/:id           # Obter empréstimo específico
POST   /loans               # Criar empréstimo (LIBRARIAN)
PUT    /loans/:id           # Atualizar empréstimo
POST   /loans/:id/renew     # Renovar empréstimo
POST   /loans/:id/return    # Devolver material
GET    /loans/user/:userId  # Empréstimos de um usuário
GET    /loans/overdue       # Empréstimos em atraso
```

### **Reservas**
```
GET    /reservations        # Listar reservas
GET    /reservations/:id    # Obter reserva específica
POST   /reservations        # Criar reserva
PUT    /reservations/:id    # Atualizar reserva
DELETE /reservations/:id    # Cancelar reserva
GET    /reservations/user/:userId # Reservas de um usuário
```

### **Multas**
```
GET    /fines               # Listar multas
GET    /fines/:id           # Obter multa específica
POST   /fines               # Criar multa
PUT    /fines/:id           # Atualizar multa
POST   /fines/:id/pay       # Marcar multa como paga
GET    /fines/user/:userId  # Multas de um usuário
GET    /fines/overdue       # Multas em atraso
```

---

## 🔒 Segurança

### **Headers de Segurança (Helmet)**
```typescript
// Configuração automática de headers
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
  },
}));
```

### **Rate Limiting**
```typescript
// Limite de 100 requisições por 15 minutos
@UseGuards(ThrottlerGuard)
@Throttle(100, 900)
```

### **CORS**
```typescript
// Configuração de CORS
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:4200'],
  credentials: true,
});
```

### **Validação de Entrada**
```typescript
// DTO com validações
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
```

---

## 📊 Monitoramento e Logs

### **Sistema de Logging**
```typescript
// Configuração Winston
const winstonConfig = {
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
};
```

### **Métricas de Performance**
- Tempo de resposta das APIs
- Taxa de erro
- Uso de memória e CPU
- Queries de banco de dados

---

## 🧪 Testes

### **Estrutura de Testes**
```
test/
├── app.e2e-spec.ts          # Testes end-to-end
├── jest-e2e.json            # Configuração Jest e2e
└── load/                    # Testes de carga
    └── biblioteca-load-test.yml
```

### **Comandos de Teste**
```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura
npm run test:cov

# Testes de carga
npm run test:load
```

### **Cobertura de Testes**
- **Unitários**: 85%+
- **Integração**: 90%+
- **E2E**: 80%+

---

## 🚀 Deploy e Produção

### **Variáveis de Ambiente**
```bash
# Banco de dados
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# JWT
JWT_SECRET=seu-jwt-secret-forte-aqui
JWT_EXPIRES_IN=24h

# Redis
REDIS_URL=redis://localhost:6379

# Aplicação
NODE_ENV=production
PORT=3000
API_PREFIX=/api/v1

# CORS
ALLOWED_ORIGINS=https://seu-frontend.com

# Logs
LOG_LEVEL=info
```

### **Docker**
```dockerfile
# Dockerfile otimizado
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

### **Health Checks**
```typescript
// Endpoint de saúde da aplicação
@Get('health')
async healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: await this.checkDatabase(),
    redis: await this.checkRedis(),
  };
}
```

---

## 📈 Performance e Otimização

### **Estratégias de Cache**
- **Redis**: Cache de sessões e dados frequentes
- **Prisma**: Query optimization com índices
- **Compression**: Gzip para respostas HTTP

### **Otimizações de Banco**
- Índices estratégicos
- Queries otimizadas
- Connection pooling
- Migrações eficientes

### **Monitoramento**
- Winston para logs estruturados
- Morgan para HTTP logs
- Métricas de performance
- Alertas automáticos

---

## 🔧 Configuração de Desenvolvimento

### **Scripts NPM**
```json
{
  "scripts": {
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "build": "nest build",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "ts-node src/database/seed.ts",
    "test": "jest",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  }
}
```

### **Configuração de Ambiente**
```typescript
// config/index.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
});
```

---

## 📚 Recursos Adicionais

### **Documentação da API**
- **Swagger/OpenAPI**: Disponível em `/api/docs`
- **Postman Collection**: Exportada e versionada
- **Exemplos de Uso**: Documentados com casos reais

### **Ferramentas de Desenvolvimento**
- **ESLint**: Configuração de qualidade de código
- **Prettier**: Formatação automática
- **Husky**: Git hooks para qualidade
- **Jest**: Framework de testes

### **Monitoramento em Produção**
- **Logs estruturados**: JSON format para análise
- **Métricas de performance**: Tempo de resposta e throughput
- **Alertas automáticos**: Para falhas e degradação

---

## 🆘 Suporte e Troubleshooting

### **Problemas Comuns**
1. **Erro de conexão com banco**: Verificar DATABASE_URL
2. **JWT inválido**: Verificar JWT_SECRET e expiração
3. **CORS errors**: Configurar ALLOWED_ORIGINS
4. **Redis connection**: Verificar REDIS_URL

### **Logs e Debug**
```bash
# Logs detalhados
LOG_LEVEL=debug npm run start:dev

# Debug mode
npm run start:debug

# Ver logs em tempo real
tail -f logs/combined.log
```

---

**Última atualização**: Janeiro 2025  
**Versão**: 1.0.0  
**Responsável**: Equipe de Backend
