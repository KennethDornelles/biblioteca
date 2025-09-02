import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    try {
      // Verificar se o token é do tipo refresh
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Token inválido');
      }

      // Verificar se o usuário ainda existe e está ativo
      const user = await this.userService.findById(payload.sub);
      
      if (!user || !user.active) {
        throw new UnauthorizedException('Usuário não encontrado ou inativo');
      }

      // Retornar dados do usuário para uso nos guards e controllers
      return {
        sub: user.id,
        email: user.email,
        type: user.type,
        name: user.name,
        active: user.active,
      };
    } catch (error) {
      throw new UnauthorizedException('Token de refresh inválido');
    }
  }
}
