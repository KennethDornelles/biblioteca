import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EventsModule } from '../../events/events.module';

@Module({
  imports: [EventsModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Exportar para uso em outros módulos
})
export class UserModule {}
