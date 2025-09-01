import { Module } from '@nestjs/common';
import { FineService } from './fine.service';
import { FineController } from './fine.controller';

@Module({
  controllers: [FineController],
  providers: [FineService],
  exports: [FineService], // Exportar para uso em outros módulos
})
export class FineModule {}
