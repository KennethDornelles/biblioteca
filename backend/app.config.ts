import { registerAs } from '@nestjs/config';
import { parseEnvNumber, parseEnvString } from './src/utils/env.utils';

export default registerAs('app', () => ({
  name: parseEnvString(process.env.APP_NAME, 'Biblioteca Universitária API'),
  version: parseEnvString(process.env.APP_VERSION, '1.0.0'),
  port: parseEnvNumber(process.env.PORT, 3000),
  nodeEnv: parseEnvString(process.env.NODE_ENV, 'development'),
  url: parseEnvString(process.env.APP_URL, 'http://localhost:3000'),
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
}));

export const appConfig = {
  name: parseEnvString(process.env.APP_NAME, 'Biblioteca Universitária API'),
  version: parseEnvString(process.env.APP_VERSION, '1.0.0'),
  port: parseEnvNumber(process.env.PORT, 3000),
  nodeEnv: parseEnvString(process.env.NODE_ENV, 'development'),
  url: parseEnvString(process.env.APP_URL, 'http://localhost:3000'),
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
};
