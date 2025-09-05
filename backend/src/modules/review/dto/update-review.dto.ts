import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateReviewDto {
  @ApiPropertyOptional({ 
    description: 'Nova nota da avaliação (1-5)', 
    example: 4, 
    minimum: 1, 
    maximum: 5 
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ 
    description: 'Novo comentário sobre o material', 
    example: 'Muito bom livro, recomendo para iniciantes.',
    maxLength: 1000
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
