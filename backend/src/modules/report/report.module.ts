import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReportService } from './report.service';

@Module({
  imports: [ConfigModule],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
