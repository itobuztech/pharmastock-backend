import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountService {
    constructor(
        private prisma: PrismaService,
        private readonly logger: Logger
    ) { }

    async findOne(): Promise<any> {
        return await this.prisma.user.findFirst({
            include: {
                role: {
                    select: {
                        userType: true
                    }
                }
            }
        });
    }
}
