import { registerAs } from '@nestjs/config';
import { parseEnvNumber, parseEnvString, parseEnvBoolean } from './src/utils/env.utils';

export default registerAs('redis', () => ({
  url: parseEnvString(process.env.REDIS_URL, 'redis://localhost:6379'),
  host: parseEnvString(process.env.REDIS_HOST, 'localhost'),
  port: parseEnvNumber(process.env.REDIS_PORT, 6379),
  password: parseEnvString(process.env.REDIS_PASSWORD, ''),
  db: parseEnvNumber(process.env.REDIS_DB, 0),
  keyPrefix: parseEnvString(process.env.REDIS_KEY_PREFIX, 'biblioteca:'),
  retryDelayOnFailover: parseEnvNumber(process.env.REDIS_RETRY_DELAY, 100),
  maxRetriesPerRequest: parseEnvNumber(process.env.REDIS_MAX_RETRIES, 3),
  lazyConnect: parseEnvBoolean(process.env.REDIS_LAZY_CONNECT, false),
  keepAlive: parseEnvNumber(process.env.REDIS_KEEP_ALIVE, 30000),
  family: parseEnvNumber(process.env.REDIS_FAMILY, 4),
  connectTimeout: parseEnvNumber(process.env.REDIS_CONNECT_TIMEOUT, 10000),
  readTimeout: parseEnvNumber(process.env.REDIS_READ_TIMEOUT, 10000),
  writeTimeout: parseEnvNumber(process.env.REDIS_WRITE_TIMEOUT, 10000),
}));

export const redisConfig = {
  url: parseEnvString(process.env.REDIS_URL, 'redis://localhost:6379'),
  host: parseEnvString(process.env.REDIS_HOST, 'localhost'),
  port: parseEnvNumber(process.env.REDIS_PORT, 6379),
  password: parseEnvString(process.env.REDIS_PASSWORD, ''),
  db: parseEnvNumber(process.env.REDIS_DB, 0),
  keyPrefix: parseEnvString(process.env.REDIS_KEY_PREFIX, 'biblioteca:'),
  retryDelayOnFailover: parseEnvNumber(process.env.REDIS_RETRY_DELAY, 100),
  maxRetriesPerRequest: parseEnvNumber(process.env.REDIS_MAX_RETRIES, 3),
  lazyConnect: parseEnvBoolean(process.env.REDIS_LAZY_CONNECT, false),
  keepAlive: parseEnvNumber(process.env.REDIS_KEEP_ALIVE, 30000),
  family: parseEnvNumber(process.env.REDIS_FAMILY, 4),
  connectTimeout: parseEnvNumber(process.env.REDIS_CONNECT_TIMEOUT, 10000),
  readTimeout: parseEnvNumber(process.env.REDIS_READ_TIMEOUT, 10000),
  writeTimeout: parseEnvNumber(process.env.REDIS_WRITE_TIMEOUT, 10000),
};
