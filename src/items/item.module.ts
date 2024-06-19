import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemResolver } from './item.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerModule } from '../logger/app-logger.module';

@Module({
  imports: [LoggerModule],
  providers: [ItemResolver, ItemService, PrismaService],
  exports: [ItemService, PrismaService],
})
export class ItemModule {}
