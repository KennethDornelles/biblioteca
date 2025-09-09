import { Global, Module } from '@nestjs/common';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../modules/auth/guards/roles.guard';
import { LocalAuthGuard } from '../../modules/auth/guards/local-auth.guard';
import { AuthModule } from '../../modules/auth/auth.module';

@Global()
@Module({
  imports: [AuthModule],
  providers: [JwtAuthGuard, RolesGuard, LocalAuthGuard],
  exports: [JwtAuthGuard, RolesGuard, LocalAuthGuard],
})
export class GuardsModule {}
