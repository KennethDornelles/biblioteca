import { IsString, IsOptional, IsBoolean, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSystemConfigurationDto {
  @ApiPropertyOptional({ 
    description: 'Novo valor da configuração', 
    example: 'Biblioteca Central da Universidade',
    maxLength: 1000
  })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  value?: string;

  @ApiPropertyOptional({ 
    description: 'Nova descrição da configuração', 
    example: 'Nome da biblioteca exibido no sistema',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Novo tipo de dados da configuração', 
    example: 'string',
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  type?: string;

  @ApiPropertyOptional({ 
    description: 'Nova categoria da configuração', 
    example: 'library',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  category?: string;

  @ApiPropertyOptional({ 
    description: 'Indica se a configuração pode ser editada', 
    example: true
  })
  @IsOptional()
  @IsBoolean()
  editable?: boolean;
}
