import { ApiProperty } from '@nestjs/swagger';
import { ReservationResponseDto } from './reservation-response.dto';

export class PaginatedReservationsDto {
  @ApiProperty({ description: 'Lista de reservas da página atual', type: [ReservationResponseDto] })
  data: ReservationResponseDto[];

  @ApiProperty({ description: 'Número da página atual', example: 1 })
  page: number;

  @ApiProperty({ description: 'Número de itens por página', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total de reservas encontradas', example: 150 })
  total: number;

  @ApiProperty({ description: 'Total de páginas', example: 15 })
  totalPages: number;

  @ApiProperty({ description: 'Indica se existe próxima página', example: true })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Indica se existe página anterior', example: false })
  hasPrevPage: boolean;
}
