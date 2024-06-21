import { Module } from '@nestjs/common';
import { StockMovementService } from './stockMovement.service';
import { StockMovementResolver } from './stockMovement.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerModule } from '../logger/app-logger.module';

@Module({
  imports: [LoggerModule],
  providers: [StockMovementResolver, StockMovementService, PrismaService],
  exports: [StockMovementService, PrismaService],
})
export class StockMovementModule {}
