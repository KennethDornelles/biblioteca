import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { QueueIntegrationService } from './queue-integration.service';
import { EmailProcessor } from './processors/email.processor';
import { NotificationProcessor } from './processors/notification.processor';
import { ReportProcessor } from './processors/report.processor';
import { MaintenanceProcessor } from './processors/maintenance.processor';
import { EmailModule } from '../email/email.module';
import { NotificationModule } from '../notification/notification.module';
import { ReportModule } from '../report/report.module';
import { MaintenanceModule } from '../maintenance/maintenance.module';

@Module({
  imports: [
    EmailModule,
    NotificationModule,
    ReportModule,
    MaintenanceModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          password: configService.get('redis.password'),
          db: configService.get('redis.db'),
          keyPrefix: configService.get('redis.keyPrefix'),
        },
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
        settings: {
          stalledInterval: 30000,
          maxStalledCount: 1,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      {
        name: 'email',
        defaultJobOptions: {
          priority: 1,
          delay: 0,
        },
      },
      {
        name: 'notification',
        defaultJobOptions: {
          priority: 2,
          delay: 0,
        },
      },
      {
        name: 'report',
        defaultJobOptions: {
          priority: 3,
          delay: 0,
        },
      },
      {
        name: 'maintenance',
        defaultJobOptions: {
          priority: 4,
          delay: 0,
        },
      },
    ),
  ],
  controllers: [QueueController],
  providers: [
    QueueService,
    QueueIntegrationService,
    EmailProcessor,
    NotificationProcessor,
    ReportProcessor,
    MaintenanceProcessor,
  ],
  exports: [QueueService, QueueIntegrationService, BullModule],
})
export class QueueModule {}
