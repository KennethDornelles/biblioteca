# Módulo de Autenticação

Este módulo implementa autenticação JWT para a API da Biblioteca Universitária.

## Documentação Completa

Para documentação detalhada, consulte:
- [Documentação do Módulo Auth](../../../docs/backend/MODULO_AUTH.md)
- [Exemplos de Uso](../../../docs/backend/EXEMPLOS_AUTH.md)
- [Implementação Completa](../../../docs/backend/IMPLEMENTACAO_AUTH_COMPLETA.md)

## Estrutura

```
auth/
├── auth.module.ts              # Módulo principal
├── auth.service.ts             # Serviço de autenticação
├── auth.controller.ts          # Controller com endpoints
├── strategies/                 # Estratégias de autenticação
├── guards/                     # Guards de proteção
├── decorators/                 # Decorators personalizados
├── dto/                        # Data Transfer Objects
└── README.md                   # Este arquivo
```

## Endpoints

- `POST /auth/login` - Login do usuário
- `POST /auth/refresh` - Renovação de tokens
- `POST /auth/logout` - Logout do usuário
- `GET /auth/profile` - Perfil do usuário autenticado

## Uso Básico

```typescript
// Proteger endpoint
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserType.ADMIN, UserType.LIBRARIAN)
async protectedMethod() {
  // Apenas administradores e bibliotecários
}

// Acessar usuário atual
@UseGuards(JwtAuthGuard)
async getMyData(@CurrentUser() user: any) {
  return this.service.findByUserId(user.sub);
}
```
