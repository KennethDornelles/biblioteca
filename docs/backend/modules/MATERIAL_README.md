# 📚 Módulo Material

Sistema completo de gerenciamento de materiais bibliográficos para a biblioteca universitária.

## 📋 Visão Geral

O módulo Material é responsável pelo gerenciamento completo do acervo bibliográfico, incluindo livros, revistas, DVDs, teses e outros tipos de materiais. Oferece funcionalidades de catalogação, busca avançada, controle de disponibilidade e estatísticas do acervo.

## 🏗️ Estrutura do Módulo

```
src/modules/material/
├── dto/
│   ├── create-material.dto.ts      # DTO para cadastro de material
│   ├── update-material.dto.ts      # DTO para atualização
│   ├── material-filters.dto.ts     # DTO para filtros de busca
│   ├── material-response.dto.ts    # DTO para resposta
│   ├── paginated-materials.dto.ts  # DTO para paginação
│   └── index.ts                    # Exportações
├── entities/
│   ├── material.entity.ts          # Entidade Material com Swagger
│   └── index.ts                    # Exportações
├── material.controller.ts          # Controlador REST com Swagger
├── material.service.ts             # Serviço com lógica de negócio
├── material.module.ts              # Módulo NestJS
└── index.ts                        # Exportações do módulo
```

## 🎯 Funcionalidades

### ✅ CRUD Completo
- **Catalogar material**: Cadastro com validações específicas por tipo
- **Listar materiais**: Paginação, filtros avançados e ordenação
- **Buscar material**: Por título, autor, ISBN, palavra-chave
- **Atualizar material**: Atualizações parciais com validação
- **Remover material**: Soft delete com verificação de empréstimos

### ✅ Gestão de Acervo
- **Controle de disponibilidade**: Status em tempo real
- **Número de patrimônio**: Geração automática
- **Categorização**: Por tipo, área do conhecimento, localização
- **Reservas**: Sistema integrado de reservas
- **Histórico**: Log completo de movimentações

### ✅ Tipos de Material
- **Livro**: Físico e digital
- **Revista/Periódico**: Edições e volumes
- **DVD/CD**: Materiais audiovisuais
- **Tese/Dissertação**: Trabalhos acadêmicos
- **Artigo**: Papers e publicações
- **Mapa**: Materiais cartográficos

### ✅ Busca Avançada
- **Filtros múltiplos**: Tipo, status, autor, categoria
- **Busca textual**: Full-text search em títulos e descrições
- **Ordenação**: Por relevância, data, autor, título
- **Facetas**: Agrupamento por critérios

## 📊 Endpoints da API

### Materiais
```typescript
POST   /materials                    # Catalogar material
GET    /materials                    # Listar materiais (paginado)
GET    /materials/:id                # Buscar por ID
GET    /materials/search/:term       # Busca avançada
PATCH  /materials/:id                # Atualizar material
DELETE /materials/:id                # Remover material

# Disponibilidade
GET    /materials/:id/availability   # Verificar disponibilidade
POST   /materials/:id/reserve        # Fazer reserva
GET    /materials/:id/history        # Histórico do material

# Estatísticas
GET    /materials/statistics         # Estatísticas do acervo
GET    /materials/popular            # Materiais mais populares
```

## 🔧 DTOs e Validações

### CreateMaterialDto
```typescript
{
  title: string;              // Título (1-500 chars)
  author: string;             // Autor principal (1-255 chars)
  additionalAuthors?: string[]; // Autores adicionais
  isbn?: string;              // ISBN válido (10 ou 13 dígitos)
  issn?: string;              // ISSN válido (XXXX-XXXX)
  materialType: MaterialType; // BOOK | MAGAZINE | DVD | etc.
  category: string;           // Categoria/Área do conhecimento
  publisher?: string;         // Editora
  publishYear?: number;       // Ano de publicação (1500-atual)
  pages?: number;             // Número de páginas (1-10000)
  language: string;           // Idioma (PT | EN | ES | etc.)
  location: string;           // Localização física na biblioteca
  acquisitionValue?: number;  // Valor de aquisição
  condition: string;          // Estado de conservação
  summary?: string;           // Resumo/Sinopse
  keywords?: string[];        // Palavras-chave
}
```

