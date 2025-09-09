import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Request, Response } from 'express';

/**
 * Interface para resposta padronizada de sucesso
 */
interface SuccessResponse<T = any> {
  success: true;
  data: T;
  timestamp: string;
  path: string;
  method: string;
  requestId?: string;
  executionTime?: number;
}

/**
 * Interceptor que padroniza respostas de sucesso e adiciona metadados úteis
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, SuccessResponse<T>> {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T>> {
    const startTime = Date.now();
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const requestId = this.generateRequestId();
    
    // Adicionar requestId ao cabeçalho da resposta
    response.setHeader('X-Request-ID', requestId);

    return next.handle().pipe(
      map((data) => {
        const executionTime = Date.now() - startTime;
        
        // Log de sucesso
        this.logSuccess(request, response, executionTime, requestId);

        // Se a resposta já é um objeto com estrutura específica (como paginação),
        // mantém a estrutura original
        if (this.isStructuredResponse(data)) {
          return data;
        }

        // Padronizar resposta de sucesso
        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
          method: request.method,
          requestId,
          executionTime,
        };
      }),
      tap(() => {
        const executionTime = Date.now() - startTime;
        
        // Log apenas para requisições lentas (> 1 segundo)
        if (executionTime > 1000) {
          this.logger.warn(
            `Slow request detected: ${request.method} ${request.url} - ${executionTime}ms`,
            { requestId, executionTime },
          );
        }
      }),
    );
  }

  /**
   * Verifica se a resposta já tem uma estrutura específica que deve ser preservada
   */
  private isStructuredResponse(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      (
        // Resposta de paginação
        ('data' in data && 'page' in data && 'total' in data) ||
        // Resposta de autenticação
        ('accessToken' in data) ||
        // Resposta já padronizada
        ('success' in data) ||
        // Resposta de upload de arquivo
        ('filename' in data && 'url' in data) ||
        // Resposta de estatísticas
        ('statistics' in data) ||
        // Resposta de configuração
        ('config' in data)
      )
    );
  }

  /**
   * Faz log de requisições bem-sucedidas
   */
  private logSuccess(
    request: Request,
    response: Response,
    executionTime: number,
    requestId: string,
  ): void {
    const { method, url, ip } = request;
    const { statusCode } = response;

    this.logger.log(
      `${method} ${url} - ${statusCode} - ${executionTime}ms`,
      {
        requestId,
        method,
        url,
        statusCode,
        executionTime,
        ip,
        userAgent: request.headers['user-agent'],
      },
    );
  }

  /**
   * Gera ID único para rastreamento da requisição
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
