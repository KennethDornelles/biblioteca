import { IsString, IsNumber, IsOptional, Min, Max, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'ID do usuário que está fazendo a review', example: 'clx1234567890abcdef' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'ID do material sendo avaliado', example: 'clx1234567890abcdef' })
  @IsString()
  @IsNotEmpty()
  materialId: string;

  @ApiProperty({ 
    description: 'Nota da avaliação (1-5)', 
    example: 5, 
    minimum: 1, 
    maximum: 5 
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ 
    description: 'Comentário opcional sobre o material', 
    example: 'Excelente livro, muito bem estruturado e didático.',
    maxLength: 1000
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
