import { registerAs } from '@nestjs/config';
import { parseEnvNumber, parseEnvString, parseEnvBoolean } from './src/utils/env.utils';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  host: parseEnvString(process.env.DATABASE_HOST, 'localhost'),
  port: parseEnvNumber(process.env.DATABASE_PORT, 5433),
  name: parseEnvString(process.env.DATABASE_NAME, 'biblioteca_universitaria'),
  username: parseEnvString(process.env.DATABASE_USER, 'biblioteca'),
  password: parseEnvString(process.env.DATABASE_PASSWORD, '123456'),
  schema: parseEnvString(process.env.DATABASE_SCHEMA, 'public'),
  ssl: parseEnvBoolean(process.env.DATABASE_SSL, false),
  sslRejectUnauthorized: parseEnvBoolean(process.env.DATABASE_SSL_REJECT_UNAUTHORIZED, false),
  maxConnections: parseEnvNumber(process.env.DATABASE_MAX_CONNECTIONS, 10),
  idleTimeoutMillis: parseEnvNumber(process.env.DATABASE_IDLE_TIMEOUT, 30000),
  connectionTimeoutMillis: parseEnvNumber(process.env.DATABASE_CONNECTION_TIMEOUT, 2000),
}));

export const databaseConfig = {
  url: parseEnvString(process.env.DATABASE_URL, 'postgresql://biblioteca:123456@localhost:5433/biblioteca_universitaria'),
  host: parseEnvString(process.env.DATABASE_HOST, 'localhost'),
  port: parseEnvNumber(process.env.DATABASE_PORT, 5433),
  name: parseEnvString(process.env.DATABASE_NAME, 'biblioteca_universitaria'),
  username: parseEnvString(process.env.DATABASE_USER, 'biblioteca'),
  password: parseEnvString(process.env.DATABASE_PASSWORD, '123456'),
  schema: parseEnvString(process.env.DATABASE_SCHEMA, 'public'),
  ssl: parseEnvBoolean(process.env.DATABASE_SSL, false),
  sslRejectUnauthorized: parseEnvBoolean(process.env.DATABASE_SSL_REJECT_UNAUTHORIZED, false),
  maxConnections: parseEnvNumber(process.env.DATABASE_MAX_CONNECTIONS, 10),
  idleTimeoutMillis: parseEnvNumber(process.env.DATABASE_IDLE_TIMEOUT, 30000),
  connectionTimeoutMillis: parseEnvNumber(process.env.DATABASE_CONNECTION_TIMEOUT, 2000),
};
