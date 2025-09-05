import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SystemConfiguration {
  @ApiProperty({ description: 'ID único da configuração', example: 'clx1234567890abcdef' })
  id: string;

  @ApiProperty({ description: 'Chave única da configuração', example: 'library.name' })
  key: string;

  @ApiProperty({ description: 'Valor da configuração', example: 'Biblioteca Central da Universidade' })
  value: string;

  @ApiPropertyOptional({ description: 'Descrição da configuração', example: 'Nome da biblioteca exibido no sistema' })
  description?: string;

  @ApiProperty({ description: 'Tipo de dados da configuração', example: 'string' })
  type: string;

  @ApiProperty({ description: 'Categoria da configuração', example: 'library' })
  category: string;

  @ApiProperty({ description: 'Indica se a configuração pode ser editada', example: true })
  editable: boolean;

  @ApiProperty({ description: 'Data de criação', example: '2024-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização', example: '2024-01-15T10:30:00Z' })
  updatedAt: Date;
}
