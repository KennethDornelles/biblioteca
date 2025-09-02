import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Review {
  @ApiProperty({ description: 'ID único da review', example: 'clx1234567890abcdef' })
  id: string;

  @ApiProperty({ description: 'ID do usuário que fez a review', example: 'clx1234567890abcdef' })
  userId: string;

  @ApiProperty({ description: 'ID do material avaliado', example: 'clx1234567890abcdef' })
  materialId: string;

  @ApiProperty({ description: 'Nota da avaliação (1-5)', example: 5 })
  rating: number;

  @ApiPropertyOptional({ description: 'Comentário da review', example: 'Excelente livro!' })
  comment?: string;

  @ApiProperty({ description: 'Data da review', example: '2024-01-15T10:30:00Z' })
  reviewDate: Date;

  @ApiProperty({ description: 'Data de criação', example: '2024-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização', example: '2024-01-15T10:30:00Z' })
  updatedAt: Date;
}
