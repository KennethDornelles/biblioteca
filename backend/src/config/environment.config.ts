import { IsEnum, IsNumber, IsString, IsBoolean, validateSync, IsOptional } from 'class-validator';
import { plainToClass, Transform, Type } from 'class-transformer';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  PORT: number = 3000;

  @IsString()
  APP_NAME: string = 'Biblioteca Universitária API';

  @IsString()
  APP_VERSION: string = '1.0.0';

  @IsString()
  APP_URL: string = 'http://localhost:3000';

  // Database
  @IsString()
  DATABASE_URL: string;

  // JWT Configuration
  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRES_IN: string = '24h';

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  JWT_REFRESH_EXPIRES_IN: string = '7d';

  // Security
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  BCRYPT_SALT_ROUNDS: number = 12;

  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  PASSWORD_MIN_LENGTH: number = 8;

  // Cookie Security
  @IsString()
  @IsOptional()
  COOKIE_SECRET?: string;

  // CORS
  @IsString()
  CORS_ORIGIN: string = 'http://localhost:3000,http://localhost:4200';

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  CORS_CREDENTIALS: boolean = true;

  @IsString()
  CORS_METHODS: string = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  // Redis
  @IsString()
  @IsOptional()
  REDIS_URL?: string;

  @IsString()
  REDIS_HOST: string = 'localhost';

  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  REDIS_PORT: number = 6379;

  @IsString()
  @IsOptional()
  REDIS_PASSWORD?: string;

  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  REDIS_DB: number = 0;

  // Email
  @IsString()
  SMTP_HOST: string;

  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  SMTP_PORT: number;

  @IsString()
  SMTP_USER: string;

  @IsString()
  SMTP_PASS: string;

  @IsString()
  SMTP_FROM: string;

  @IsString()
  SMTP_FROM_NAME: string = 'Biblioteca Universitária';

  // Logging
  @IsString()
  LOG_LEVEL: string = 'info';

  @IsString()
  LOG_FORMAT: string = 'json';

  @IsString()
  LOG_FILE: string = 'logs/app.log';

  // Rate Limiting
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  RATE_LIMIT_WINDOW_MS: number = 900000; // 15 minutes

  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  RATE_LIMIT_MAX_REQUESTS: number = 100;

  // Swagger
  @IsString()
  SWAGGER_TITLE: string = 'Biblioteca Universitária API';

  @IsString()
  SWAGGER_DESCRIPTION: string = 'API para gerenciamento de biblioteca universitária';

  @IsString()
  SWAGGER_VERSION: string = '1.0.0';

  @IsString()
  SWAGGER_PATH: string = 'api-docs';
}

export function validateEnvironment(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => Object.values(error.constraints || {}))
      .flat()
      .join(', ');
    
    throw new Error(`Environment validation failed: ${errorMessages}`);
  }

  // Validate critical secrets in production
  if (validatedConfig.NODE_ENV === Environment.Production) {
    if (validatedConfig.JWT_SECRET === 'sua_chave_secreta_aqui_mude_em_producao') {
      throw new Error('JWT_SECRET must be changed from default value in production');
    }
    
    if (validatedConfig.JWT_REFRESH_SECRET === 'refresh_secret_aqui') {
      throw new Error('JWT_REFRESH_SECRET must be changed from default value in production');
    }

    if (validatedConfig.DATABASE_URL.includes('localhost')) {
      throw new Error('DATABASE_URL should not point to localhost in production');
    }
  }

  return validatedConfig;
}
