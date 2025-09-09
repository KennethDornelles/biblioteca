import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para resposta padronizada de erro
 */
export class ErrorResponseDto {
  @ApiProperty({
    description: 'Código de status HTTP',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Timestamp do erro',
    example: '2025-09-09T17:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Caminho da requisição que gerou o erro',
    example: '/api/users',
  })
  path: string;

  @ApiProperty({
    description: 'Método HTTP da requisição',
    example: 'POST',
  })
  method: string;

  @ApiProperty({
    description: 'Mensagem principal do erro',
    example: 'Dados inválidos fornecidos',
  })
  message: string;

  @ApiProperty({
    description: 'Detalhes adicionais sobre o erro',
    example: 'Verifique os campos destacados e tente novamente',
    required: false,
  })
  details?: string;

  @ApiProperty({
    description: 'Erros específicos por campo',
    example: {
      email: ['Email deve ser um endereço válido'],
      password: ['Senha deve ter pelo menos 8 caracteres'],
    },
    required: false,
  })
  errors?: Record<string, string[]>;

  @ApiProperty({
    description: 'ID único da requisição para rastreamento',
    example: 'req_1725904200000_abc123def',
    required: false,
  })
  requestId?: string;
}

/**
 * DTO para resposta padronizada de sucesso
 */
export class SuccessResponseDto<T = any> {
  @ApiProperty({
    description: 'Indica se a operação foi bem-sucedida',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Dados retornados pela operação',
  })
  data: T;

  @ApiProperty({
    description: 'Timestamp da resposta',
    example: '2025-09-09T17:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Caminho da requisição',
    example: '/api/users',
  })
  path: string;

  @ApiProperty({
    description: 'Método HTTP da requisição',
    example: 'GET',
  })
  method: string;

  @ApiProperty({
    description: 'ID único da requisição para rastreamento',
    example: 'req_1725904200000_abc123def',
    required: false,
  })
  requestId?: string;

  @ApiProperty({
    description: 'Tempo de execução da requisição em milissegundos',
    example: 150,
    required: false,
  })
  executionTime?: number;
}

/**
 * DTO para erro de validação específico
 */
export class ValidationErrorDto {
  @ApiProperty({
    description: 'Sempre será 400 para erros de validação',
    example: 400,
  })
  statusCode: 400 = 400;

  @ApiProperty({
    description: 'Timestamp do erro',
    example: '2025-09-09T17:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Caminho da requisição que gerou o erro',
    example: '/api/users',
  })
  path: string;

  @ApiProperty({
    description: 'Método HTTP da requisição',
    example: 'POST',
  })
  method: string;

  @ApiProperty({
    description: 'Mensagem padrão para erros de validação',
    example: 'Dados inválidos fornecidos',
  })
  message: string = 'Dados inválidos fornecidos';

  @ApiProperty({
    description: 'Detalhes específicos do erro de validação',
    example: 'Verifique os campos destacados e tente novamente',
  })
  details: string = 'Verifique os campos destacados e tente novamente';

  @ApiProperty({
    description: 'Mapeamento de erros por campo',
    example: {
      email: ['Email é obrigatório', 'Email deve ser um endereço válido'],
      password: ['Senha é obrigatória', 'Senha deve ter pelo menos 8 caracteres'],
      name: ['Nome é obrigatório', 'Nome deve ter pelo menos 2 caracteres'],
    },
  })
  errors: Record<string, string[]>;

  @ApiProperty({
    description: 'ID único da requisição para rastreamento',
    example: 'req_1725904200000_abc123def',
    required: false,
  })
  requestId?: string;
}

/**
 * DTO para erro de autorização
 */
export class UnauthorizedErrorDto {
  @ApiProperty({
    description: 'Sempre será 401 para erros de autorização',
    example: 401,
  })
  statusCode: 401 = 401;

  @ApiProperty({
    description: 'Timestamp do erro',
    example: '2025-09-09T17:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Caminho da requisição que gerou o erro',
    example: '/api/users',
  })
  path: string;

  @ApiProperty({
    description: 'Método HTTP da requisição',
    example: 'POST',
  })
  method: string;

  @ApiProperty({
    description: 'Mensagem de erro de autorização',
    example: 'Token de autenticação inválido',
  })
  message: string;

  @ApiProperty({
    description: 'Instruções para resolução do erro',
    example: 'Faça login novamente para obter um token válido',
  })
  details: string;

  @ApiProperty({
    description: 'ID único da requisição para rastreamento',
    example: 'req_1725904200000_abc123def',
    required: false,
  })
  requestId?: string;
}

/**
 * DTO para erro de acesso negado
 */
export class ForbiddenErrorDto {
  @ApiProperty({
    description: 'Sempre será 403 para erros de acesso negado',
    example: 403,
  })
  statusCode: 403 = 403;

  @ApiProperty({
    description: 'Timestamp do erro',
    example: '2025-09-09T17:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Caminho da requisição que gerou o erro',
    example: '/api/users',
  })
  path: string;

  @ApiProperty({
    description: 'Método HTTP da requisição',
    example: 'POST',
  })
  method: string;

  @ApiProperty({
    description: 'Mensagem de acesso negado',
    example: 'Acesso negado',
  })
  message: string;

  @ApiProperty({
    description: 'Explicação sobre a falta de permissão',
    example: 'Você não tem permissão para acessar este recurso',
  })
  details: string;

  @ApiProperty({
    description: 'ID único da requisição para rastreamento',
    example: 'req_1725904200000_abc123def',
    required: false,
  })
  requestId?: string;
}

/**
 * DTO para erro de recurso não encontrado
 */
export class NotFoundErrorDto {
  @ApiProperty({
    description: 'Sempre será 404 para recursos não encontrados',
    example: 404,
  })
  statusCode: 404 = 404;

  @ApiProperty({
    description: 'Timestamp do erro',
    example: '2025-09-09T17:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Caminho da requisição que gerou o erro',
    example: '/api/users',
  })
  path: string;

  @ApiProperty({
    description: 'Método HTTP da requisição',
    example: 'GET',
  })
  method: string;

  @ApiProperty({
    description: 'Mensagem de recurso não encontrado',
    example: 'Recurso não encontrado',
  })
  message: string;

  @ApiProperty({
    description: 'Detalhes sobre o recurso não encontrado',
    example: 'O item que você está procurando não existe ou foi removido',
  })
  details: string;

  @ApiProperty({
    description: 'ID único da requisição para rastreamento',
    example: 'req_1725904200000_abc123def',
    required: false,
  })
  requestId?: string;
}

/**
 * DTO para erro de conflito
 */
export class ConflictErrorDto {
  @ApiProperty({
    description: 'Sempre será 409 para erros de conflito',
    example: 409,
  })
  statusCode: 409 = 409;

  @ApiProperty({
    description: 'Timestamp do erro',
    example: '2025-09-09T17:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Caminho da requisição que gerou o erro',
    example: '/api/users',
  })
  path: string;

  @ApiProperty({
    description: 'Método HTTP da requisição',
    example: 'POST',
  })
  method: string;

  @ApiProperty({
    description: 'Mensagem de conflito',
    example: 'Valor duplicado para email',
  })
  message: string;

  @ApiProperty({
    description: 'Detalhes sobre o conflito',
    example: 'Já existe um registro com este email. Tente usar um valor diferente',
  })
  details: string;

  @ApiProperty({
    description: 'ID único da requisição para rastreamento',
    example: 'req_1725904200000_abc123def',
    required: false,
  })
  requestId?: string;
}
