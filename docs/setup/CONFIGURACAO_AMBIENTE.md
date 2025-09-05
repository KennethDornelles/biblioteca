# 🔧 Configuração das Variáveis de Ambiente

## 📋 Arquivos de Configuração Disponíveis

### 1. `env.complete` - Configuração Completa
Arquivo com todas as variáveis de ambiente possíveis para desenvolvimento local.

### 2. `docker.env` - Configuração para Docker
Arquivo com variáveis de ambiente otimizadas para execução em containers Docker.

### 3. `env.example` - Exemplo Básico
Arquivo de exemplo com as variáveis essenciais.

## 🚀 Configuração Rápida

### Para Desenvolvimento Local
```bash
# Copie o arquivo completo
cp env.complete .env

# Ou copie o exemplo básico
cp env.example .env
```

### Para Docker
```bash
# O docker-compose.yml já está configurado para usar docker.env
docker-compose up -d
```

## 🔑 Variáveis Essenciais para Banco de Dados

### PostgreSQL (Desenvolvimento Local)
```env
DATABASE_URL="postgresql://biblioteca:123456@localhost:5433/biblioteca_universitaria"
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_NAME=biblioteca_universitaria
DATABASE_USER=biblioteca
DATABASE_PASSWORD=123456
```

### PostgreSQL (Docker)
```env
DATABASE_URL="postgresql://biblioteca:123456@postgres:5432/biblioteca_universitaria"
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=biblioteca_universitaria
DATABASE_USER=biblioteca
DATABASE_PASSWORD=123456
```

## 🔒 Variáveis de Segurança

```env
JWT_SECRET=sua_chave_secreta_aqui_mude_em_producao
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=refresh_secret_aqui
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
PASSWORD_MIN_LENGTH=8
```

## 📧 Configuração de Email

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app
SMTP_FROM=noreply@biblioteca.edu.br
SMTP_FROM_NAME="Biblioteca Universitária"
```

## 🚨 Variáveis que DEVEM ser alteradas em Produção

1. **JWT_SECRET** - Chave secreta para tokens JWT
2. **JWT_REFRESH_SECRET** - Chave secreta para refresh tokens
3. **DATABASE_PASSWORD** - Senha do banco de dados
4. **SMTP_PASS** - Senha do servidor de email
5. **SESSION_SECRET** - Chave secreta para sessões

## 🔍 Verificação da Configuração

### Testar Conexão com Banco
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### Testar Aplicação
```bash
npm run build
npm run start:dev
```

## 📚 Arquivos de Configuração TypeScript

### `config/index.ts` - Configuração Principal
Importa todas as configurações específicas.

### `database.config.ts` - Configuração do Banco
Configurações específicas para PostgreSQL.

### `redis.config.ts` - Configuração do Redis
Configurações específicas para Redis.

### `security.config.ts` - Configuração de Segurança
Configurações de JWT, senhas, CORS, etc.

### `app.config.ts` - Configuração da Aplicação
Configurações gerais da aplicação.

## 🐳 Configuração com Docker

O ambiente foi configurado para usar o Docker e o Docker Compose, com separação clara entre os ambientes de desenvolvimento e produção.

### Para Desenvolvimento

1.  **Variáveis de Ambiente:**
    *   Copie o arquivo `env.example` para `docker.env` (se ainda não existir).
    *   Preencha as variáveis em `docker.env` com as configurações para o banco de dados e outras ferramentas.

2.  **Executando o Ambiente:**
    *   No diretório `backend`, execute o comando:
        ```bash
        docker-compose up
        ```
    *   O Docker Compose utilizará os arquivos `docker-compose.yml` e `docker-compose.override.yml` para construir a imagem de desenvolvimento (`Dockerfile.dev`) e iniciar os serviços. A aplicação principal (`api`) iniciará em modo de desenvolvimento com hot-reload.

### Para Produção

1.  **Variáveis de Ambiente:**
    *   Crie um arquivo `.env.prod` no diretório `backend`.
    *   Preencha este arquivo com as variáveis de ambiente de produção (senhas fortes, chaves secretas diferentes do desenvolvimento, etc.).

2.  **Executando o Ambiente:**
    *   Para construir a imagem de produção e iniciar os contêineres, utilize o comando:
        ```bash
        docker-compose -f docker-compose.prod.yml up --build -d
        ```
    *   Isso usará o `Dockerfile` principal (otimizado para produção) e o `docker-compose.prod.yml`. O script `entrypoint.sh` garantirá que as migrações do banco de dados (`prisma migrate deploy`) sejam executadas antes de iniciar a aplicação.

## 🔧 Troubleshooting

### Erro de Conexão com Banco
1. Verifique se o container PostgreSQL está rodando
2. Confirme a porta (5433 para local, 5432 para Docker)
3. Verifique as credenciais no arquivo .env

### Erro de Variáveis de Ambiente
1. Confirme se o arquivo .env existe
2. Verifique se não há espaços extras nas variáveis
3. Reinicie a aplicação após alterações

### Erro de Permissões
1. Verifique se o arquivo .env tem permissões corretas
2. Confirme se o usuário tem acesso ao diretório

## 📝 Exemplo de .env Mínimo

```env
# Banco de Dados
DATABASE_URL="postgresql://biblioteca:123456@localhost:5433/biblioteca_universitaria"

# Aplicação
PORT=3000
NODE_ENV=development

# Segurança
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=24h

# Redis
REDIS_URL=redis://localhost:6379
```
