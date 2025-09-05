import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../../../enums';

export class UserProfileDto {
  @ApiProperty({ description: 'ID do usuário' })
  id: string;

  @ApiProperty({ description: 'Nome do usuário' })
  name: string;

  @ApiProperty({ description: 'Email do usuário' })
  email: string;

  @ApiProperty({ description: 'Tipo do usuário', enum: UserType })
  type: UserType;

  @ApiProperty({ description: 'Status ativo do usuário' })
  active: boolean;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'Token de acesso JWT' })
  accessToken: string;

  @ApiProperty({ description: 'Token de refresh JWT' })
  refreshToken: string;

  @ApiProperty({ description: 'Dados do usuário', type: UserProfileDto })
  user: UserProfileDto;
}
