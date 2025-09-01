# Recursos da Biblioteca Universitária

Este documento descreve os recursos criados para o sistema de biblioteca universitária.

## 📚 Módulos Criados

### 1. Material
- **Arquivo**: `src/modules/material/`
- **Funcionalidades**: Gerenciamento de materiais bibliográficos (livros, revistas, DVDs, etc.)
- **Status**: ✅ Criado

### 2. Loan (Empréstimo)
- **Arquivo**: `src/modules/loan/`
- **Funcionalidades**: Gerenciamento de empréstimos, renovações e devoluções
- **Status**: ✅ Criado

## 🏗️ Estrutura de Arquivos

### Enums (`src/enums/`)
- `material-status.enum.ts` - Status dos materiais (Disponível, Emprestado, Reservado, etc.)
- `material-type.enum.ts` - Tipos de materiais (Livro, Revista, DVD, etc.)
- `loan-status.enum.ts` - Status dos empréstimos (Ativo, Devolvido, Em Atraso, etc.)
- `reservation-status.enum.ts` - Status das reservas
- `fine-status.enum.ts` - Status das multas

### Interfaces (`src/interfaces/`)
- `material.interface.ts` - Interfaces para materiais
- `loan.interface.ts` - Interfaces para empréstimos
- `reservation.interface.ts` - Interfaces para reservas
- `fine.interface.ts` - Interfaces para multas
- `entities/` - Entidades do domínio

### Tipos (`src/types/`)
- `material.types.ts` - Tipos TypeScript para materiais
- `loan.types.ts` - Tipos TypeScript para empréstimos

### Constantes (`src/constants/`)
- `material.constants.ts` - Constantes de validação e configuração para materiais
- `loan.constants.ts` - Constantes de validação e configuração para empréstimos

### Utilitárias (`src/utils/`)
- `material.utils.ts` - Funções utilitárias para materiais
- `loan.utils.ts` - Funções utilitárias para empréstimos

### DTOs
- **Material**: `create-material.dto.ts`, `update-material.dto.ts`, `material-filters.dto.ts`, etc.
- **Loan**: `create-loan.dto.ts`, `update-loan.dto.ts`, `loan-filters.dto.ts`, etc.

## 🔧 Funcionalidades Implementadas

### Material
- ✅ Validação completa de dados
- ✅ Filtros de busca avançados
- ✅ Paginação e ordenação
- ✅ Cálculo de estatísticas
- ✅ Verificação de disponibilidade
- ✅ Geração de números de patrimônio
- ✅ Configurações por tipo de material

### Loan (Empréstimo)
- ✅ Validação de empréstimos
- ✅ Cálculo de datas de vencimento
- ✅ Verificação de atrasos
- ✅ Cálculo de multas
- ✅ Renovação de empréstimos
- ✅ Devolução de materiais
- ✅ Filtros e busca avançada
- ✅ Estatísticas e relatórios
- ✅ Configurações por tipo de usuário e material

## 📊 Enums Disponíveis

### MaterialStatus
- `AVAILABLE` - Disponível
- `LOANED` - Emprestado
- `RESERVED` - Reservado
- `MAINTENANCE` - Em Manutenção
- `LOST` - Perdido
- `DECOMMISSIONED` - Descomissionado

### MaterialType
- `BOOK` - Livro
- `MAGAZINE` - Revista
- `JOURNAL` - Jornal
- `DVD` - DVD
- `CD` - CD
- `THESIS` - Tese
- `DISSERTATION` - Dissertação
- `MONOGRAPH` - Monografia
- `ARTICLE` - Artigo
- `MAP` - Mapa
- `OTHER` - Outro

### LoanStatus
- `ACTIVE` - Ativo
- `RETURNED` - Devolvido
- `OVERDUE` - Em Atraso
- `RENEWED` - Renovado
- `CANCELLED` - Cancelado

## 🚀 Como Usar

### Importar Enums
```typescript
import { MaterialStatus, MaterialType, LoanStatus } from '../enums';
```

### Importar Interfaces
```typescript
import { IMaterial, ILoan, IMaterialResponse, ILoanResponse } from '../interfaces';
```

### Importar Utilitárias
```typescript
import { 
  validateMaterial, 
  formatMaterialResponse, 
  validateLoan, 
  calculateFineAmount 
} from '../utils';
```

### Importar Constantes
```typescript
import { 
  MATERIAL_VALIDATION_CONSTRAINTS, 
  LOAN_DEFAULT_CONFIG 
} from '../constants';
```

## 📝 Próximos Passos

1. **Implementar Controllers** - Criar endpoints REST para as operações
2. **Implementar Services** - Lógica de negócio para cada módulo
3. **Implementar Repositories** - Acesso aos dados via Prisma
4. **Implementar Testes** - Testes unitários e de integração
5. **Implementar Validações** - Validações de entrada e regras de negócio
6. **Implementar Auditoria** - Log de todas as operações
7. **Implementar Notificações** - Sistema de alertas para atrasos

## 🔍 Validações Implementadas

### Material
- Título obrigatório (1-500 caracteres)
- Autor obrigatório (1-255 caracteres)
- ISBN com formato válido (10 ou 13 dígitos)
- ISSN com formato válido (XXXX-XXXX)
- Ano de publicação válido
- Número de páginas válido (1-10000)
- Valor de aquisição válido (0-999999.99)

### Loan
- Usuário obrigatório
- Material obrigatório
- Data de vencimento futura
- Máximo de renovações válido (0-10)
- Observações com limite de caracteres

## 📈 Estatísticas Disponíveis

### Material
- Total por status
- Total por tipo
- Total por categoria
- Total por idioma
- Análise de disponibilidade

### Loan
- Total por status
- Empréstimos em atraso
- Duração média dos empréstimos
- Média de renovações
- Análise por mês

## 🎯 Configurações por Tipo

### Material
- Dias de empréstimo
- Máximo de renovações
- Possibilidade de reserva
- Dias de expiração da reserva

### Usuário
- Limite de empréstimos
- Dias de empréstimo
- Taxa de multa por atraso

## 🔐 Segurança e Auditoria

- Validação de entrada em todos os DTOs
- Log de todas as operações
- Controle de acesso por tipo de usuário
- Validação de regras de negócio
- Histórico de alterações

---

**Status**: ✅ Recursos básicos criados e estruturados
**Próxima etapa**: Implementar Controllers e Services
**Desenvolvedor**: Sistema de Biblioteca Universitária
**Data**: Janeiro 2025

