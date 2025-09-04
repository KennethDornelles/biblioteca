import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { AUTH_CONFIG } from '../../../config/auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AUTH_CONFIG.jwt.secret,
    });
  }

  async validate(payload: any) {
    try {
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
      throw new UnauthorizedException('Token inválido');
    }
  }
}
