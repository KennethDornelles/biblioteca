# 📚 Biblioteca Universitária — Sistema de Gerenciamento Acadêmico (MVP v1)

## 🎯 Objetivo do Projeto

Biblioteca Universitária é um **sistema completo de gerenciamento de biblioteca acadêmica** com foco em:

* Gestão completa de usuários (estudantes, professores, funcionários)
* Controle de materiais (livros, periódicos, mídias digitais)
* Sistema de empréstimos e reservas com controle de prazos
* Gestão automática de multas e renovações
* Sistema de avaliações e reviews de materiais
* Interface administrativa completa e responsiva
* Backend escalável (NestJS + Prisma + PostgreSQL)
* Frontend moderno (Angular + Design System)

---

## 📁 Arquitetura

```
/biblioteca_universitaria
├── /frontend        # Angular SPA com Design System
├── /backend         # NestJS + Prisma + PostgreSQL
├── /docs            # Documentação técnica completa
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## ✅ Status Atual do Projeto

### 🚀 **Backend (100% Funcional)**

* ✅ **CRUD Completo**: Todos os módulos implementados
* ✅ **Sistema de Usuários**: Autenticação JWT e autorização por roles
* ✅ **Gestão de Materiais**: Catálogo completo com categorias
* ✅ **Sistema de Empréstimos**: Controle de prazos e renovações
* ✅ **Gestão de Multas**: Cálculo automático e controle de status
* ✅ **Sistema de Reservas**: Fila de espera para materiais
* ✅ **Reviews e Avaliações**: Sistema de feedback dos usuários
* ✅ **API REST**: 50+ endpoints disponíveis
* ✅ **Sistema de Auditoria**: Logs de operações implementado

### 🎨 **Frontend (Em Desenvolvimento)**

* 🚧 **Design System**: Em desenvolvimento
* 🚧 **Páginas Principais**: Login, Dashboard, Catálogo
* 🚧 **Componentes**: Sistema de componentes em construção
* ⚠️ **Funcionalidades**: Interface administrativa em desenvolvimento

---

## 🛠️ Tecnologias

### Frontend (Angular)

* Angular v20+ com Standalone Components
* Design System customizado (SCSS)
* PWA ready
* Deploy: Vercel ou Netlify

### Backend (NestJS + Prisma)

* NestJS v10+ (API REST)
* Prisma ORM + PostgreSQL
* **Módulos**: User, Material, Loan, Reservation, Review, Fine, SystemConfiguration
* JWT Authentication + Role-based access
* Sistema de auditoria integrado

### Infraestrutura

* Docker para desenvolvimento
* PostgreSQL (Railway/Render)
* Redis para cache e filas
* Deploy recomendado: Railway (backend) + Vercel (frontend)

---

## 🚀 Funcionalidades Implementadas

### 👤 **Gestão de Usuários**

* ✅ Registro e autenticação JWT
* ✅ Perfis com roles (STUDENT, TEACHER, LIBRARIAN, ADMIN)
* ✅ Sistema de permissões baseado em roles
* ✅ Controle de limites de empréstimo por tipo de usuário

### 📚 **Gestão de Materiais**

* ✅ Catálogo completo com categorias e subcategorias
* ✅ Controle de status (disponível, emprestado, reservado)
* ✅ Sistema de localização física
* ✅ Controle de aquisição e fornecedores

### 🔄 **Sistema de Empréstimos**

* ✅ Empréstimos com controle de prazos
* ✅ Sistema de renovações automáticas
* ✅ Controle de multas por atraso
* ✅ Histórico completo de transações

### 📋 **Sistema de Reservas**

* ✅ Fila de espera para materiais emprestados
* ✅ Notificações automáticas
* ✅ Controle de prioridade por tipo de usuário

### 💰 **Gestão de Multas**

* ✅ Cálculo automático de multas
* ✅ Controle de status de pagamento
* ✅ Sistema de isenções e descontos

---

## 📦 Desenvolvimento

### Pré-requisitos

* node >= 18
* npm >= 9
* docker >= 20
* postgresql >= 14

### Setup Inicial

```bash
# Clone do repositório
git clone [repo-url]
cd biblioteca_universitaria

