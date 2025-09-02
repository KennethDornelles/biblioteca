import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { EventBusService } from './services/event-bus.service';
import { EventFactoryService } from './services/event-factory.service';
import { LoanSchedulerService } from './services/loan-scheduler.service';
import { EmailEventListener } from './listeners/email-event.listener';
import { NotificationEventListener } from './listeners/notification-event.listener';
import { AuditEventListener } from './listeners/audit-event.listener';
import { QueueModule } from '../modules/queue/queue.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      // Configurações do EventEmitter
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    ScheduleModule.forRoot(), // Módulo para tarefas agendadas
    QueueModule, // Importa o módulo de filas para os listeners
  ],
  providers: [
    EventBusService,
    EventFactoryService,
    LoanSchedulerService,
    EmailEventListener,
    NotificationEventListener,
    AuditEventListener,
  ],
  exports: [
    EventBusService,
    EventFactoryService,
    EventEmitterModule,
  ],
})
export class EventsModule {}
