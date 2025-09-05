# Exemplos de Uso dos Guards de Autenticação

Este arquivo contém exemplos práticos de como usar os guards de autenticação em outros módulos da aplicação.

## 1. Protegendo um Controller Completo

```typescript
import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('materials')
@UseGuards(JwtAuthGuard) // Protege todo o controller
@ApiBearerAuth() // Adiciona autenticação Bearer no Swagger
export class MaterialController {
  // Todos os endpoints deste controller requerem autenticação
}
```

## 2. Protegendo Endpoints Específicos

```typescript
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../../enums';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('loans')
export class LoanController {
  
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.LIBRARIAN)
  @ApiBearerAuth()
  async findAll() {
    // Apenas administradores e bibliotecários podem listar todos os empréstimos
  }

  @Get('my-loans')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findMyLoans(@CurrentUser() user: any) {
    // Qualquer usuário autenticado pode ver seus próprios empréstimos
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.LIBRARIAN)
  @ApiBearerAuth()
  async create() {
    // Apenas bibliotecários podem criar empréstimos
  }
}
```

## 3. Usando o Decorator @CurrentUser

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('profile')
export class ProfileController {
  
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMyProfile(@CurrentUser() user: any) {
    // user contém: { sub, email, type, name, active }
    return this.userService.findById(user.sub);
  }

  @Get('preferences')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMyPreferences(@CurrentUser() user: any) {
    return this.preferenceService.findByUserId(user.sub);
  }
}
```

## 4. Controle de Acesso Baseado em Roles

```typescript
import { Controller, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../../enums';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('system')
export class SystemController {
  
  @Delete('users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN) // Apenas administradores
  @ApiBearerAuth()
  async deleteUser(@Param('id') id: string) {
    // Apenas administradores podem excluir usuários
  }

  @Post('backup')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.LIBRARIAN) // Administradores e bibliotecários
  @ApiBearerAuth()
  async createBackup() {
    // Administradores e bibliotecários podem criar backups
  }

  @Get('logs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN) // Apenas administradores
  @ApiBearerAuth()
  async getSystemLogs() {
    // Apenas administradores podem ver logs do sistema
  }
}
```

## 5. Endpoints Públicos vs Protegidos

```typescript
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../../enums';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('materials')
export class MaterialController {
  
  // Endpoint público - não requer autenticação
  @Get('public')
  async findPublicMaterials() {
    return this.materialService.findPublicMaterials();
  }

  // Endpoint protegido - requer autenticação
  @Get('private')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findPrivateMaterials() {
    return this.materialService.findPrivateMaterials();
  }

  // Endpoint com controle de role
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.LIBRARIAN)
  @ApiBearerAuth()
  async createMaterial() {
    // Apenas administradores e bibliotecários
  }
}
```

## 6. Tratamento de Erros de Autenticação

```typescript
import { Controller, Get, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@Controller('sensitive-data')
export class SensitiveDataController {
  
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Dados sensíveis retornados com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado - token inválido ou expirado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - permissão insuficiente' })
  async getSensitiveData(@CurrentUser() user: any) {
    try {
      // Verificar permissões adicionais se necessário
      if (user.type !== UserType.ADMIN) {
        throw new HttpException('Acesso negado', HttpStatus.FORBIDDEN);
      }
      
      return this.sensitiveDataService.getData();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
```

## 7. Middleware de Logging para Usuários Autenticados

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthLoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.user) {
      console.log(`[${new Date().toISOString()}] Usuário ${req.user.email} acessou ${req.method} ${req.path}`);
    }
    next();
  }
}

// No módulo:
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthLoggingMiddleware)
      .forRoutes('*');
  }
}
```

## 8. Testando Endpoints Protegidos

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('Auth Guards (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/protected-route should return 401 without token', () => {
    return request(app.getHttpServer())
      .get('/protected-route')
      .expect(401);
  });

  it('/protected-route should return 200 with valid token', async () => {
    // Primeiro fazer login para obter token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@biblioteca.edu.br',
        password: 'admin123'
      });

    const token = loginResponse.body.accessToken;

    // Usar token para acessar rota protegida
    return request(app.getHttpServer())
      .get('/protected-route')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
```

## 9. Configuração de Rate Limiting por Usuário

```typescript
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minuto
      limit: 10,  // 10 requests por minuto
    }]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

## 10. Cache de Permissões de Usuário

```typescript
import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class PermissionService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private userService: UserService,
  ) {}

  async getUserPermissions(userId: string): Promise<string[]> {
    const cacheKey = `user_permissions_${userId}`;
    
    let permissions = await this.cacheManager.get<string[]>(cacheKey);
    
    if (!permissions) {
      const user = await this.userService.findById(userId);
      permissions = this.calculatePermissions(user);
      
      // Cache por 5 minutos
      await this.cacheManager.set(cacheKey, permissions, 300);
    }
    
    return permissions;
  }

  private calculatePermissions(user: any): string[] {
    const permissions = [];
    
    switch (user.type) {
      case UserType.ADMIN:
        permissions.push('*'); // Todas as permissões
        break;
      case UserType.LIBRARIAN:
        permissions.push('loan.*', 'material.*', 'user.read');
        break;
      case UserType.PROFESSOR:
        permissions.push('loan.read', 'material.read', 'reservation.*');
        break;
      case UserType.STUDENT:
        permissions.push('loan.read', 'material.read', 'reservation.own');
        break;
    }
    
    return permissions;
  }
}
```

## Resumo dos Guards Disponíveis

1. **JwtAuthGuard**: Verifica se o token JWT é válido
2. **RolesGuard**: Verifica se o usuário tem as permissões necessárias
3. **LocalAuthGuard**: Para autenticação local (email/senha)

## Resumo dos Decorators Disponíveis

1. **@Roles()**: Define quais tipos de usuário podem acessar
2. **@CurrentUser()**: Extrai o usuário autenticado do request
3. **@ApiBearerAuth()**: Adiciona autenticação Bearer no Swagger

## Dicas de Segurança

1. **Sempre use @ApiBearerAuth()** em endpoints protegidos para documentação correta
2. **Combine JwtAuthGuard + RolesGuard** para controle completo de acesso
3. **Use @CurrentUser()** para acessar dados do usuário autenticado
4. **Implemente logging** para auditoria de ações sensíveis
5. **Configure rate limiting** para prevenir abuso
6. **Use cache** para permissões frequentemente acessadas
7. **Valide dados** mesmo em endpoints autenticados
8. **Implemente timeout** para sessões longas
9. **Use HTTPS** em produção
10. **Monitore tentativas de acesso** não autorizadas
