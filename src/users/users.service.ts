import * as bcrypt from 'bcrypt';
import {
  Injectable,
  UnprocessableEntityException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from '../prisma/prisma.service';
import { User, Role, Prisma } from '@prisma/client';
import { PaginationArgs } from '../pagination/pagination.dto';
import { UserSearchObject } from '../types/extended-types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {}

  async findAll(
    searchText?: string,
    pagination?: Boolean,
    paginationArgs?: PaginationArgs,
  ): Promise<{ users: User[]; total: number }> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    try {
      let whereClause: Prisma.UserWhereInput | {} = {};

      if (searchText) {
        whereClause = {
          OR: [
            { name: { contains: searchText, mode: 'insensitive' } },
            { username: { contains: searchText, mode: 'insensitive' } },
            { email: { contains: searchText, mode: 'insensitive' } },
            {
              organization: {
                name: { contains: searchText, mode: 'insensitive' },
              },
            },
          ],
        };
      }

      const totalCount = await this.prisma.user.count({
        where: whereClause,
      });

      let searchObject: UserSearchObject = {
        where: whereClause,
        include: { organization: true, role: true },
      };
      if (pagination) {
        searchObject = {
          skip,
          take,
          where: whereClause,
          include: { organization: true, role: true },
        };
      }

      const users = await this.prisma.user.findMany(searchObject);

      return { users, total: totalCount };
    } catch (error) {
      throw error;
    }
  }

  async findOne(email: string): Promise<User & { role: Partial<Role> }> {
    return await this.prisma.user.findFirst({
      where: {
        email,
      },
      include: {
        role: true,
        organization: true,
      },
    });
  }

  async findOneByToken(
    emailConfirmationToken: string,
  ): Promise<User & { role: Partial<Role> }> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          emailConfirmationToken,
        },
        include: {
          role: true,
          organization: true,
        },
      });

      if (!user) {
        throw new Error(
          'Their is no user with this token Or the token has expired Or The user is already confirmed!!',
        );
      }

      const confirmingUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailConfirmationToken: '',
          isEmailConfirmed: true,
        },
      });

      if (!confirmingUser) {
        throw new Error('User not confirmed. Please try after some time!');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async create(createUserInput: CreateUserInput) {
    ////////////DEFAULT ROLE SETUP///////////
    const defaultRole = await this.prisma.role.findFirst({
      where: {
        userType: createUserInput.role,
      },
      select: {
        id: true,
      },
    });

    if (!defaultRole)
      throw new UnprocessableEntityException(
        "Can't find the role related information",
      );
    ////////////DEFAULT ROLE SETTUP///////////
    const password = await bcrypt.hash(createUserInput.password, 10);

    let data: any = {
      emailConfirmationToken: createUserInput.confirmationToken || null,
      email: createUserInput.email,
      username: createUserInput.username,
      password,
      name: createUserInput.name,
      role: {
        connect: { id: defaultRole.id },
      },
    };

    if (createUserInput?.orgId) {
      data = {
        ...data,
        organization: {
          connect: { id: createUserInput?.orgId },
        },
      };
    }
    try {
      return await this.prisma.user.create({
        data,
        include: {
          role: true,
          organization: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed due to some reason');
    }
  }

  async findOneById(id: string): Promise<User & { role: Partial<Role> }> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
      include: {
        role: true,
        organization: true,
      },
    });
    return user;
  }

  async updateUser(id: string, data) {
    await this.prisma.user.update({
      where: {
        id,
      },
      data,
      include: { organization: true, role: true },
    });
  }
}
