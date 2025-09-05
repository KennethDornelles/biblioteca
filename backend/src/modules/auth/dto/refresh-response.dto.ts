import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponseDto {
  @ApiProperty({ description: 'Novo token de acesso JWT' })
  accessToken: string;

  @ApiProperty({ description: 'Novo token de refresh JWT' })
  refreshToken: string;
}
