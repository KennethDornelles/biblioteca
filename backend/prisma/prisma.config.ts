import { PrismaClient } from '@prisma/client';

// Configuração do Prisma Client
export const prismaConfig = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://biblioteca:123456@localhost:5433/biblioteca_universitaria',
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'pretty',
};

// Configuração para testes
export const testPrismaConfig = {
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || 'postgresql://biblioteca:123456@localhost:5433/biblioteca_test',
    },
  },
  log: ['error'],
  errorFormat: 'pretty',
};

// Função para criar instância do Prisma com configuração específica
export function createPrismaClient(config = prismaConfig) {
  return new PrismaClient(config);
}

// Função para criar instância de teste do Prisma
export function createTestPrismaClient() {
  return createPrismaClient(testPrismaConfig);
}

// Configurações de pool de conexões
export const connectionPoolConfig = {
  maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10) || 10,
  idleTimeoutMillis: parseInt(process.env.DATABASE_IDLE_TIMEOUT, 10) || 30000,
  connectionTimeoutMillis: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT, 10) || 2000,
};

// Configurações de SSL para produção
export const sslConfig = {
  ssl: process.env.DATABASE_SSL === 'true',
  sslRejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'true',
};
