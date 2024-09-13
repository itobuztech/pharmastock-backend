import { Module } from '@nestjs/common';
import { PharmacyStockService } from './pharmacyStock.service';
import { PharmacyStockResolver } from './pharmacyStock.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerModule } from '../logger/app-logger.module';
import { StockMovementModule } from '../stockMovement/stockMovement.module';
import { WarehouseStockModule } from '../warehouseStocks/warehouseStock.module';
import { AccountService } from '../account/account.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';

@Module({
  imports: [LoggerModule, StockMovementModule, WarehouseStockModule],
  providers: [
    PharmacyStockResolver,
    PharmacyStockService,
    PrismaService,
    AccountService,
    UsersService,
    EmailService,
  ],
  exports: [PharmacyStockService, PrismaService],
})
export class PharmacyStockModule {}
