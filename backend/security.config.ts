import { registerAs } from '@nestjs/config';
import { parseEnvNumber, parseEnvString, parseEnvBoolean, parseEnvArray } from './src/utils/env.utils';

export default registerAs('security', () => ({
  jwt: {
    secret: parseEnvString(process.env.JWT_SECRET, 'sua_chave_secreta_aqui_mude_em_producao'),
    expiresIn: parseEnvString(process.env.JWT_EXPIRES_IN, '24h'),
    refreshSecret: parseEnvString(process.env.JWT_REFRESH_SECRET, 'refresh_secret_aqui'),
    refreshExpiresIn: parseEnvString(process.env.JWT_REFRESH_EXPIRES_IN, '7d'),
  },
  password: {
    saltRounds: parseEnvNumber(process.env.BCRYPT_SALT_ROUNDS, 12),
    minLength: parseEnvNumber(process.env.PASSWORD_MIN_LENGTH, 8),
  },
  session: {
    secret: parseEnvString(process.env.SESSION_SECRET, 'sua_chave_secreta_de_sessao'),
    cookieMaxAge: parseEnvNumber(process.env.SESSION_COOKIE_MAX_AGE, 86400000),
    cookieSecure: parseEnvBoolean(process.env.SESSION_COOKIE_SECURE, false),
    cookieHttpOnly: parseEnvBoolean(process.env.SESSION_COOKIE_HTTP_ONLY, true),
  },
  cors: {
    origin: parseEnvArray(process.env.CORS_ORIGIN, ['http://localhost:3000', 'http://localhost:4200']),
    credentials: parseEnvBoolean(process.env.CORS_CREDENTIALS, true),
    methods: parseEnvArray(process.env.CORS_METHODS, ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE']),
  },
  rateLimit: {
    windowMs: parseEnvNumber(process.env.RATE_LIMIT_WINDOW_MS, 900000),
    maxRequests: parseEnvNumber(process.env.RATE_LIMIT_MAX_REQUESTS, 100),
    skipSuccessfulRequests: parseEnvBoolean(process.env.RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS, false),
  },
}));

export const securityConfig = {
  jwt: {
    secret: parseEnvString(process.env.JWT_SECRET, 'sua_chave_secreta_aqui_mude_em_producao'),
    expiresIn: parseEnvString(process.env.JWT_EXPIRES_IN, '24h'),
    refreshSecret: parseEnvString(process.env.JWT_REFRESH_SECRET, 'refresh_secret_aqui'),
    refreshExpiresIn: parseEnvString(process.env.JWT_REFRESH_EXPIRES_IN, '7d'),
  },
  password: {
    saltRounds: parseEnvNumber(process.env.BCRYPT_SALT_ROUNDS, 12),
    minLength: parseEnvNumber(process.env.PASSWORD_MIN_LENGTH, 8),
  },
  session: {
    secret: parseEnvString(process.env.SESSION_SECRET, 'sua_chave_secreta_de_sessao'),
    cookieMaxAge: parseEnvNumber(process.env.SESSION_COOKIE_MAX_AGE, 86400000),
    cookieSecure: parseEnvBoolean(process.env.SESSION_COOKIE_SECURE, false),
    cookieHttpOnly: parseEnvBoolean(process.env.SESSION_COOKIE_HTTP_ONLY, true),
  },
  cors: {
    origin: parseEnvArray(process.env.CORS_ORIGIN, ['http://localhost:3000', 'http://localhost:4200']),
    credentials: parseEnvBoolean(process.env.CORS_CREDENTIALS, true),
    methods: parseEnvArray(process.env.CORS_METHODS, ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE']),
  },
  rateLimit: {
    windowMs: parseEnvNumber(process.env.RATE_LIMIT_WINDOW_MS, 900000),
    maxRequests: parseEnvNumber(process.env.RATE_LIMIT_MAX_REQUESTS, 100),
    skipSuccessfulRequests: parseEnvBoolean(process.env.CORS_CREDENTIALS, true),
  },
};
