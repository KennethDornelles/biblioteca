import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './config/swagger.config';
import { EnvironmentVariables } from './config/environment.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Configurações de segurança - Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false, // Permite embeds para Swagger
  }));
  
  // Compressão gzip para otimizar respostas
  app.use(compression());
  
  // Cookie Parser para manipulação segura de cookies
  app.use(cookieParser(configService.get('COOKIE_SECRET') || 'biblioteca-secret-key'));
  
  // Validation Pipe global para validação automática de DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades não definidas nos DTOs
    forbidNonWhitelisted: true, // Rejeita requests com propriedades extras
    transform: true, // Transforma tipos automaticamente
    disableErrorMessages: process.env.NODE_ENV === 'production', // Remove mensagens detalhadas em produção
  }));
  
  // CORS avançado com configurações de segurança
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://biblioteca-universitaria.com'] // Domínios permitidos em produção
      : ['http://localhost:3000', 'http://localhost:4200'], // Domínios para desenvolvimento
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true, // Permite cookies e headers de autenticação
    maxAge: 86400, // Cache preflight por 24 horas
  });

  // Configurar prefixo global da API
  app.setGlobalPrefix('api');

  // Configuração do Swagger para documentação da API
  const envConfig = configService.get<EnvironmentVariables>('') as EnvironmentVariables;
  setupSwagger(app, envConfig || {
    NODE_ENV: configService.get('NODE_ENV') || 'development',
    SWAGGER_TITLE: configService.get('SWAGGER_TITLE') || 'Biblioteca Universitária API',
    SWAGGER_DESCRIPTION: configService.get('SWAGGER_DESCRIPTION') || 'API para gerenciamento de biblioteca universitária',
    SWAGGER_VERSION: configService.get('SWAGGER_VERSION') || '1.0.0',
    SWAGGER_PATH: configService.get('SWAGGER_PATH') || 'api-docs',
    APP_URL: configService.get('APP_URL') || 'http://localhost:3001',
  } as EnvironmentVariables);

  // Configurações específicas para ambiente
  const port = configService.get('PORT') || 3001;
  const environment = configService.get('NODE_ENV') || 'development';
  
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`🌍 Environment: ${environment}`);
  console.log(`🛡️  Security features enabled: Helmet, CORS, Rate Limiting, Compression`);
  
  // Log do Swagger apenas em desenvolvimento
  if (environment !== 'production') {
    const swaggerPath = configService.get('SWAGGER_PATH') || 'api-docs';
    console.log(`📚 Swagger documentation available at: http://localhost:${port}/${swaggerPath}`);
  }
}

bootstrap();
