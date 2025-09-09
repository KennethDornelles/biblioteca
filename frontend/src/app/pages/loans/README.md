# Páginas de Empréstimos

Este diretório contém as páginas relacionadas ao gerenciamento de empréstimos da biblioteca universitária.

## Componentes Implementados

### 1. LoansComponent (`loans.component.ts`)
- **Rota**: `/loans`
- **Funcionalidades**:
  - Listagem de empréstimos com paginação
  - Filtros por status (Ativos, Devolvidos, Atrasados, Perdidos)
  - Estatísticas em tempo real
  - Ações: visualizar, editar, devolver e excluir empréstimos
  - Busca e filtros avançados

### 2. LoanDetailComponent (`loan-detail.component.ts`)
- **Rota**: `/loans/:id`
- **Funcionalidades**:
  - Visualização detalhada do empréstimo
  - Timeline do empréstimo
  - Informações do material e usuário
  - Estatísticas de duração e atraso
  - Ações: editar, devolver e excluir

### 3. LoanFormComponent (`loan-form.component.ts`)
- **Rotas**: `/loans/new` e `/loans/:id/edit`
- **Funcionalidades**:
  - Criação de novos empréstimos
  - Edição de empréstimos existentes
  - Busca de materiais e usuários
  - Validação de formulários
  - Interface responsiva

## Serviços Utilizados

### LoanService (`../../services/loan.service.ts`)
- Gerenciamento completo de empréstimos
- Operações CRUD
- Filtros e paginação
- Integração com API backend

## Funcionalidades Principais

### ✅ Implementadas
- [x] Listagem de empréstimos com paginação
- [x] Filtros por status e período
- [x] Visualização detalhada
- [x] Criação de empréstimos
- [x] Edição de empréstimos
- [x] Devolução de empréstimos
- [x] Exclusão de empréstimos
- [x] Estatísticas em tempo real
- [x] Interface responsiva
- [x] Validação de formulários
- [x] Busca de materiais e usuários

### 🔄 Em Desenvolvimento
- [ ] Notificações de vencimento
- [ ] Relatórios de empréstimos
- [ ] Histórico detalhado
- [ ] Integração com sistema de multas

## Estrutura de Arquivos

```
loans/
├── loans.component.ts          # Listagem principal
├── loans.component.html        # Template da listagem
├── loans.component.scss        # Estilos da listagem
├── README.md                   # Esta documentação
└── index.ts                    # Exports

../loan-detail/
├── loan-detail.component.ts    # Detalhes do empréstimo
├── loan-detail.component.html  # Template dos detalhes
└── loan-detail.component.scss  # Estilos dos detalhes

../loan-form/
├── loan-form.component.ts      # Formulário de empréstimo
├── loan-form.component.html    # Template do formulário
└── loan-form.component.scss    # Estilos do formulário
```

## Integração com Backend

As páginas de empréstimos se integram com o backend através do `LoanService`, que consome os seguintes endpoints:

- `GET /api/loan` - Listar empréstimos
- `GET /api/loan/:id` - Obter empréstimo específico
- `POST /api/loan` - Criar empréstimo
- `PATCH /api/loan/:id` - Atualizar empréstimo
- `DELETE /api/loan/:id` - Excluir empréstimo

## Status dos Empréstimos

- **ACTIVE**: Empréstimo ativo
- **RETURNED**: Empréstimo devolvido
- **OVERDUE**: Empréstimo em atraso
- **LOST**: Material perdido

## Responsividade

Todas as páginas são totalmente responsivas e funcionam em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (até 767px)

## Próximos Passos

1. Implementar notificações push para vencimentos
2. Adicionar relatórios e exportação de dados
3. Integrar com sistema de multas
4. Implementar histórico detalhado de empréstimos
5. Adicionar funcionalidades de busca avançada
