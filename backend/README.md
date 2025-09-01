# 📚 Biblioteca Universitária API

Sistema de Gerenciamento de Biblioteca Universitária - API REST desenvolvida com NestJS e Prisma.

## 🚀 Tecnologias

- **Backend**: NestJS 10.x (LTS)
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Autenticação**: JWT + Passport
- **Validação**: Class-validator + Class-transformer
- **Logging**: Winston
- **Testes**: Jest
- **Linting**: ESLint + Prettier
- **Hooks Git**: Husky + Lint-staged

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 12.0
- Redis >= 6.0 (opcional)

## 🛠️ Instalação

### Opção 1: Usando Docker (Recomendado)

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd biblioteca_universitaria/backend
```

2. **Inicie os serviços com Docker Compose**
```bash
docker-compose up -d
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env
# O arquivo .env já está configurado para Docker
```

4. **Execute as migrações e seed**
```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### Opção 2: Instalação Local

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd biblioteca_universitaria/backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Configure o banco de dados PostgreSQL**
```bash
# Crie o banco de dados PostgreSQL
createdb biblioteca_universitaria

# Execute as migrações
npm run prisma:migrate

# Gere o cliente Prisma
npm run prisma:generate

# Popule o banco com dados iniciais
npm run prisma:seed
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `env.example`:

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/biblioteca_universitaria"

# Aplicação
PORT=3000
NODE_ENV=development

# Segurança
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=24h

# Redis
REDIS_URL=redis://localhost:6379

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app
```

## 🚀 Executando o Projeto

### Desenvolvimento
```bash
npm run start:dev
```

### Produção
```bash
npm run build
npm run start:prod
```

### Testes
```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:cov

# Executar testes e2e
npm run test:e2e
```

## 📊 Estrutura do Banco de Dados

### Modelos Principais

- **Usuario**: Alunos, professores, bibliotecários e administradores
- **Material**: Livros, revistas, DVDs, teses, etc.
- **Emprestimo**: Controle de empréstimos e devoluções
- **Reserva**: Sistema de reservas de materiais
- **Multa**: Controle de multas por atraso
- **Avaliacao**: Sistema de avaliação dos materiais
- **ConfiguracaoSistema**: Configurações flexíveis do sistema

### Tipos de Usuário

- **ALUNO**: Estudantes com limites específicos
- **PROFESSOR**: Docentes com privilégios estendidos
- **BIBLIOTECARIO**: Funcionários da biblioteca
- **ADMIN**: Administradores do sistema
- **FUNCIONARIO**: Outros funcionários

### Status dos Materiais

- **DISPONIVEL**: Disponível para empréstimo
- **EMPRESTADO**: Atualmente emprestado
- **RESERVADO**: Reservado por outro usuário
- **MANUTENCAO**: Em manutenção
- **PERDIDO**: Material perdido
- **BAIXADO**: Material baixado do acervo

## 🔐 Autenticação e Autorização

- **JWT**: Tokens de acesso e refresh
- **Passport**: Estratégias de autenticação
- **Roles**: Controle de acesso baseado em tipo de usuário
- **Rate Limiting**: Proteção contra abuso da API

## 📝 API Endpoints

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/refresh` - Renovar token
- `POST /auth/logout` - Logout

### Usuários
- `GET /usuarios` - Listar usuários
- `POST /usuarios` - Criar usuário
- `GET /usuarios/:id` - Obter usuário
- `PUT /usuarios/:id` - Atualizar usuário
- `DELETE /usuarios/:id` - Deletar usuário

### Materiais
- `GET /materiais` - Listar materiais
- `POST /materiais` - Cadastrar material
- `GET /materiais/:id` - Obter material
- `PUT /materiais/:id` - Atualizar material
- `DELETE /materiais/:id` - Deletar material

### Empréstimos
- `GET /emprestimos` - Listar empréstimos
- `POST /emprestimos` - Realizar empréstimo
- `PUT /emprestimos/:id/devolver` - Devolver material
- `PUT /emprestimos/:id/renovar` - Renovar empréstimo

### Reservas
- `GET /reservas` - Listar reservas
- `POST /reservas` - Criar reserva
- `PUT /reservas/:id` - Atualizar reserva
- `DELETE /reservas/:id` - Cancelar reserva

## 🧪 Testes

O projeto inclui uma suíte completa de testes:

- **Unitários**: Testes de componentes individuais
- **Integração**: Testes de serviços e repositórios
- **E2E**: Testes end-to-end da API
- **Cobertura**: Meta de 80% de cobertura

## 📚 Comandos Úteis

### Prisma
```bash
# Gerar cliente Prisma
npm run prisma:generate

# Executar migrações
npm run prisma:migrate

# Abrir Prisma Studio
npm run prisma:studio

# Reset do banco
npm run prisma:reset

# Seed do banco
npm run prisma:seed
```

### Desenvolvimento
```bash
# Linting
npm run lint

# Formatação
npm run format

# Build
npm run build

# Start em desenvolvimento
npm run start:dev
```

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # Aplicação principal
├── auth/                   # Autenticação e autorização
├── usuarios/               # Módulo de usuários
├── materiais/              # Módulo de materiais
├── emprestimos/            # Módulo de empréstimos
├── reservas/               # Módulo de reservas
├── multas/                 # Módulo de multas
├── avaliacoes/             # Módulo de avaliações
├── configuracao/           # Módulo de configuração
├── common/                 # Utilitários e decorators
└── shared/                 # Recursos compartilhados
```

## 🔒 Segurança

- **Helmet**: Headers de segurança HTTP
- **Rate Limiting**: Proteção contra ataques de força bruta
- **Validação**: Validação de entrada com class-validator
- **Sanitização**: Limpeza de dados de entrada
- **Logs**: Auditoria completa de ações

## 📈 Monitoramento

- **Winston**: Sistema de logs estruturado
- **Morgan**: Logs de requisições HTTP
- **Métricas**: Coleta de métricas de performance

## 🚀 Deploy

### Docker

#### Usando Docker Compose (Recomendado)
```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Rebuild e reiniciar
docker-compose up -d --build
```

#### Usando Docker diretamente
```bash
# Build da imagem
docker build -t biblioteca-api .

# Executar container
docker run -p 3000:3000 biblioteca-api
```

### Produção
```bash
# Build de produção
npm run build

# Start de produção
npm run start:prod
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Desenvolvedores**: Equipe de Desenvolvimento
- **Contato**: [email@exemplo.com]

## 📞 Suporte

Para suporte, envie um email para [suporte@exemplo.com] ou abra uma issue no repositório.

---

**Desenvolvido com ❤️ pela Equipe de Desenvolvimento**
