# Módulo de Reviews

Este módulo gerencia as avaliações (reviews) que os usuários fazem sobre os materiais da biblioteca.

## Funcionalidades

### CRUD Básico
- **Criar Review**: Permite que usuários criem avaliações para materiais
- **Listar Reviews**: Lista todas as reviews com filtros e paginação
- **Buscar Review**: Busca uma review específica por ID
- **Atualizar Review**: Permite atualizar rating e comentário
- **Remover Review**: Remove uma review do sistema

### Funcionalidades Especiais
- **Reviews por Usuário**: Lista todas as reviews de um usuário específico
- **Reviews por Material**: Lista todas as reviews de um material específico
- **Estatísticas**: Fornece estatísticas gerais das reviews
- **Validações**: Verifica se o usuário pode fazer review (deve ter emprestado o material)

## Endpoints

### POST `/reviews`
Cria uma nova review.

**Body:**
```json
{
  "userId": "clx1234567890abcdef",
  "materialId": "clx1234567890abcdef",
  "rating": 5,
  "comment": "Excelente livro!"
}
```

**Validações:**
- Usuário deve existir
- Material deve existir
- Usuário não pode ter feito review para o mesmo material
- Usuário deve ter emprestado o material (status RETURNED)
- Rating deve ser entre 1 e 5

### GET `/reviews`
Lista todas as reviews com filtros e paginação.

**Query Parameters:**
- `userId`: Filtrar por usuário
- `materialId`: Filtrar por material
- `rating`: Filtrar por nota específica
- `minRating`: Nota mínima
- `maxRating`: Nota máxima
- `hasComment`: Filtrar por reviews com/sem comentário
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10)

### GET `/reviews/stats`
Retorna estatísticas das reviews:
- Total de reviews
- Média das notas
- Distribuição por nota
- Total com/sem comentários

### GET `/reviews/user/:userId`
Lista reviews de um usuário específico.

**Query Parameters:**
- `page`: Número da página
- `limit`: Itens por página

### GET `/reviews/material/:materialId`
Lista reviews de um material específico.

**Query Parameters:**
- `page`: Número da página
- `limit`: Itens por página

### GET `/reviews/:id`
Busca uma review específica por ID.

### PATCH `/reviews/:id`
Atualiza uma review existente.

**Body:**
```json
{
  "rating": 4,
  "comment": "Muito bom livro!"
}
```

### DELETE `/reviews/:id`
Remove uma review do sistema.

## Modelo de Dados

### Review
```typescript
{
  id: string;
  userId: string;
  materialId: string;
  rating: number; // 1-5
  comment?: string;
  reviewDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Relacionamentos
- **User**: Usuário que fez a review
- **Material**: Material avaliado

## Regras de Negócio

1. **Unicidade**: Um usuário só pode fazer uma review por material
2. **Validação de Empréstimo**: Usuário deve ter emprestado o material para fazer review
3. **Rating**: Deve ser um número entre 1 e 5
4. **Comentário**: Opcional, mas recomendado
5. **Data**: Automática na criação

## Exemplos de Uso

### Criar Review
```typescript
const review = await reviewService.create({
  userId: 'user123',
  materialId: 'book456',
  rating: 5,
  comment: 'Excelente livro de programação!'
});
```

### Buscar Reviews com Filtros
```typescript
const reviews = await reviewService.findAll({
  minRating: 4,
  hasComment: true,
  page: 1,
  limit: 20
});
```

### Estatísticas
```typescript
const stats = await reviewService.getStats();
console.log(`Média das notas: ${stats.averageRating}`);
console.log(`Total de reviews: ${stats.total}`);
```

## Tratamento de Erros

- **400**: Dados inválidos
- **403**: Usuário não pode fazer review
- **404**: Usuário, material ou review não encontrado
- **409**: Usuário já fez review para este material

## Dependências

- Prisma Client para acesso ao banco
- Class Validator para validação de DTOs
- Swagger para documentação da API
