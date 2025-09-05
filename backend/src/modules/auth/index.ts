// Módulo principal
export { AuthModule } from './auth.module';

// Serviços
export { AuthService } from './auth.service';

// Controllers
export { AuthController } from './auth.controller';

// Estratégias
export { JwtStrategy } from './strategies/jwt.strategy';
export { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
export { LocalStrategy } from './strategies/local.strategy';

// Guards
export { JwtAuthGuard } from './guards/jwt-auth.guard';
export { LocalAuthGuard } from './guards/local-auth.guard';
export { RolesGuard } from './guards/roles.guard';

// Decorators
export { Roles } from './decorators/roles.decorator';
export { CurrentUser } from './decorators/current-user.decorator';

// DTOs
export { LoginDto } from './dto/login.dto';
export { LoginResponseDto, UserProfileDto } from './dto/login-response.dto';
export { RefreshTokenDto } from './dto/refresh-token.dto';
export { RefreshResponseDto } from './dto/refresh-response.dto';
export { LogoutResponseDto } from './dto/logout-response.dto';
