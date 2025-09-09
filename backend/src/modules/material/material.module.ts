import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { CatalogController } from './catalog.controller';
import { SearchController } from './search.controller';
import { PrismaService } from '@database/prisma.service';

@Module({
  controllers: [MaterialController, CatalogController, SearchController],
  providers: [MaterialService, PrismaService],
  exports: [MaterialService],
})
export class MaterialModule {}
