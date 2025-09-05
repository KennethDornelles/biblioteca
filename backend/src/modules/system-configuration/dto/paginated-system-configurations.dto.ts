import { ApiProperty } from '@nestjs/swagger';
import { SystemConfigurationResponseDto } from './system-configuration-response.dto';

export class PaginatedSystemConfigurationsDto {
  @ApiProperty({ description: 'Lista de configurações', type: [SystemConfigurationResponseDto] })
  data: SystemConfigurationResponseDto[];

  @ApiProperty({ description: 'Número da página atual', example: 1 })
  page: number;

  @ApiProperty({ description: 'Itens por página', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total de configurações', example: 50 })
  total: number;

  @ApiProperty({ description: 'Total de páginas', example: 5 })
  totalPages: number;

  @ApiProperty({ description: 'Indica se há próxima página', example: true })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Indica se há página anterior', example: false })
  hasPrevPage: boolean;
}
