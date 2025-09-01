import { registerAs } from '@nestjs/config';

export default registerAs('security', () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'sua_chave_secreta_aqui_mude_em_producao',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_aqui',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  password: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,
    minLength: parseInt(process.env.PASSWORD_MIN_LENGTH, 10) || 8,
  },
  session: {
    secret: process.env.SESSION_SECRET || 'sua_chave_secreta_de_sessao',
    cookieMaxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE, 10) || 86400000,
    cookieSecure: process.env.SESSION_COOKIE_SECURE === 'true',
    cookieHttpOnly: process.env.SESSION_COOKIE_HTTP_ONLY !== 'false',
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:4200'],
    credentials: process.env.CORS_CREDENTIALS !== 'false',
    methods: process.env.CORS_METHODS?.split(',') || ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
    skipSuccessfulRequests: process.env.RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS === 'true',
  },
}));

export const securityConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'sua_chave_secreta_aqui_mude_em_producao',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_aqui',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  password: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,
    minLength: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 8,
  },
  session: {
    secret: process.env.SESSION_SECRET || 'sua_chave_secreta_de_sessao',
    cookieMaxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE, 10) || 86400000,
    cookieSecure: process.env.SESSION_COOKIE_SECURE === 'true',
    cookieHttpOnly: process.env.SESSION_COOKIE_HTTP_ONLY !== 'false',
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:4200'],
    credentials: process.env.CORS_CREDENTIALS !== 'false',
    methods: process.env.CORS_METHODS?.split(',') || ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
    skipSuccessfulRequests: process.env.CORS_CREDENTIALS === 'true',
  },
};
