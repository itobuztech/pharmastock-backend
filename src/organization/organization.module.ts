import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationResolver } from './organization.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerModule } from '../logger/app-logger.module';

@Module({
  imports: [LoggerModule],
  providers: [OrganizationResolver, OrganizationService, PrismaService],
  exports: [OrganizationService, PrismaService],
})
export class OrganizationModule {}
