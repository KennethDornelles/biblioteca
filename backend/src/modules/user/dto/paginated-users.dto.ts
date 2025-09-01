import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class PaginatedUsersDto {
  @ApiProperty({ description: 'Lista de usuários' })
  data: UserResponseDto[];

  @ApiProperty({ description: 'Página atual' })
  page: number;

  @ApiProperty({ description: 'Limite de itens por página' })
  limit: number;

  @ApiProperty({ description: 'Total de itens' })
  total: number;

  @ApiProperty({ description: 'Total de páginas' })
  totalPages: number;

  @ApiProperty({ description: 'Indica se há próxima página' })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Indica se há página anterior' })
  hasPrevPage: boolean;
}
