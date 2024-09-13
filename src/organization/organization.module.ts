import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationResolver } from './organization.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerModule } from '../logger/app-logger.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [LoggerModule, EmailModule],
  providers: [OrganizationResolver, OrganizationService, PrismaService],
  exports: [OrganizationService, PrismaService],
})
export class OrganizationModule {}
