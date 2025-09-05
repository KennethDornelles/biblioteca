import { ApiProperty } from '@nestjs/swagger';
import { FineResponseDto } from './fine-response.dto';

export class PaginatedFinesDto {
  @ApiProperty({ description: 'Lista de multas da página atual', type: [FineResponseDto] })
  data: FineResponseDto[];

  @ApiProperty({ description: 'Número da página atual', example: 1 })
  page: number;

  @ApiProperty({ description: 'Número de itens por página', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total de multas encontradas', example: 150 })
  total: number;

  @ApiProperty({ description: 'Total de páginas', example: 15 })
  totalPages: number;

  @ApiProperty({ description: 'Indica se existe próxima página', example: true })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Indica se existe página anterior', example: false })
  hasPrevPage: boolean;
}
