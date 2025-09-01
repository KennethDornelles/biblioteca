import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '../../../enums';

export class ReservationStatisticsDto {
  @ApiProperty({ description: 'Total de reservas', example: 150 })
  total: number;

  @ApiProperty({ description: 'Reservas ativas', example: 45 })
  active: number;

  @ApiProperty({ description: 'Reservas atendidas', example: 80 })
  fulfilled: number;

  @ApiProperty({ description: 'Reservas expiradas', example: 20 })
  expired: number;

  @ApiProperty({ description: 'Reservas canceladas', example: 5 })
  cancelled: number;

  @ApiProperty({ description: 'Prioridade média das reservas', example: 3.2 })
  averagePriority: number;

  @ApiProperty({ description: 'Contagem por status', example: { ACTIVE: 45, FULFILLED: 80, EXPIRED: 20, CANCELLED: 5 } })
  byStatus: Record<ReservationStatus, number>;

  @ApiProperty({ description: 'Contagem por mês', example: { '2024-01': 25, '2024-02': 30 } })
  byMonth: Record<string, number>;

  @ApiProperty({ description: 'Total de reservas expiradas hoje', example: 3 })
  expiredToday: number;

  @ApiProperty({ description: 'Total de reservas que expiram amanhã', example: 8 })
  expiringTomorrow: number;

  @ApiProperty({ description: 'Reservas com prioridade alta (8-10)', example: 15 })
  highPriority: number;

  @ApiProperty({ description: 'Reservas com prioridade média (4-7)', example: 60 })
  mediumPriority: number;

  @ApiProperty({ description: 'Reservas com prioridade baixa (1-3)', example: 75 })
  lowPriority: number;
}
