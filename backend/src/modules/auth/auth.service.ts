import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { LogoutResponseDto } from './dto/logout-response.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findAuthDataByEmail(email);
      
      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return null;
      }

      // Remover senha do objeto retornado
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      return null;
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    const user = await this.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!user.active) {
      throw new UnauthorizedException('Usuário inativo');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      type: user.type,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      { expiresIn: '7d' }
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        active: user.active,
      },
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<RefreshResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken);
      
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Token inválido');
      }

      const user = await this.userService.findById(payload.sub);
      
      if (!user || !user.active) {
        throw new UnauthorizedException('Usuário não encontrado ou inativo');
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
        type: user.type,
        name: user.name,
      };

      const newAccessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(
        { ...newPayload, type: 'refresh' },
        { expiresIn: '7d' }
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token de refresh inválido ou expirado');
      }
      throw error;
    }
  }

  async logout(): Promise<LogoutResponseDto> {
    // Em uma implementação mais robusta, você pode adicionar o token à blacklist
    return {
      message: 'Logout realizado com sucesso',
      timestamp: new Date().toISOString(),
    };
  }

  async getProfile(userId: string) {
    const user = await this.userService.findById(userId);
    
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const { password: _, ...result } = user;
    return result;
  }
}
