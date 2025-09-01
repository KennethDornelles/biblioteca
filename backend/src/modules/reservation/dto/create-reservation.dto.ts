import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDateString, Min, Max, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReservationStatus } from '../../../enums';

export class CreateReservationDto {
  @ApiProperty({ description: 'ID do usuário que está fazendo a reserva', example: 'clx1234567890abcdef' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'ID do material a ser reservado', example: 'clx1234567890abcdef' })
  @IsString()
  @IsNotEmpty()
  materialId: string;

  @ApiPropertyOptional({ description: 'Data da reserva (padrão: data atual)', example: '2024-01-15T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  reservationDate?: string;

  @ApiProperty({ description: 'Data de expiração da reserva', example: '2024-01-22T10:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  expirationDate: string;

  @ApiPropertyOptional({ description: 'Status da reserva (padrão: ACTIVE)', enum: ReservationStatus, example: ReservationStatus.ACTIVE })
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @ApiPropertyOptional({ description: 'Prioridade da reserva (1-10, padrão: 1)', example: 1, minimum: 1, maximum: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  priority?: number;

  @ApiPropertyOptional({ description: 'Observações adicionais sobre a reserva', example: 'Reserva para pesquisa acadêmica', maxLength: 500 })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  observations?: string;
}
