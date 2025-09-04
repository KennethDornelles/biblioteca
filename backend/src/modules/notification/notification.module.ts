import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';

// Services
import { NotificationService } from './notification.service';
import { AdvancedNotificationService } from './advanced-notification.service';
import { NotificationTemplateService } from './notification-template.service';
import { NotificationPreferencesService } from './notification-preferences.service';
import { NotificationSchedulerService } from './notification-scheduler.service';
import { NotificationBulkService } from './notification-bulk.service';
import { PushNotificationService } from './push-notification.service';

// Controllers
import { NotificationController } from './notification.controller';
import { NotificationTemplateController } from './notification-template.controller';
import { NotificationPreferencesController } from './notification-preferences.controller';
import { NotificationBulkController } from './notification-bulk.controller';

// Processors
// import { NotificationProcessor } from '../queue/processors/notification.processor';

// Listeners
// import { NotificationEventListener } from '../../events/listeners/notification-event.listener';

@Module({
  imports: [
    ConfigModule,
    EventEmitterModule,
    BullModule.registerQueue({
      name: 'notification',
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    }),
  ],
  controllers: [
    NotificationController,
    NotificationTemplateController,
    NotificationPreferencesController,
    NotificationBulkController,
  ],
  providers: [
    // Core Services
    NotificationService,
    AdvancedNotificationService,
    NotificationTemplateService,
    NotificationPreferencesService,
    NotificationSchedulerService,
    NotificationBulkService,
    PushNotificationService,
    
    // Queue Processors
    // NotificationProcessor,
    
    // Event Listeners
    // NotificationEventListener,
  ],
  exports: [
    NotificationService,
    AdvancedNotificationService,
    NotificationTemplateService,
    NotificationPreferencesService,
    NotificationSchedulerService,
    NotificationBulkService,
    PushNotificationService,
  ],
})
export class NotificationModule {}
