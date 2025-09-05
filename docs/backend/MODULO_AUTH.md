# Módulo de Autenticação

Este módulo implementa um sistema completo de autenticação JWT para a API da Biblioteca Universitária.

## Funcionalidades

- **Login**: Autenticação com email e senha
- **Logout**: Encerramento de sessão
- **Refresh Token**: Renovação de tokens de acesso
- **Proteção de Rotas**: Guards para controle de acesso
- **Controle de Roles**: Sistema de permissões baseado em tipos de usuário

## Estrutura do Módulo

```
auth/
├── auth.module.ts              # Módulo principal
├── auth.service.ts             # Serviço de autenticação
├── auth.controller.ts          # Controller com endpoints
├── strategies/                 # Estratégias de autenticação
│   ├── jwt.strategy.ts        # Estratégia JWT padrão
│   ├── jwt-refresh.strategy.ts # Estratégia JWT para refresh
│   └── local.strategy.ts      # Estratégia local (email/senha)
├── guards/                     # Guards de proteção
│   ├── jwt-auth.guard.ts      # Guard JWT principal
│   ├── local-auth.guard.ts    # Guard local
│   └── roles.guard.ts         # Guard de controle de roles
├── decorators/                 # Decorators personalizados
│   ├── roles.decorator.ts     # Decorator para definir roles
│   └── current-user.decorator.ts # Decorator para usuário atual
├── dto/                        # Data Transfer Objects
│   ├── login.dto.ts           # DTO para login
│   ├── login-response.dto.ts  # DTO para resposta de login
│   ├── refresh-token.dto.ts   # DTO para refresh
│   ├── refresh-response.dto.ts # DTO para resposta de refresh
│   └── logout-response.dto.ts # DTO para resposta de logout
└── README.md                   # Esta documentação
```

## Endpoints

### POST /auth/login
Realiza o login do usuário.

**Request Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "Nome do Usuário",
    "email": "usuario@exemplo.com",
    "type": "STUDENT",
    "active": true
  }
}
```

### POST /auth/refresh
Renova os tokens de acesso usando o refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "accessToken": "novo_access_token",
  "refreshToken": "novo_refresh_token"
}
```

### POST /auth/logout
Realiza o logout do usuário (requer autenticação).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Logout realizado com sucesso",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET /auth/profile
Obtém o perfil do usuário autenticado.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "user_id",
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "type": "STUDENT",
  "active": true,
  "registrationDate": "2024-01-01T00:00:00.000Z",
  "phone": "+5511999999999",
  "registrationNumber": "2024001",
  "course": "Ciência da Computação",
  "level": "GRADUATE",
  "department": "Instituto de Computação",
  "title": null,
  "admissionDate": "2024-01-01T00:00:00.000Z",
  "loanLimit": 3,
  "loanDays": 7,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Guards e Proteção de Rotas

### JwtAuthGuard
Protege rotas que requerem autenticação JWT válida.

```typescript
@UseGuards(JwtAuthGuard)
@Get('protected-route')
async protectedMethod() {
  // Apenas usuários autenticados podem acessar
}
```

### RolesGuard
Controla acesso baseado em tipos de usuário.

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserType.ADMIN, UserType.LIBRARIAN)
@Get('admin-only')
async adminMethod() {
  // Apenas administradores e bibliotecários podem acessar
}
```

### Tipos de Usuário Suportados
- `ADMIN`: Administrador do sistema
- `LIBRARIAN`: Bibliotecário
- `PROFESSOR`: Professor
- `STUDENT`: Estudante

## Decorators

### @Roles()
Define quais tipos de usuário podem acessar um endpoint.

```typescript
@Roles(UserType.ADMIN, UserType.LIBRARIAN)
async method() {
  // Método protegido por roles
}
```

### @CurrentUser()
Extrai o usuário atual do request.

```typescript
@Get('my-profile')
@UseGuards(JwtAuthGuard)
async getMyProfile(@CurrentUser() user: any) {
  // user contém os dados do usuário autenticado
  return this.userService.findById(user.sub);
}
```

## Configuração

### Variáveis de Ambiente
```env
JWT_SECRET=sua_chave_secreta_aqui_mude_em_producao
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
PASSWORD_MIN_LENGTH=6
PASSWORD_MAX_LENGTH=50
```

### Configuração do Módulo
```typescript
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '15m') 
        },
      }),
      inject: [ConfigService],
    }),
  ],
  // ... resto da configuração
})
```

## Segurança

### Tokens JWT
- **Access Token**: Expira em 15 minutos (configurável)
- **Refresh Token**: Expira em 7 dias (configurável)
- **Secret**: Chave secreta configurável via variável de ambiente

### Criptografia de Senhas
- **Algoritmo**: bcryptjs
- **Salt Rounds**: 12 (configurável)
- **Hash**: Senhas são sempre hasheadas antes de salvar no banco

### Validações
- **Email**: Formato válido de email
- **Senha**: Mínimo 6 caracteres, máximo 50
- **Usuário Ativo**: Apenas usuários ativos podem fazer login

## Uso em Outros Módulos

### Protegendo Controllers
```typescript
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../../enums';

@Controller('materials')
export class MaterialController {
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.LIBRARIAN)
  @ApiBearerAuth()
  async create(@Body() createMaterialDto: CreateMaterialDto) {
    // Apenas administradores e bibliotecários podem criar materiais
  }
}
```

### Acessando Usuário Autenticado
```typescript
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Get('my-loans')
@UseGuards(JwtAuthGuard)
async getMyLoans(@CurrentUser() user: any) {
  return this.loanService.findByUserId(user.sub);
}
```

## Testes

O módulo inclui testes unitários abrangentes para:
- Validação de usuários
- Processo de login
- Refresh de tokens
- Logout
- Obtenção de perfil
- Tratamento de erros

Para executar os testes:
```bash
npm run test auth.service.spec.ts
```

## Dependências

- `@nestjs/jwt`: Serviço JWT
- `@nestjs/passport`: Integração com Passport.js
- `passport-jwt`: Estratégia JWT para Passport
- `passport-local`: Estratégia local para Passport
- `bcryptjs`: Criptografia de senhas
- `class-validator`: Validação de DTOs
- `@nestjs/swagger`: Documentação da API

## Fluxo de Autenticação

1. **Login**: Usuário fornece email e senha
2. **Validação**: Sistema verifica credenciais e status do usuário
3. **Geração de Tokens**: Sistema gera access e refresh tokens
4. **Acesso**: Usuário usa access token para acessar rotas protegidas
5. **Refresh**: Quando access token expira, usuário usa refresh token para obter novos tokens
6. **Logout**: Usuário pode fazer logout (em implementação futura, tokens podem ser invalidados)

## Melhorias Futuras

- [ ] Blacklist de tokens invalidados
- [ ] Rate limiting para tentativas de login
- [ ] Logs de auditoria para ações de autenticação
- [ ] Suporte a autenticação de dois fatores (2FA)
- [ ] Integração com OAuth2/OpenID Connect
- [ ] Cache de permissões de usuário
- [ ] Middleware de logging para requests autenticados
