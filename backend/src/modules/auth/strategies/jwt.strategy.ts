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
      secretOrKey: configService.get<string>('JWT_SECRET') || AUTH_CONFIG.jwt.secret,
    });
  }

  async validate(payload: any) {
    try {
      console.log('🔍 JwtStrategy.validate - Payload recebido:', payload);
      
      // Verificar se o usuário ainda existe e está ativo
      console.log('🔍 JwtStrategy.validate - Buscando usuário com ID:', payload.sub);
      const user = await this.userService.findById(payload.sub);
      console.log('🔍 JwtStrategy.validate - Usuário encontrado:', user ? 'Sim' : 'Não');
      
      if (!user || !user.active) {
        console.log('❌ JwtStrategy.validate - Usuário não encontrado ou inativo');
        throw new UnauthorizedException('Usuário não encontrado ou inativo');
      }

      // Retornar dados do usuário para uso nos guards e controllers
      const userData = {
        sub: user.id,
        email: user.email,
        type: user.type,
        name: user.name,
        active: user.active,
      };
      
      console.log('🔍 JwtStrategy.validate - Dados do usuário retornados:', userData);
      return userData;
    } catch (error) {
      console.error('❌ JwtStrategy.validate - Erro:', error);
      console.error('❌ JwtStrategy.validate - Stack trace:', error.stack);
      throw new UnauthorizedException('Token inválido');
    }
  }
}
