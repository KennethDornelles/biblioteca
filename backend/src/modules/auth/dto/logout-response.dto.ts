import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({ description: 'Mensagem de confirmação' })
  message: string;

  @ApiProperty({ description: 'Timestamp do logout' })
  timestamp: string;
}
