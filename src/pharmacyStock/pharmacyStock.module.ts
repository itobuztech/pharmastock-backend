import { Module } from '@nestjs/common';
import { PharmacyStockService } from './pharmacyStock.service';
import { PharmacyStockResolver } from './pharmacyStock.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerModule } from '../logger/app-logger.module';
import { StockMovementModule } from '../stockMovement/stockMovement.module';
import { WarehouseStockModule } from '../warehouseStocks/warehouseStock.module';

@Module({
  imports: [LoggerModule, StockMovementModule, WarehouseStockModule],
  providers: [PharmacyStockResolver, PharmacyStockService, PrismaService],
  exports: [PharmacyStockService, PrismaService],
})
export class PharmacyStockModule {}
