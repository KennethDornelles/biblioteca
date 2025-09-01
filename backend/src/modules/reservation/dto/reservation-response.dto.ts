import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReservationStatus } from '../../../enums';

export class ReservationResponseDto {
  @ApiProperty({ description: 'ID único da reserva', example: 'clx1234567890abcdef' })
  id: string;

  @ApiProperty({ description: 'ID do usuário que fez a reserva', example: 'clx1234567890abcdef' })
  userId: string;

  @ApiProperty({ description: 'ID do material reservado', example: 'clx1234567890abcdef' })
  materialId: string;

  @ApiProperty({ description: 'Data da reserva', example: '2024-01-15T10:00:00Z' })
  reservationDate: Date;

  @ApiProperty({ description: 'Data de expiração da reserva', example: '2024-01-22T10:00:00Z' })
  expirationDate: Date;

  @ApiProperty({ description: 'Status atual da reserva', enum: ReservationStatus, example: ReservationStatus.ACTIVE })
  status: ReservationStatus;

  @ApiProperty({ description: 'Prioridade da reserva', example: 1, minimum: 1, maximum: 10 })
  priority: number;

  @ApiPropertyOptional({ description: 'Observações da reserva', example: 'Reserva para pesquisa acadêmica' })
  observations?: string;

  @ApiProperty({ description: 'Data de criação do registro', example: '2024-01-15T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização', example: '2024-01-15T10:00:00Z' })
  updatedAt: Date;

  @ApiProperty({ description: 'Rótulo do status em português', example: 'Ativa' })
  statusLabel: string;

  @ApiProperty({ description: 'Cor do status para interface', example: 'success' })
  statusColor: string;

  @ApiProperty({ description: 'Ícone do status', example: 'clock' })
  statusIcon: string;

  @ApiProperty({ description: 'Indica se a reserva está expirada', example: false })
  isExpired: boolean;

  @ApiProperty({ description: 'Dias até a expiração (negativo se expirada)', example: 5 })
  daysUntilExpiration: number;

  @ApiPropertyOptional({ description: 'Informações do usuário' })
  user?: {
    id: string;
    name: string;
    email: string;
    registrationNumber?: string;
  };

  @ApiPropertyOptional({ description: 'Informações do material' })
  material?: {
    id: string;
    title: string;
    author: string;
    isbn?: string;
    assetNumber?: string;
    status: string;
  };
}
