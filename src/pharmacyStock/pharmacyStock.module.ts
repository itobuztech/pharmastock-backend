import { Module } from '@nestjs/common';
import { PharmacyStockService } from './pharmacyStock.service';
import { PharmacyStockResolver } from './pharmacyStock.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerModule } from '../logger/app-logger.module';

@Module({
  imports: [LoggerModule],
  providers: [PharmacyStockResolver, PharmacyStockService, PrismaService],
  exports: [PharmacyStockService, PrismaService],
})
export class PharmacyStockModule {}
