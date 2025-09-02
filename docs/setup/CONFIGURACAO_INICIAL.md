# 🚀 Configuração Inicial - Biblioteca Universitária

## 🎯 Visão Geral

Este guia fornece instruções passo a passo para configurar o ambiente de desenvolvimento do projeto Biblioteca Universitária, incluindo backend (NestJS + Prisma + PostgreSQL) e frontend (Angular).

---

## 📋 Pré-requisitos

### **Sistema Operacional**
- ✅ **Windows**: 10/11 (64-bit)
- ✅ **macOS**: 10.15+ (Catalina)
- ✅ **Linux**: Ubuntu 18.04+, CentOS 7+, Debian 9+

### **Software Necessário**
- **Node.js**: v18.0.0 ou superior
- **npm**: v9.0.0 ou superior
- **Git**: v2.30.0 ou superior
- **PostgreSQL**: v14.0 ou superior
- **Redis**: v6.0 ou superior (opcional para desenvolvimento)

### **Ferramentas Recomendadas**
- **VS Code**: Editor principal
- **Postman**: Teste de APIs
- **pgAdmin**: Administração PostgreSQL
- **Docker Desktop**: Containerização

---

## 🔧 Instalação de Dependências

### **1. Node.js e npm**

#### **Windows**
```bash
# Baixar e instalar do site oficial
# https://nodejs.org/en/download/

# Verificar instalação
node --version
npm --version
```

#### **macOS**
```bash
# Usando Homebrew
brew install node

# Verificar instalação
node --version
npm --version
```

#### **Linux (Ubuntu/Debian)**
```bash
# Adicionar repositório NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Instalar Node.js
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

### **2. Git**

#### **Windows**
```bash
# Baixar e instalar do site oficial
# https://git-scm.com/download/win

# Verificar instalação
git --version
```

#### **macOS**
```bash
# Usando Homebrew
brew install git

# Verificar instalação
git --version
```

#### **Linux**
```bash
# Ubuntu/Debian
sudo apt-get install git

# CentOS/RHEL
sudo yum install git

# Verificar instalação
git --version
```

### **3. PostgreSQL**

#### **Windows**
```bash
# Baixar e instalar do site oficial
# https://www.postgresql.org/download/windows/

# Durante a instalação:
# - Porta: 5432
# - Senha: postgres (ou sua preferida)
# - Locale: Default
```

#### **macOS**
```bash
# Usando Homebrew
brew install postgresql

# Iniciar serviço
brew services start postgresql

# Criar usuário
createuser -s postgres
```

#### **Linux (Ubuntu/Debian)**
```bash
# Instalar PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Iniciar serviço
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Mudar para usuário postgres
sudo -u postgres psql

# Criar usuário e banco
CREATE USER postgres WITH SUPERUSER PASSWORD 'postgres';
CREATE DATABASE biblioteca_universitaria;
\q
```

### **4. Redis (Opcional)**

#### **Windows**
```bash
# Usar WSL2 ou Docker
docker run -d -p 6379:6379 redis:alpine
```

#### **macOS**
```bash
# Usando Homebrew
brew install redis

# Iniciar serviço
brew services start redis
```

#### **Linux**
```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# Iniciar serviço
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

---

## 📥 Clone do Repositório

### **1. Clonar o Projeto**
```bash
# Clonar repositório
git clone https://github.com/seu-usuario/biblioteca_universitaria.git

# Entrar no diretório
cd biblioteca_universitaria

# Verificar estrutura
ls -la
```

### **2. Configurar Branch de Desenvolvimento**
```bash
# Verificar branches disponíveis
git branch -a

# Mudar para branch de desenvolvimento
git checkout develop

# Verificar status
git status
```

---

## ⚙️ Configuração do Backend

### **1. Instalar Dependências**
```bash
# Entrar no diretório backend
cd backend

# Instalar dependências
npm install

# Verificar instalação
npm list --depth=0
```

### **2. Configurar Variáveis de Ambiente**
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar arquivo .env
# Windows
notepad .env

# macOS/Linux
nano .env
```

#### **Conteúdo do .env**
```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/biblioteca_universitaria"

# JWT
JWT_SECRET="seu-jwt-secret-super-secreto-aqui"
JWT_EXPIRES_IN="24h"

# Redis
REDIS_URL="redis://localhost:6379"

# Application
NODE_ENV="development"
PORT=3000
API_PREFIX="/api/v1"

# CORS
ALLOWED_ORIGINS="http://localhost:4200"

# Logs
LOG_LEVEL="debug"
```

### **3. Configurar Banco de Dados**
```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate dev --name init

# Executar seed (dados iniciais)
npx prisma db seed

# Verificar banco
npx prisma studio
```

### **4. Testar Backend**
```bash
# Iniciar em modo desenvolvimento
npm run start:dev

# Em outra aba, testar API
curl http://localhost:3000/api/v1/health
```

---

## 🎨 Configuração do Frontend

### **1. Instalar Dependências**
```bash
# Voltar para raiz do projeto
cd ..

# Entrar no diretório frontend
cd frontend

# Instalar dependências
npm install

