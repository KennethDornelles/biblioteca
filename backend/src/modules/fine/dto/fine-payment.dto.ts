import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, Min, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class FinePaymentDto {
  @ApiProperty({ description: 'ID da multa a ser paga', example: 'clx1234567890abcdef' })
  @IsString()
  @IsNotEmpty()
  fineId: string;

  @ApiProperty({ description: 'Valor do pagamento', example: 15.50, minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  amount: number;

  @ApiProperty({ description: 'Método de pagamento', example: 'PIX', maxLength: 50 })
  @IsString()
  @Length(2, 50)
  paymentMethod: string;

  @ApiPropertyOptional({ description: 'Data do pagamento (padrão: data atual)', example: '2024-02-10T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @ApiPropertyOptional({ description: 'Observações sobre o pagamento', example: 'Pagamento via PIX', maxLength: 500 })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  observations?: string;

  @ApiPropertyOptional({ description: 'Comprovante de pagamento', example: 'PIX-20240210-001', maxLength: 100 })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  receiptNumber?: string;
}

export class FineInstallmentDto {
  @ApiProperty({ description: 'ID da multa a ser parcelada', example: 'clx1234567890abcdef' })
  @IsString()
  @IsNotEmpty()
  fineId: string;

  @ApiProperty({ description: 'Número de parcelas', example: 3, minimum: 2, maximum: 12 })
  @IsNumber()
  @Min(2)
  @Type(() => Number)
  numberOfInstallments: number;

  @ApiProperty({ description: 'Valor de cada parcela', example: 5.17, minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  installmentAmount: number;

  @ApiProperty({ description: 'Data de vencimento da primeira parcela', example: '2024-02-15T10:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  firstDueDate: string;

  @ApiPropertyOptional({ description: 'Observações sobre o parcelamento', example: 'Parcelamento em 3x', maxLength: 500 })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  observations?: string;
}
