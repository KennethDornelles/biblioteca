import { registerAs } from '@nestjs/config';
import { parseEnvNumber, parseEnvString, parseEnvBoolean, parseEnvArray } from '../src/utils/env.utils';
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
    host: parseEnvString(process.env.SMTP_HOST, 'smtp.gmail.com'),
    port: parseEnvNumber(process.env.SMTP_PORT, 587),
    user: parseEnvString(process.env.SMTP_USER, 'seu_email@gmail.com'),
    pass: parseEnvString(process.env.SMTP_PASS, 'sua_senha_de_app'),
    from: parseEnvString(process.env.SMTP_FROM, 'noreply@biblioteca.edu.br'),
    fromName: parseEnvString(process.env.SMTP_FROM_NAME, 'Biblioteca Universitária'),
    secure: parseEnvBoolean(process.env.SMTP_SECURE, false),
  })),
  registerAs('logging', () => ({
    level: parseEnvString(process.env.LOG_LEVEL, 'info'),
    format: parseEnvString(process.env.LOG_FORMAT, 'json'),
    file: parseEnvString(process.env.LOG_FILE, 'logs/app.log'),
    maxSize: parseEnvString(process.env.LOG_MAX_SIZE, '10m'),
    maxFiles: parseEnvNumber(process.env.LOG_MAX_FILES, 5),
  })),
  registerAs('swagger', () => ({
    title: parseEnvString(process.env.SWAGGER_TITLE, 'Biblioteca Universitária API'),
    description: parseEnvString(process.env.SWAGGER_DESCRIPTION, 'API para gerenciamento de biblioteca universitária'),
    version: parseEnvString(process.env.SWAGGER_VERSION, '1.0.0'),
    path: parseEnvString(process.env.SWAGGER_PATH, 'api-docs'),
    favicon: parseEnvString(process.env.SWAGGER_FAVICON, ''),
  })),
  registerAs('monitoring', () => ({
    enableMetrics: parseEnvBoolean(process.env.ENABLE_METRICS, false),
    metricsPort: parseEnvNumber(process.env.METRICS_PORT, 9090),
    healthCheckInterval: parseEnvNumber(process.env.HEALTH_CHECK_INTERVAL, 30000),
  })),
  registerAs('cache', () => ({
    ttl: parseEnvNumber(process.env.CACHE_TTL, 3600),
    maxItems: parseEnvNumber(process.env.CACHE_MAX_ITEMS, 1000),
    checkPeriod: parseEnvNumber(process.env.CACHE_CHECK_PERIOD, 600),
  })),
];

// Configurações de teste
export const testConfig = {
  database: {
    url: parseEnvString(process.env.TEST_DATABASE_URL, 'postgresql://biblioteca:123456@localhost:5433/biblioteca_test'),
  },
  redis: {
    url: parseEnvString(process.env.TEST_REDIS_URL, 'redis://localhost:6379/1'),
  },
  nodeEnv: parseEnvString(process.env.TEST_NODE_ENV, 'test'),
};

// Configurações de produção
export const productionConfig = {
  database: {
    ssl: true,
    sslRejectUnauthorized: true,
  },
  security: {
    cors: {
      origin: parseEnvArray(process.env.CORS_ORIGIN, ['https://biblioteca.edu.br']),
      credentials: true,
    },
    session: {
      cookieSecure: true,
    },
  },
};
