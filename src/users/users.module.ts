import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerModule } from '../logger/app-logger.module';
import { EmailService } from '../email/email.service';

@Module({
  imports: [LoggerModule],
  providers: [UsersResolver, UsersService, PrismaService, EmailService],
  exports: [UsersService, PrismaService],
})
export class UsersModule {}
