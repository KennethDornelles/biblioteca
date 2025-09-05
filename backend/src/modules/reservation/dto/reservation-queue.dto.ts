import { ApiProperty } from '@nestjs/swagger';

export class ReservationQueueItemDto {
  @ApiProperty({ description: 'ID do usuário na fila', example: 'clx1234567890abcdef' })
  userId: string;

  @ApiProperty({ description: 'Nome do usuário na fila', example: 'João Silva' })
  userName: string;

  @ApiProperty({ description: 'Data da reserva', example: '2024-01-15T10:00:00Z' })
  reservationDate: Date;

  @ApiProperty({ description: 'Prioridade da reserva', example: 5 })
  priority: number;

  @ApiProperty({ description: 'Dias de espera na fila', example: 3 })
  daysWaiting: number;
}

export class ReservationQueueDto {
  @ApiProperty({ description: 'ID do material', example: 'clx1234567890abcdef' })
  materialId: string;

  @ApiProperty({ description: 'Título do material', example: 'Introdução à Programação' })
  materialTitle: string;

  @ApiProperty({ description: 'Fila de usuários aguardando', type: [ReservationQueueItemDto] })
  queue: ReservationQueueItemDto[];

  @ApiProperty({ description: 'Total de usuários aguardando', example: 5 })
  totalWaiting: number;

  @ApiProperty({ description: 'Tempo estimado de espera em dias', example: 15 })
  estimatedWaitTime: number;

  @ApiProperty({ description: 'Indica se o material está disponível', example: false })
  isAvailable: boolean;

  @ApiProperty({ description: 'Data estimada de disponibilidade', example: '2024-02-15T10:00:00Z' })
  estimatedAvailabilityDate?: Date;
}
