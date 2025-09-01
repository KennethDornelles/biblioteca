# Notas de Migração - Diretórios Comuns

## Resumo da Migração

Os diretórios de enums, types, interfaces e utils foram migrados do módulo de user (`src/modules/user/`) para o nível raiz de `src/` para centralizar e organizar melhor o código.

## Estrutura Antiga vs Nova

### Antes (src/modules/user/)
```
src/modules/user/
├── enums/
│   ├── user-type.enum.ts
│   ├── student-level.enum.ts
│   ├── user-status.enum.ts
│   └── index.ts
├── interfaces/
│   └── user.interface.ts
├── types/
│   └── user.types.ts
├── constants/
│   └── user.constants.ts
├── utils/
│   ├── user.utils.ts
│   └── index.ts
├── config/
│   ├── user.config.ts
│   └── index.ts
└── ... (outros arquivos)
```

### Depois (src/)
```
src/
├── enums/
│   ├── user-type.enum.ts
│   ├── student-level.enum.ts
│   ├── user-status.enum.ts
│   └── index.ts
├── interfaces/
│   ├── entities/
│   │   └── user.entity.ts
│   ├── user.interface.ts
│   └── index.ts
├── types/
│   ├── user.types.ts
│   └── index.ts
├── constants/
│   ├── user.constants.ts
│   └── index.ts
├── utils/
│   ├── user.utils.ts
│   └── index.ts
├── config/
│   ├── user.config.ts
│   └── index.ts
├── index.ts (arquivo principal)
└── ... (outros arquivos)
```

## Arquivos Migrados

### Enums
- `src/enums/user-type.enum.ts` - Tipos de usuário (STUDENT, PROFESSOR, etc.)
- `src/enums/student-level.enum.ts` - Níveis acadêmicos (UNDERGRADUATE, MASTERS, etc.)
- `src/enums/user-status.enum.ts` - Status de usuário (ACTIVE, INACTIVE, etc.)
- `src/enums/index.ts` - Arquivo de índice para todos os enums

### Interfaces
- `src/interfaces/user.interface.ts` - Interfaces TypeScript para tipagem
- `src/interfaces/entities/user.entity.ts` - Entidade User (já existia)
- `src/interfaces/index.ts` - Arquivo de índice para todas as interfaces

### Types
- `src/types/user.types.ts` - Tipos TypeScript avançados e unions
- `src/types/index.ts` - Arquivo de índice para todos os tipos

### Constants
- `src/constants/user.constants.ts` - Constantes de validação, mensagens e configurações
- `src/constants/index.ts` - Arquivo de índice para todas as constantes

### Utils
- `src/utils/user.utils.ts` - Funções utilitárias para validação, formatação e lógica de negócio
- `src/utils/index.ts` - Arquivo de índice para todos os utilitários

### Config
- `src/config/user.config.ts` - Configurações de validação, segurança e sistema
- `src/config/index.ts` - Arquivo de índice para todas as configurações

## Arquivo de Índice Principal

`src/index.ts` - Exporta todos os diretórios comuns:
```typescript
// Enums
export * from './enums';

// Interfaces
export * from './interfaces';

// Types
export * from './types';

// Constants
export * from './constants';

// Utils
export * from './utils';

// Config
export * from './config';
```

## Imports Atualizados

### Antes
```typescript
import { UserType, StudentLevel } from '@prisma/client';
```

### Depois
```typescript
import { UserType, StudentLevel } from '../../enums';
```

## Benefícios da Migração

1. **Centralização**: Todos os arquivos comuns estão em um local centralizado
2. **Reutilização**: Outros módulos podem facilmente importar e usar esses arquivos
3. **Organização**: Estrutura mais limpa e organizada
4. **Manutenibilidade**: Mais fácil de manter e atualizar
5. **Consistência**: Padrão consistente em todo o projeto

## Como Usar

### Importando de outros módulos
```typescript
// Para enums
import { UserType, StudentLevel } from '../../enums';

// Para interfaces
import { IUser, ICreateUser } from '../../interfaces';

// Para tipos
import { UserResponse, PaginatedResponse } from '../../types';

// Para constantes
import { USER_DEFAULTS, USER_ERROR_MESSAGES } from '../../constants';

// Para utilitários
import { validateRequiredFields, formatUserName } from '../../utils';

// Para configurações
import { PASSWORD_VALIDATION_CONFIG } from '../../config';
```

### Importando do arquivo principal
```typescript
import { 
  UserType, 
  IUser, 
  UserResponse, 
  USER_DEFAULTS,
  validateRequiredFields,
  PASSWORD_VALIDATION_CONFIG 
} from '../../';
```

## Verificação

Após a migração, todos os imports foram atualizados e os testes devem continuar funcionando. A estrutura está mais organizada e segue as melhores práticas de organização de código.

