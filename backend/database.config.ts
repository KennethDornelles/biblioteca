import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5433,
  name: process.env.DATABASE_NAME || 'biblioteca_universitaria',
  username: process.env.DATABASE_USER || 'biblioteca',
  password: process.env.DATABASE_PASSWORD || '123456',
  schema: process.env.DATABASE_SCHEMA || 'public',
  ssl: process.env.DATABASE_SSL === 'true',
  sslRejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'true',
  maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10) || 10,
  idleTimeoutMillis: parseInt(process.env.DATABASE_IDLE_TIMEOUT, 10) || 30000,
  connectionTimeoutMillis: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT, 10) || 2000,
}));

export const databaseConfig = {
  url: process.env.DATABASE_URL || 'postgresql://biblioteca:123456@localhost:5433/biblioteca_universitaria',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5433,
  name: process.env.DATABASE_NAME || 'biblioteca_universitaria',
  username: process.env.DATABASE_USER || 'biblioteca',
  password: process.env.DATABASE_PASSWORD || '123456',
  schema: process.env.DATABASE_SCHEMA || 'public',
  ssl: process.env.DATABASE_SSL === 'true',
  sslRejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'true',
  maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10) || 10,
  idleTimeoutMillis: parseInt(process.env.DATABASE_IDLE_TIMEOUT, 10) || 30000,
  connectionTimeoutMillis: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT, 10) || 2000,
};
