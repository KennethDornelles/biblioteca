import { ApiProperty } from '@nestjs/swagger';
import { ReviewResponseDto } from './review-response.dto';

export class PaginatedReviewsDto {
  @ApiProperty({ description: 'Lista de reviews', type: [ReviewResponseDto] })
  data: ReviewResponseDto[];

  @ApiProperty({ description: 'Número da página atual', example: 1 })
  page: number;

  @ApiProperty({ description: 'Itens por página', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total de reviews', example: 150 })
  total: number;

  @ApiProperty({ description: 'Total de páginas', example: 15 })
  totalPages: number;

  @ApiProperty({ description: 'Indica se há próxima página', example: true })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Indica se há página anterior', example: false })
  hasPrevPage: boolean;
}
