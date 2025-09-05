import { Logger } from '@nestjs/common';

/**
 * Utilitários para logging da aplicação
 */
export class AppLogger extends Logger {
  constructor(context: string) {
    super(context);
  }

  /**
   * Log de informação
   */
  info(message: string, context?: string): void {
    super.log(message, context);
  }

  /**
   * Log de erro
   */
  error(message: string, trace?: string, context?: string): void {
    super.error(message, trace, context);
  }

  /**
   * Log de aviso
   */
  warn(message: string, context?: string): void {
    super.warn(message, context);
  }

  /**
   * Log de debug (apenas em desenvolvimento)
   */
  debug(message: string, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      super.debug(message, context);
    }
  }

  /**
   * Log de verbose (apenas em desenvolvimento)
   */
  verbose(message: string, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      super.verbose(message, context);
    }
  }
}

/**
 * Logger padrão da aplicação
 */
export const appLogger = new AppLogger('App');
