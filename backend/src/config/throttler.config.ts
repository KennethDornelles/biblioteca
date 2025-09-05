import { ThrottlerModule } from '@nestjs/throttler';
import { EnvironmentVariables } from './environment.config';

export function createThrottlerConfig(config: EnvironmentVariables) {
  return ThrottlerModule.forRoot([
    {
      name: 'short',
      ttl: 1000, // 1 second
      limit: 10, // 10 requests per second
    },
    {
      name: 'medium',
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
    },
    {
      name: 'long',
      ttl: config.RATE_LIMIT_WINDOW_MS,
      limit: config.RATE_LIMIT_MAX_REQUESTS,
    },
  ]);
}
