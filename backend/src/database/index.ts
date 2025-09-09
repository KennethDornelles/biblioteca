// Configurações centralizadas do banco de dados
export * from './prisma.config';
export * from './prisma.service';
export * from './database.module';

// Re-exportações para facilitar o uso
export { default as databaseConfig } from './database.config';
export { databaseConfig as dbConfig } from './database.config';

// Configurações do Prisma
export { prismaConfig, testPrismaConfig, createPrismaClient, createTestPrismaClient } from './prisma.config';
export { connectionPoolConfig, sslConfig } from './prisma.config';

// Schema e migrações
export * from './seed';

// Tipos e interfaces do banco
export type { PrismaClient, Prisma } from '@prisma/client';