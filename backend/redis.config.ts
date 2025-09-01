import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD || '',
  db: parseInt(process.env.REDIS_DB, 10) || 0,
  keyPrefix: process.env.REDIS_KEY_PREFIX || 'biblioteca:',
  retryDelayOnFailover: parseInt(process.env.REDIS_RETRY_DELAY, 10) || 100,
  maxRetriesPerRequest: parseInt(process.env.REDIS_MAX_RETRIES, 10) || 3,
  lazyConnect: process.env.REDIS_LAZY_CONNECT === 'true',
  keepAlive: parseInt(process.env.REDIS_KEEP_ALIVE, 10) || 30000,
  family: parseInt(process.env.REDIS_FAMILY, 10) || 4,
  connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT, 10) || 10000,
  readTimeout: parseInt(process.env.REDIS_READ_TIMEOUT, 10) || 10000,
  writeTimeout: parseInt(process.env.REDIS_WRITE_TIMEOUT, 10) || 10000,
}));

export const redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD || '',
  db: parseInt(process.env.REDIS_DB, 10) || 0,
  keyPrefix: process.env.REDIS_KEY_PREFIX || 'biblioteca:',
  retryDelayOnFailover: parseInt(process.env.REDIS_RETRY_DELAY, 10) || 100,
  maxRetriesPerRequest: parseInt(process.env.REDIS_MAX_RETRIES, 10) || 3,
  lazyConnect: process.env.REDIS_LAZY_CONNECT === 'true',
  keepAlive: parseInt(process.env.REDIS_KEEP_ALIVE, 10) || 30000,
  family: parseInt(process.env.REDIS_FAMILY, 10) || 4,
  connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT, 10) || 10000,
  readTimeout: parseInt(process.env.REDIS_READ_TIMEOUT, 10) || 10000,
  writeTimeout: parseInt(process.env.REDIS_WRITE_TIMEOUT, 10) || 10000,
};
