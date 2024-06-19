import { Module } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { PharmacyResolver } from './pharmacy.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerModule } from '../logger/app-logger.module';

@Module({
  imports: [LoggerModule],
  providers: [PharmacyResolver, PharmacyService, PrismaService],
  exports: [PharmacyService, PrismaService],
})
export class PharmacyModule {}
