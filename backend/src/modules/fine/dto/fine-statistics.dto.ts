import { ApiProperty } from '@nestjs/swagger';
import { FineStatus } from '../../../enums';

export class FineStatisticsDto {
  @ApiProperty({ description: 'Total de multas', example: 150 })
  total: number;

  @ApiProperty({ description: 'Multas pendentes', example: 45 })
  pending: number;

  @ApiProperty({ description: 'Multas pagas', example: 80 })
  paid: number;

  @ApiProperty({ description: 'Multas canceladas', example: 15 })
  cancelled: number;

  @ApiProperty({ description: 'Multas parceladas', example: 10 })
  installment: number;

  @ApiProperty({ description: 'Valor total das multas', example: 2500.75 })
  totalAmount: number;

  @ApiProperty({ description: 'Valor total das multas pendentes', example: 750.25 })
  pendingAmount: number;

  @ApiProperty({ description: 'Valor total das multas pagas', example: 1500.50 })
  paidAmount: number;

  @ApiProperty({ description: 'Valor médio das multas', example: 16.67 })
  averageAmount: number;

  @ApiProperty({ description: 'Contagem por status', example: { PENDING: 45, PAID: 80, CANCELLED: 15, INSTALLMENT: 10 } })
  byStatus: Record<FineStatus, number>;

  @ApiProperty({ description: 'Contagem por mês', example: { '2024-01': 25, '2024-02': 30 } })
  byMonth: Record<string, number>;

  @ApiProperty({ description: 'Total de multas vencidas hoje', example: 3 })
  dueToday: number;

  @ApiProperty({ description: 'Total de multas que vencem amanhã', example: 8 })
  dueTomorrow: number;

  @ApiProperty({ description: 'Total de multas em atraso', example: 12 })
  overdue: number;

  @ApiProperty({ description: 'Valor total das multas em atraso', example: 200.00 })
  overdueAmount: number;

  @ApiProperty({ description: 'Dias médios de atraso', example: 5.3 })
  averageDaysOverdue: number;
}
