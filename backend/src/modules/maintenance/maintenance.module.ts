import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MaintenanceService } from './maintenance.service';

@Module({
  imports: [ConfigModule],
  providers: [MaintenanceService],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}
