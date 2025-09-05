import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { AppModule } from './app.module';
import { 
  EnvironmentVariables, 
  createLogger, 
  setupSwagger 
} from './config';
import { SecurityHeadersInterceptor } from './interceptors';

async function bootstrap() {
  // Create logger first for early error logging
  const tempLogger = new Logger('Bootstrap');
  
  try {
    // Create application with logger
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      bufferLogs: true,
    });

    // Get configuration service
    const configService = app.get<ConfigService<EnvironmentVariables>>(ConfigService);
    const config = configService.get<EnvironmentVariables>('', { infer: true })!;
    
    // Setup structured logging
    const logger = createLogger(config);
    app.useLogger(logger);
    
    // Trust proxy (important for rate limiting and real IP detection)
    app.set('trust proxy', 1);

    // Security middlewares
    app.use(helmet({
      contentSecurityPolicy: config.NODE_ENV === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: false,
    }));

    // HTTP request logging
    const morganFormat = config.NODE_ENV === 'production' 
      ? 'combined' 
      : 'dev';
    
    app.use(morgan(morganFormat, {
      stream: {
        write: (message: string) => {
          logger.log(message.trim(), 'HTTP');
        },
      },
    }));

    // Compression middleware
    app.use(compression());

    // CORS configuration
    const corsOrigins = config.CORS_ORIGIN.split(',').map(origin => origin.trim());
    app.enableCors({
      origin: corsOrigins,
      credentials: config.CORS_CREDENTIALS,
      methods: config.CORS_METHODS.split(',').map(method => method.trim()),
      allowedHeaders: [
        'Accept',
        'Authorization',
        'Content-Type',
        'X-Requested-With',
        'Range',
      ],
      exposedHeaders: [
        'Content-Range',
        'X-Content-Range',
        'X-Total-Count',
      ],
    });

    // Global validation pipe with security settings
    app.useGlobalPipes(
      new ValidationPipe({
        // Security: Strip unknown properties to prevent mass assignment
        whitelist: true,
        // Security: Throw error if non-whitelisted properties are present
        forbidNonWhitelisted: true,
        // Security: Reject unknown values
        forbidUnknownValues: true,
        // Transform payloads to be objects typed according to their DTO classes
        transform: true,
        // Automatically transform primitive types
        transformOptions: {
          enableImplicitConversion: true,
        },
        // Detailed error messages in development only
        disableErrorMessages: config.NODE_ENV === 'production',
        // Validate nested objects
        validateCustomDecorators: true,
      }),
    );

    // Enable dependency injection for class-validator
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    // Global security interceptor
    app.useGlobalInterceptors(new SecurityHeadersInterceptor());

    // Setup API documentation (disabled in production)
    setupSwagger(app, config);

    // Graceful shutdown handling
    const gracefulShutdown = (signal: string) => {
      logger.log(`Received ${signal}, starting graceful shutdown...`, 'Application');
      
      // Close server
      app.close().then(() => {
        logger.log('HTTP server closed', 'Application');
        process.exit(0);
      }).catch((error) => {
        logger.error('Error during graceful shutdown', error, 'Application');
        process.exit(1);
      });
    };

    // Register signal handlers
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error, 'Application');
      gracefulShutdown('uncaughtException');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason, 'Application');
      gracefulShutdown('unhandledRejection');
    });

    // Start the server
    await app.listen(config.PORT, () => {
      logger.log(`🚀 Application is running on: ${config.APP_URL}`, 'Application');
      logger.log(`📊 Environment: ${config.NODE_ENV}`, 'Application');
      logger.log(`📝 API Documentation: ${config.APP_URL}/${config.SWAGGER_PATH}`, 'Application');
      logger.log(`🔒 Security middlewares enabled`, 'Application');
    });

  } catch (error) {
    tempLogger.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Start the application
bootstrap();
