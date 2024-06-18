import { Module } from '@nestjs/common';
import { WarehouseStockService } from './warehouseStock.service';
import { WarehouseStockResolver } from './warehouseStock.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerModule } from '../logger/app-logger.module';

@Module({
  imports: [LoggerModule],
  providers: [WarehouseStockResolver, WarehouseStockService, PrismaService],
  exports: [WarehouseStockService, PrismaService],
})
export class WarehouseStockModule {}
