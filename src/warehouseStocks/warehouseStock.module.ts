import { Module } from '@nestjs/common';
import { WarehouseStockService } from './warehouseStock.service';
import { WarehouseStockResolver } from './warehouseStock.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerModule } from '../logger/app-logger.module';
import { StockMovementModule } from '../stockMovement/stockMovement.module';
import { AccountService } from '../account/account.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [LoggerModule, StockMovementModule],
  providers: [
    WarehouseStockResolver,
    WarehouseStockService,
    PrismaService,
    AccountService,
    UsersService,
  ],
  exports: [WarehouseStockService, PrismaService],
})
export class WarehouseStockModule {}
