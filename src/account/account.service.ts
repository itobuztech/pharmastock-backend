import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResetPasswordInput } from './dto/reset-password.input';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AccountService {
    constructor(
        private prisma: PrismaService,
        private readonly usersService: UsersService,
        private readonly logger: Logger,
    ) { }

    async findOne(ctx: any): Promise<any> {
        const user = await this.usersService.findOneById(ctx.req.user.userId);
        const { password, ...result } = user;
        return result;
    }

    async resetPassword(ctx: any, resetPasswordInput: ResetPasswordInput): Promise<Boolean> {
        const user = await this.usersService.findOneById(ctx.req.user.userId);
        const { password, ...result } = user;

        const newPassword = await bcrypt.hash(resetPasswordInput.newPassword, 10);
        const match = await bcrypt.compare(resetPasswordInput.oldPassword, password);
        if (match) await this.usersService.updateUser(ctx.req.user.userId, { password: newPassword });
        else throw new BadRequestException("Password doesn't match");

        return true;
    }
}