### MaterialFiltersDto
```typescript
{
  materialType?: MaterialType;
  status?: MaterialStatus;
  category?: string;
  language?: string;
  location?: string;
  author?: string;
  publishYear?: number;
  availableOnly?: boolean;    // Apenas disponíveis
  search?: string;            // Busca textual
  startDate?: Date;           // Filtro por data de cadastro
  endDate?: Date;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}
```

## 🔐 Segurança e Autorização

### Permissões por Endpoint
- **Catalogar material**: Admin, Bibliotecário
- **Listar materiais**: Todos os usuários
- **Atualizar material**: Admin, Bibliotecário
- **Remover material**: Apenas Admin
- **Estatísticas**: Admin, Bibliotecário

## 📈 Enums Relacionados

### MaterialType
```typescript
enum MaterialType {
  BOOK = 'book',
  MAGAZINE = 'magazine',
  JOURNAL = 'journal',
  DVD = 'dvd',
  CD = 'cd',
  THESIS = 'thesis',
  DISSERTATION = 'dissertation',
  MONOGRAPH = 'monograph',
  ARTICLE = 'article',
  MAP = 'map',
  OTHER = 'other'
}
```

### MaterialStatus
```typescript
enum MaterialStatus {
  AVAILABLE = 'available',
  LOANED = 'loaned',
  RESERVED = 'reserved',
  MAINTENANCE = 'maintenance',
  LOST = 'lost',
  DECOMMISSIONED = 'decommissioned'
}
```

## 🔄 Integração com Outros Módulos

### Dependências
- **Loan**: Empréstimos do material
- **Reservation**: Reservas associadas
- **Review**: Avaliações dos usuários
- **Notification**: Alertas de disponibilidade

### Relacionamentos
```typescript
// Prisma Schema
model Material {
  id              String        @id @default(uuid())
  title           String
  author          String
  materialType    MaterialType
  status          MaterialStatus
  loans           Loan[]
  reservations    Reservation[]
  reviews         Review[]
  patrimonyNumber String        @unique
}
```

## 🧪 Funcionalidades Especiais

### Geração de Número de Patrimônio
```typescript
// Formato: YYYY-TIPO-NNNNNN
// Exemplo: 2024-LIV-000001
```

### Cálculo de Disponibilidade
```typescript
interface AvailabilityInfo {
  isAvailable: boolean;
  totalCopies: number;
  availableCopies: number;
  loanedCopies: number;
  reservedCopies: number;
  nextAvailableDate?: Date;
}
```

### Estatísticas do Acervo
```typescript
interface AccessionStatistics {
  totalMaterials: number;
  totalByType: Record<MaterialType, number>;
  totalByStatus: Record<MaterialStatus, number>;
  totalByCategory: Record<string, number>;
  averageAge: number;
  mostPopular: Material[];
  recentAdditions: Material[];
}
```

## 📝 Exemplos de Uso

### Catalogar Livro
```typescript
const newBook = {
  title: "Clean Code: A Handbook of Agile Software Craftsmanship",
  author: "Robert C. Martin",
  isbn: "9780132350884",
  materialType: MaterialType.BOOK,
  category: "Ciência da Computação",
  publisher: "Prentice Hall",
  publishYear: 2008,
  pages: 464,
  language: "EN",
  location: "Seção A - Prateleira 15",
  keywords: ["programação", "clean code", "desenvolvimento"]
};
```

### Busca Avançada
```typescript
const filters = {
  materialType: MaterialType.BOOK,
  status: MaterialStatus.AVAILABLE,
  category: "Ciência da Computação",
  language: "PT",
  search: "algoritmos",
  sortBy: "title",
  sortOrder: "ASC",
  page: 1,
  limit: 20
};
```

## 🚀 Melhorias Futuras

- [ ] Sistema de recomendações baseado em IA
- [ ] Integração com catálogos de outras bibliotecas
- [ ] Scanner de código de barras para catalogação
- [ ] Sistema de etiquetas QR Code
- [ ] Análise de tendências do acervo
- [ ] Alertas automáticos de manutenção preventiva
