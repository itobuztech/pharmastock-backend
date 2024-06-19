import { Module } from '@nestjs/common';
import { ItemCategoryService } from './itemCategory.service';
import { ItemCategoryResolver } from './itemCategory.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerModule } from '../logger/app-logger.module';

@Module({
  imports: [LoggerModule],
  providers: [ItemCategoryResolver, ItemCategoryService, PrismaService],
  exports: [ItemCategoryService, PrismaService],
})
export class ItemCategoryModule {}