# Verificar instalação
npm list --depth=0
```

### **2. Configurar Variáveis de Ambiente**
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar arquivo .env
# Windows
notepad .env

# macOS/Linux
nano .env
```

#### **Conteúdo do .env**
```bash
# API Configuration
API_URL=http://localhost:3000/api/v1

# Environment
NODE_ENV=development
```

### **3. Testar Frontend**
```bash
# Iniciar servidor de desenvolvimento
npm start

# Abrir no navegador
# http://localhost:4200
```

---

## 🐳 Configuração com Docker (Alternativa)

### **1. Instalar Docker**
```bash
# Baixar e instalar Docker Desktop
# https://www.docker.com/products/docker-desktop

# Verificar instalação
docker --version
docker-compose --version
```

### **2. Usar Docker Compose**
```bash
# Na raiz do projeto
cd biblioteca_universitaria

# Iniciar serviços
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f
```

### **3. Configurar Backend para Docker**
```bash
# Editar .env do backend
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/biblioteca_universitaria"
REDIS_URL="redis://redis:6379"
```

---

## 🧪 Verificação da Instalação

### **1. Testes do Backend**
```bash
cd backend

# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura
npm run test:cov
```

### **2. Testes do Frontend**
```bash
cd frontend

# Testes unitários
npm test

# Testes e2e
npm run e2e
```

### **3. Verificar Funcionalidades**
```bash
# Backend rodando
curl http://localhost:3000/api/v1/health

# Frontend rodando
# http://localhost:4200

# Banco de dados
npx prisma studio

# Redis (se configurado)
redis-cli ping
```

---

## 🔧 Configurações Adicionais

### **1. VS Code Extensions**
```json
// .vscode/extensions.json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-json",
    "ms-vscode.vscode-markdown",
    "ms-vscode.vscode-docker",
    "ms-azuretools.vscode-docker"
  ]
}
```

### **2. Configuração do Git**
```bash
# Configurar usuário
git config user.name "Seu Nome"
git config user.email "seu-email@exemplo.com"

# Configurar editor padrão
git config core.editor "code --wait"

# Configurar template de commit
git config commit.template .gitmessage
```

### **3. Configuração do npm**
```bash
# Configurar registry
npm config set registry https://registry.npmjs.org/

# Configurar scripts globais
npm install -g @nestjs/cli
npm install -g @angular/cli
npm install -g prisma
```

---

## 🚨 Troubleshooting

### **Problemas Comuns**

#### **Erro de Conexão com PostgreSQL**
```bash
# Verificar se o serviço está rodando
# Windows
services.msc

# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# Verificar porta
netstat -an | grep 5432
```

#### **Erro de Conexão com Redis**
```bash
# Verificar se o serviço está rodando
# Windows
docker ps | grep redis

# macOS
brew services list | grep redis

# Linux
sudo systemctl status redis-server
```

#### **Erro de Porta em Uso**
```bash
# Verificar portas em uso
# Windows
netstat -an | findstr :3000

# macOS/Linux
lsof -i :3000

# Matar processo
# Windows
taskkill /PID [PID] /F

# macOS/Linux
kill -9 [PID]
```

#### **Erro de Dependências**
```bash
# Limpar cache npm
npm cache clean --force

# Remover node_modules
rm -rf node_modules
rm package-lock.json

# Reinstalar
npm install
```

---

## 📚 Próximos Passos

### **1. Explorar o Projeto**
- [ ] Ler [README.md](../README.md)
- [ ] Explorar [Índice de Navegação](../INDICE_NAVEGACAO.md)
- [ ] Entender [Status do Projeto](../PROJECT_STATUS.md)

### **2. Configurar Desenvolvimento**
- [ ] Configurar IDE/Editor
- [ ] Configurar Git hooks
- [ ] Configurar linting e formatação

### **3. Primeira Contribuição**
- [ ] Escolher uma issue
- [ ] Criar branch de feature
- [ ] Implementar solução
- [ ] Criar Pull Request

---

## 🆘 Suporte

### **Canais de Ajuda**
- **Issues**: GitHub Issues
- **Documentação**: Pasta `/docs`
- **Chat**: [Link para chat da equipe]

### **Recursos Úteis**
- [NestJS Documentation](https://docs.nestjs.com/)
- [Angular Documentation](https://angular.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## ✅ Checklist de Verificação

### **Ambiente Base**
- [ ] Node.js v18+ instalado
- [ ] npm v9+ instalado
- [ ] Git instalado
- [ ] PostgreSQL instalado e rodando
- [ ] Redis instalado (opcional)

### **Projeto**
- [ ] Repositório clonado
- [ ] Dependências instaladas
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados configurado
- [ ] Migrações executadas

### **Funcionalidades**
- [ ] Backend rodando na porta 3000
- [ ] Frontend rodando na porta 4200
- [ ] API respondendo corretamente
- [ ] Banco de dados acessível
- [ ] Testes passando

---

**🎉 Parabéns! Seu ambiente de desenvolvimento está configurado e pronto para uso!**

**Próximo passo**: Explore a [documentação do projeto](../README.md) e comece a contribuir!
