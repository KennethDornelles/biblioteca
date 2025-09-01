import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService], // Exportar para uso em outros módulos
})
export class ReservationModule {}
