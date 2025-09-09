import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ValidationError } from 'class-validator';

/**
 * Interface para resposta de erro padronizada
 */
interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  details?: string;
  errors?: Record<string, string[]>;
  requestId?: string;
}

/**
 * Filtro global de exceções que padroniza as respostas de erro
 * e torna os erros mais informativos para o usuário
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Gerar ID único da requisição para rastreamento
    const requestId = this.generateRequestId();

    // Determinar status e mensagem baseado no tipo de erro
    const errorInfo = this.getErrorInfo(exception);
    
    // Preparar resposta de erro padronizada
    const errorResponse: ErrorResponse = {
      statusCode: errorInfo.status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: errorInfo.message,
      requestId,
    };

    // Adicionar detalhes específicos se disponíveis
    if (errorInfo.details) {
      errorResponse.details = errorInfo.details;
    }

    if (errorInfo.errors) {
      errorResponse.errors = errorInfo.errors;
    }

    // Log do erro para monitoramento
    this.logError(exception, request, errorResponse, requestId);

    // Enviar resposta
    response.status(errorInfo.status).json(errorResponse);
  }

  /**
   * Determina informações do erro baseado no tipo de exceção
   */
  private getErrorInfo(exception: unknown): {
    status: number;
    message: string;
    details?: string;
    errors?: Record<string, string[]>;
  } {
    // Erro HTTP do NestJS
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      
      if (typeof response === 'object' && response !== null) {
        const responseObj = response as any;
        
        // Erro de validação
        if (responseObj.message && Array.isArray(responseObj.message)) {
          return {
            status: exception.getStatus(),
            message: 'Dados inválidos fornecidos',
            details: 'Verifique os campos destacados e tente novamente',
            errors: this.formatValidationErrors(responseObj.message),
          };
        }
        
        return {
          status: exception.getStatus(),
          message: responseObj.message || this.getDefaultMessage(exception.getStatus()),
          details: responseObj.error,
        };
      }
      
      return {
        status: exception.getStatus(),
        message: typeof response === 'string' ? response : this.getDefaultMessage(exception.getStatus()),
      };
    }

    // Erros do Prisma (banco de dados)
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handlePrismaError(exception);
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Dados inválidos para operação no banco de dados',
        details: 'Verifique os dados fornecidos e tente novamente',
      };
    }

    // Erro de JWT
    if (exception instanceof Error) {
      if (exception.name === 'JsonWebTokenError') {
        return {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Token de autenticação inválido',
          details: 'Faça login novamente para obter um token válido',
        };
      }

      if (exception.name === 'TokenExpiredError') {
        return {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Token de autenticação expirado',
          details: 'Sua sessão expirou, faça login novamente',
        };
      }

      if (exception.name === 'NotBeforeError') {
        return {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Token ainda não é válido',
          details: 'Aguarde um momento e tente novamente',
        };
      }
    }

    // Erro genérico
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro interno do servidor',
      details: 'Algo deu errado. Nossa equipe foi notificada e está trabalhando para resolver o problema',
    };
  }

  /**
   * Trata erros específicos do Prisma
   */
  private handlePrismaError(error: Prisma.PrismaClientKnownRequestError): {
    status: number;
    message: string;
    details?: string;
  } {
    switch (error.code) {
      case 'P2000':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Valor muito longo para o campo',
          details: 'Um ou mais campos contêm valores que excedem o limite permitido',
        };

      case 'P2001':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Registro não encontrado',
          details: 'O item que você está procurando não existe ou foi removido',
        };

      case 'P2002':
        const field = error.meta?.target as string[];
        const fieldName = field && field.length > 0 ? field[0] : 'campo';
        return {
          status: HttpStatus.CONFLICT,
          message: `Valor duplicado para ${fieldName}`,
          details: `Já existe um registro com este ${fieldName}. Tente usar um valor diferente`,
        };

      case 'P2003':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Violação de chave estrangeira',
          details: 'Este registro não pode ser processado porque depende de outro que não existe',
        };

      case 'P2004':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Restrição de banco de dados violada',
          details: 'A operação não pode ser concluída devido a regras de negócio',
        };

      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Registro não encontrado para atualização',
          details: 'O item que você está tentando modificar não existe',
        };

      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Erro na operação do banco de dados',
          details: 'Ocorreu um problema ao processar sua solicitação',
        };
    }
  }

  /**
   * Formata erros de validação para resposta mais legível
   */
  private formatValidationErrors(errors: string[]): Record<string, string[]> {
    const formattedErrors: Record<string, string[]> = {};
    
    errors.forEach(error => {
      // Extrair nome do campo e mensagem (formato: "campo mensagem")
      const parts = error.split(' ');
      const field = parts[0];
      const message = parts.slice(1).join(' ');
      
      if (!formattedErrors[field]) {
        formattedErrors[field] = [];
      }
      
      formattedErrors[field].push(message || error);
    });

    return formattedErrors;
  }

  /**
   * Retorna mensagem padrão baseada no status HTTP
   */
  private getDefaultMessage(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Solicitação inválida';
      case HttpStatus.UNAUTHORIZED:
        return 'Acesso não autorizado';
      case HttpStatus.FORBIDDEN:
        return 'Acesso negado';
      case HttpStatus.NOT_FOUND:
        return 'Recurso não encontrado';
      case HttpStatus.CONFLICT:
        return 'Conflito de dados';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'Dados não processáveis';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'Muitas solicitações';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'Erro interno do servidor';
      case HttpStatus.BAD_GATEWAY:
        return 'Gateway inválido';
      case HttpStatus.SERVICE_UNAVAILABLE:
        return 'Serviço indisponível';
      default:
        return 'Erro desconhecido';
    }
  }

  /**
   * Faz log detalhado do erro para monitoramento
   */
  private logError(
    exception: unknown,
    request: Request,
    errorResponse: ErrorResponse,
    requestId: string,
  ): void {
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'Unknown';
    
    const logData = {
      requestId,
      method,
      url,
      ip,
      userAgent,
      statusCode: errorResponse.statusCode,
      message: errorResponse.message,
      timestamp: errorResponse.timestamp,
    };

    // Log baseado na severidade do erro
    if (errorResponse.statusCode >= 500) {
      this.logger.error(
        `Internal Server Error - ${exception}`,
        {
          ...logData,
          stack: exception instanceof Error ? exception.stack : undefined,
        },
      );
    } else if (errorResponse.statusCode >= 400) {
      this.logger.warn(`Client Error - ${errorResponse.message}`, logData);
    } else {
      this.logger.log(`Request processed with status ${errorResponse.statusCode}`, logData);
    }
  }

  /**
   * Gera ID único para rastreamento da requisição
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
