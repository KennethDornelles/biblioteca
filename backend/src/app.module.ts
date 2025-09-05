import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { MaterialModule } from './modules/material/material.module';
import { LoanModule } from './modules/loan/loan.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { FineModule } from './modules/fine/fine.module';
import { ReviewModule } from './modules/review/review.module';
import { SystemConfigurationModule } from './modules/system-configuration/system-configuration.module';
import { AuthModule } from './modules/auth/auth.module';
import { QueueModule } from './modules/queue/queue.module';
import { EventsModule } from './events/events.module';
import { NotificationModule } from './modules/notification/notification.module';
import { EnvironmentVariables } from './config';

// Validação simplificada temporariamente
const simpleValidate = (config: Record<string, unknown>) => {
  console.log('🔧 Validating environment with simplified validation...');
  return {
    ...config,
    NODE_ENV: config.NODE_ENV || 'development',
    PORT: parseInt(config.PORT as string) || 3001,
    DATABASE_URL: config.DATABASE_URL || '',
  } as EnvironmentVariables;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate: simpleValidate,
      cache: true,
      expandVariables: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => [
        {
          name: 'short',
          ttl: 1000, // 1 second
          limit: 10, // 10 requests per second
        },
        {
          name: 'medium',
          ttl: 60000, // 1 minute
          limit: 100, // 100 requests per minute
        },
        {
          name: 'long',
          ttl: configService.get('RATE_LIMIT_WINDOW_MS') || 900000,
          limit: configService.get('RATE_LIMIT_MAX_REQUESTS') || 100,
        },
      ],
    }),
    EventsModule, // Módulo de eventos deve ser importado primeiro
    AuthModule, 
    UserModule, 
    MaterialModule, 
    LoanModule, 
    ReservationModule, 
    FineModule, 
    ReviewModule, 
    SystemConfigurationModule,
    QueueModule,
    NotificationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
