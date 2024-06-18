import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseResolver } from './warehouse.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerModule } from '../logger/app-logger.module';

@Module({
  imports: [LoggerModule],
  providers: [WarehouseResolver, WarehouseService, PrismaService],
  exports: [WarehouseService, PrismaService],
})
export class WarehouseModule {}
