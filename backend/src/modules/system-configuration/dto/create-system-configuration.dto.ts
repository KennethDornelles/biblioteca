import { IsString, IsOptional, IsBoolean, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSystemConfigurationDto {
  @ApiProperty({ 
    description: 'Chave única da configuração', 
    example: 'library.name',
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  key: string;

  @ApiProperty({ 
    description: 'Valor da configuração', 
    example: 'Biblioteca Central da Universidade',
    maxLength: 1000
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  value: string;

  @ApiPropertyOptional({ 
    description: 'Descrição da configuração', 
    example: 'Nome da biblioteca exibido no sistema',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiProperty({ 
    description: 'Tipo de dados da configuração', 
    example: 'string',
    maxLength: 50
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  type: string;

  @ApiProperty({ 
    description: 'Categoria da configuração', 
    example: 'library',
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  category: string;

  @ApiPropertyOptional({ 
    description: 'Indica se a configuração pode ser editada', 
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  editable?: boolean;
}
