import { Injectable, UnprocessableEntityException, Logger } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger
  ) { }

  async findAll(): Promise<User[]> {
    this.logger.log("log 00");
    return await this.prisma.user.findMany({});
  }

  async findOne(email: string): Promise<any> {
    return await this.prisma.user.findFirst({
      where: {
        email
      },
      include: {
        role: {
          select: {
            userType: true
          }
        }
      }
    });
  }

  async create(createUserInput: CreateUserInput) {
    const defaultRole = await this.prisma.role.findFirst({
      select: {
        id: true,
      }
    });
    if (!defaultRole) throw new UnprocessableEntityException("Can't find the role related information")
    return await this.prisma.user.create({
      data: {
        email: createUserInput.email,
        username: createUserInput.username,
        password: createUserInput.password,
        roleId: defaultRole.id
      }
    });
  }

  async findOneById(id: string): Promise<User> {
    return await this.prisma.user.findFirst({
      where: {
        id
      },
    });
  }

  async updateUser(id: string, data) {
    await this.prisma.user.update({
      where: {
        id
      },
      data
    })
  }
}
