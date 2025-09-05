import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { UserModule } from '../user/user.module';

describe('AuthModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        AuthModule,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have AuthService defined', () => {
    const authService = module.get<AuthService>(AuthService);
    expect(authService).toBeDefined();
  });

  it('should have AuthController defined', () => {
    const authController = module.get<AuthController>(AuthController);
    expect(authController).toBeDefined();
  });

  it('should have JwtStrategy defined', () => {
    const jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    expect(jwtStrategy).toBeDefined();
  });

  it('should have LocalStrategy defined', () => {
    const localStrategy = module.get<LocalStrategy>(LocalStrategy);
    expect(localStrategy).toBeDefined();
  });

  it('should have JwtRefreshStrategy defined', () => {
    const jwtRefreshStrategy = module.get<JwtRefreshStrategy>(JwtRefreshStrategy);
    expect(jwtRefreshStrategy).toBeDefined();
  });

  it('should have UserModule imported', () => {
    const userModule = module.get(UserModule);
    expect(userModule).toBeDefined();
  });

  it('should have PassportModule imported', () => {
    const passportModule = module.get(PassportModule);
    expect(passportModule).toBeDefined();
  });

  it('should have JwtModule configured', () => {
    const jwtModule = module.get(JwtModule);
    expect(jwtModule).toBeDefined();
  });

  it('should export AuthService', () => {
    const authService = module.get<AuthService>(AuthService);
    expect(authService).toBeDefined();
  });
});
