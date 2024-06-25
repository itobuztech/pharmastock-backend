import { Module } from '@nestjs/common';
import { WarehouseStockService } from './warehouseStock.service';
import { WarehouseStockResolver } from './warehouseStock.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerModule } from '../logger/app-logger.module';
import { StockMovementModule } from '../stockMovement/stockMovement.module';

@Module({
  imports: [LoggerModule, StockMovementModule],
  providers: [WarehouseStockResolver, WarehouseStockService, PrismaService],
  exports: [WarehouseStockService, PrismaService],
})
export class WarehouseStockModule {}