# Backend setup
cd backend
npm install
cp .env.example .env  # Configure as variáveis
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev

# Frontend setup (nova aba)
cd ../frontend  
npm install
ng serve
```

### Docker (Alternativo)

```bash
# Backend com Docker
cd backend
docker build -t biblioteca-backend .
docker run -e DATABASE_URL=... -p 3000:3000 biblioteca-backend

# Ou use docker-compose (full stack)
docker-compose up -d
```

---

## 🧪 Testes

### Backend

```bash
cd backend
npm run test              # Unit tests
npm run test:e2e         # Integration tests
npm run test:cov         # Coverage report
npm run test:load        # Load testing
```

### Frontend

```bash
cd frontend
ng test                  # Unit tests
ng e2e                   # E2E tests
```

---

## 🏁 Deploy

### Backend (Railway)

```bash
# Via CLI
railway login
railway link [project-id]
railway up

# Variáveis necessárias:
# DATABASE_URL, JWT_SECRET, NODE_ENV=production
```

### Frontend (Vercel)

```bash
# Via CLI
vercel --prod

# Ou conecte GitHub + Auto-deploy
# Build Command: ng build
# Output Directory: dist/frontend
```

### Variáveis de Ambiente

```bash
# Backend (.env)
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=seu-jwt-secret-forte-aqui
NODE_ENV=production
PORT=3000
REDIS_URL=redis://localhost:6379

# Frontend (environment.prod.ts)
API_URL=https://seu-backend.up.railway.app
```

---

## 📚 Documentação

### 📖 Documentação Completa

Toda a documentação do projeto foi organizada na pasta `/docs`:

* **📋 Índice de Navegação** - Acesso rápido a todas as documentações
* **📚 README Completo** - Visão geral da documentação

### 🎯 Acesso Rápido por Área

| Área | Documentação Principal | Descrição |
|------|----------------------|-----------|
| 🎨 **Design** | [Design System](./design/DESIGN_SYSTEM.md) | Sistema de design e componentes |
| 🖥️ **Frontend** | [Status Frontend](./frontend/STATUS_FRONTEND.md) | Estado atual e funcionalidades |
| ⚙️ **Backend** | [Documentação Técnica](./backend/DOCUMENTACAO_TECNICA.md) | API, configuração e deploy |
| 🗄️ **Banco** | [Estrutura Banco](./backend/ESTRUTURA_BANCO.md) | Schema e relacionamentos |
| 🚀 **Setup** | [Configuração Inicial](./setup/CONFIGURACAO_INICIAL.md) | Primeiros passos e ambiente |

### 🚀 Para Novos Desenvolvedores

1. Comece com o [Índice de Navegação](./INDICE_NAVEGACAO.md)
2. Configure o ambiente seguindo a [Configuração Inicial](./setup/CONFIGURACAO_INICIAL.md)
3. Entenda a API através da [Documentação Técnica](./backend/DOCUMENTACAO_TECNICA.md)

---

## 🗺️ Roadmap

### 🚧 **Em Desenvolvimento**

* Interface administrativa completa
* Sistema de notificações por email
* Relatórios e analytics
* Dashboard de métricas

### 🔮 **Próximas Versões (V2)**

* Microsserviços (Notifications, Analytics)
* Sistema de cupons e promoções
* App mobile (React Native)
* Integração com sistemas acadêmicos
* Sistema de recomendação de materiais

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

Ver template: [PULL_REQUEST_TEMPLATE](./templates/PULL_REQUEST_TEMPLATE.md)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 🆘 Suporte

* **Issues**: GitHub Issues
* **Documentação**: Pasta `/docs`
* **Email**: contato@bibliotecauniversitaria.com

---

**Desenvolvido com 💕 para a Gestão Acadêmica** 📚
