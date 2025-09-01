import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FineStatus } from '../../../enums';

export class FineResponseDto {
  @ApiProperty({ description: 'ID único da multa', example: 'clx1234567890abcdef' })
  id: string;

  @ApiProperty({ description: 'ID do empréstimo relacionado', example: 'clx1234567890abcdef' })
  loanId: string;

  @ApiProperty({ description: 'ID do usuário que recebeu a multa', example: 'clx1234567890abcdef' })
  userId: string;

  @ApiProperty({ description: 'Valor da multa', example: 15.50 })
  amount: number;

  @ApiProperty({ description: 'Número de dias em atraso', example: 5 })
  daysOverdue: number;

  @ApiProperty({ description: 'Data de criação da multa', example: '2024-01-15T10:00:00Z' })
  creationDate: Date;

  @ApiProperty({ description: 'Data de vencimento da multa', example: '2024-02-15T10:00:00Z' })
  dueDate: Date;

  @ApiPropertyOptional({ description: 'Data de pagamento da multa', example: '2024-02-10T10:00:00Z' })
  paymentDate?: Date;

  @ApiProperty({ description: 'Status atual da multa', enum: FineStatus, example: FineStatus.PENDING })
  status: FineStatus;

  @ApiPropertyOptional({ description: 'Descrição da multa', example: 'Multa por atraso na devolução' })
  description?: string;

  @ApiProperty({ description: 'Data de criação do registro', example: '2024-01-15T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização', example: '2024-01-15T10:00:00Z' })
  updatedAt: Date;

  @ApiProperty({ description: 'Rótulo do status em português', example: 'Pendente' })
  statusLabel: string;

  @ApiProperty({ description: 'Cor do status para interface', example: 'warning' })
  statusColor: string;

  @ApiProperty({ description: 'Ícone do status', example: 'clock' })
  statusIcon: string;

  @ApiProperty({ description: 'Indica se a multa está em atraso', example: false })
  isOverdue: boolean;

  @ApiProperty({ description: 'Dias até o vencimento (negativo se em atraso)', example: 5 })
  daysUntilDue: number;

  @ApiProperty({ description: 'Valor formatado da multa', example: 'R$ 15,50' })
  formattedAmount: string;

  @ApiPropertyOptional({ description: 'Informações do usuário' })
  user?: {
    id: string;
    name: string;
    email: string;
    registrationNumber?: string;
  };

  @ApiPropertyOptional({ description: 'Informações do empréstimo' })
  loan?: {
    id: string;
    materialId: string;
    loanDate: Date;
    dueDate: Date;
    material?: {
      title: string;
      author: string;
    };
  };
}
