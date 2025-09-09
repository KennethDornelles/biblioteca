import { IsString, IsNotEmpty, IsOptional, IsInt, IsNumber, IsDate, IsEnum, IsArray, MinLength, MaxLength, Min, Max } from 'class-validator';
import { MaterialStatus, MaterialType } from '../../../enums';

export class CreateMaterialDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(500)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  author: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  isbn?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  issn?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  publisher?: string;

  @IsInt()
  @IsOptional()
  @Min(1000)
  @Max(9999)
  publicationYear?: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  edition?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  category: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  subcategory?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  location: string;

  @IsEnum(MaterialStatus)
  @IsOptional()
  status?: MaterialStatus;

  @IsEnum(MaterialType)
  @IsOptional()
  type?: MaterialType;

  @IsInt()
  @IsOptional()
  @Min(1)
  numberOfPages?: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  language?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  keywords?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  assetNumber?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  acquisitionValue?: number;

  @IsDate()
  @IsOptional()
  acquisitionDate?: Date;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  supplier?: string;
}