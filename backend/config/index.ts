import { registerAs } from '@nestjs/config';
import databaseConfig from '../database.config';
import redisConfig from '../redis.config';
import appConfig from '../app.config';
import securityConfig from '../security.config';

export default [
  databaseConfig,
  redisConfig,
  appConfig,
  securityConfig,
  registerAs('email', () => ({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER || 'seu_email@gmail.com',
    pass: process.env.SMTP_PASS || 'sua_senha_de_app',
    from: process.env.SMTP_FROM || 'noreply@biblioteca.edu.br',
    fromName: process.env.SMTP_FROM_NAME || 'Biblioteca Universitária',
    secure: process.env.SMTP_SECURE === 'true',
  })),
  registerAs('logging', () => ({
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
    file: process.env.LOG_FILE || 'logs/app.log',
    maxSize: process.env.LOG_MAX_SIZE || '10m',
    maxFiles: parseInt(process.env.LOG_MAX_FILES, 10) || 5,
  })),
  registerAs('swagger', () => ({
    title: process.env.SWAGGER_TITLE || 'Biblioteca Universitária API',
    description: process.env.SWAGGER_DESCRIPTION || 'API para gerenciamento de biblioteca universitária',
    version: process.env.SWAGGER_VERSION || '1.0.0',
    path: process.env.SWAGGER_PATH || 'api-docs',
    favicon: process.env.SWAGGER_FAVICON || '',
  })),
  registerAs('monitoring', () => ({
    enableMetrics: process.env.ENABLE_METRICS === 'true',
    metricsPort: parseInt(process.env.METRICS_PORT, 10) || 9090,
    healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL, 10) || 30000,
  })),
  registerAs('cache', () => ({
    ttl: parseInt(process.env.CACHE_TTL, 10) || 3600,
    maxItems: parseInt(process.env.CACHE_MAX_ITEMS, 10) || 1000,
    checkPeriod: parseInt(process.env.CACHE_CHECK_PERIOD, 10) || 600,
  })),
];

// Configurações de teste
export const testConfig = {
  database: {
    url: process.env.TEST_DATABASE_URL || 'postgresql://biblioteca:123456@localhost:5433/biblioteca_test',
  },
  redis: {
    url: process.env.TEST_REDIS_URL || 'redis://localhost:6379/1',
  },
  nodeEnv: process.env.TEST_NODE_ENV || 'test',
};

// Configurações de produção
export const productionConfig = {
  database: {
    ssl: true,
    sslRejectUnauthorized: true,
  },
  security: {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || ['https://biblioteca.edu.br'],
      credentials: true,
    },
    session: {
      cookieSecure: true,
    },
  },
};
