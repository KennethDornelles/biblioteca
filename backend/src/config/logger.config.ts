import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { EnvironmentVariables } from './environment.config';

export function createLogger(config: EnvironmentVariables) {
  const isDevelopment = config.NODE_ENV === 'development';
  
  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: isDevelopment
        ? winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('BibliotecaAPI', {
              colors: true,
              prettyPrint: true,
            }),
          )
        : winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json(),
          ),
    }),
  ];

  // Add file transport for production and development
  if (!isDevelopment || config.LOG_FILE) {
    transports.push(
      new winston.transports.File({
        filename: config.LOG_FILE,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json(),
        ),
      }),
    );
  }

  // Add error file transport for production
  if (!isDevelopment) {
    transports.push(
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json(),
        ),
      }),
    );
  }

  return WinstonModule.createLogger({
    level: config.LOG_LEVEL,
    transports,
    exceptionHandlers: [
      new winston.transports.File({ 
        filename: 'logs/exceptions.log',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json(),
        ),
      }),
    ],
    rejectionHandlers: [
      new winston.transports.File({ 
        filename: 'logs/rejections.log',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json(),
        ),
      }),
    ],
  });
}
