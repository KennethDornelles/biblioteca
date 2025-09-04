import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
