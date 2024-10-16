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
import { InviteUsersInput } from './dto/invite-user.input';
import { generateInvitePassword, generateToken } from 'src/util/helper';
import { EmailService } from '../email/email.service';
import { SignUpStaffInput } from './dto/signUp-staff.input';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger,
    private readonly emailService: EmailService,
  ) {}

  async findAll(
    searchText?: string,
    pagination?: Boolean,
    paginationArgs?: PaginationArgs,
  ): Promise<{ users: User[]; total: number }> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    try {
      let whereClause: Prisma.UserWhereInput | {} = { status: true };

      if (searchText) {
        whereClause = {
          ...whereClause,
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

      const users = await this.prisma.user.findMany({
        ...searchObject,
        orderBy: [
          {
            updatedAt: 'desc',
          },
          {
            createdAt: 'asc',
          },
        ],
      });

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
    const { role, email } = createUserInput;

    try {
      const emailPresesnt = await this.prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (emailPresesnt) {
        throw new Error('Email already present!');
      }
      ////////////DEFAULT ROLE SETUP///////////
      const defaultRole = await this.prisma.role.findFirst({
        where: {
          userType: role,
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
        pharmacy: true,
      },
    });
    return user;
  }

  async updateUser(id: string, data) {
    if (data.pharmacyId) {
      const pharmacyPresent = await this.prisma.organization.findFirst({
        where: {
          User: {
            some: {
              id,
            },
          },
          Pharmacy: {
            some: {
              id: data.pharmacyId,
            },
          },
        },
      });

      if (!pharmacyPresent) {
        throw Error(
          'The pharmacy provided is not present in the organisation!',
        );
      }
    }
    try {
      await this.prisma.user.update({
        where: {
          id,
        },
        data,
        include: { organization: true, role: true },
      });
    } catch (error) {
      console.log('Error=', error);
      throw new Error('Failed to update the User!');
    }
  }

  async deleteUserBySuperAdmin(data) {
    const id = data.id;
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id,
        },
      });

      if (!user) {
        throw new Error('No User found!');
      }

      const deleteUser = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          status: false,
        },
      });

      if (!deleteUser) {
        throw new Error(
          'Could not delete the User! Please try after some time.',
        );
      }

      return { message: 'User deleted successfully.' };
    } catch (error) {}
  }

  async inviteUsers(user, inviteUsersInput: InviteUsersInput) {
    const userId = user.userId;
    const userRole = user.role.userType;

    let { email, pharmacyId, organizationId, role } = inviteUsersInput;

    if (pharmacyId && role === 'ADMIN') {
      throw new Error('Pharmacy can not be directly linked with Admin!');
    }

    if (email.replace(/\s+/g, '').length <= 0) {
      throw new Error('Email is required!');
    }

    if (organizationId.replace(/\s+/g, '').length <= 0) {
      throw new Error('Organization is required!');
    }

    const emailPresent = await this.prisma.user.findFirst({
      where: {
        email: inviteUsersInput.email,
      },
    });

    if (emailPresent?.isEmailConfirmed === true) {
      throw new Error('Email is present and confirmed already!');
    }

    const organizationPresent = await this.prisma.organization.findFirst({
      where: {
        id: organizationId,
      },
    });

    if (!organizationPresent) {
      throw new Error('No organization is present with this ID!');
    }

    const pharmacyPresent = await this.prisma.pharmacy.findFirst({
      where: {
        id: pharmacyId,
      },
    });

    if (!pharmacyPresent) {
      throw new Error('No pharmacy is present with this ID!');
    }

    if (userRole === 'ADMIN') {
      const userOrga = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
        select: { organizationId: true },
      });

      organizationId = userOrga.organizationId;
    }

    const assignedRole = await this.prisma.role.findFirst({
      where: {
        userType: role,
      },
      select: {
        id: true,
      },
    });

    if (!assignedRole)
      throw new UnprocessableEntityException(
        "Can't find the role related information",
      );

    const confirmationToken = await generateToken();
    const passwordText = await generateInvitePassword();

    const password = await bcrypt.hash(passwordText, 10);

    if (!emailPresent) {
      let data: any = {
        email,
        emailConfirmationToken: confirmationToken,
        password,
        role: {
          connect: { id: assignedRole.id },
        },
        organization: {
          connect: { id: organizationId },
        },
      };

      if (pharmacyId) {
        data = {
          ...data,
          pharmacy: {
            connect: { id: pharmacyId },
          },
        };
      }

      const createUser = await this.prisma.user.create({
        data,
      });

      if (!createUser) {
        throw new Error(
          'Could not create the user. Please try after sometime!',
        );
      }
    } else {
      const updateUser = await this.prisma.user.update({
        data: { emailConfirmationToken: confirmationToken, password },
        where: {
          id: emailPresent.id,
        },
      });

      if (!updateUser) {
        throw new Error(
          'Could not update the user. Please try after sometime!',
        );
      }
    }

    const subject = `${role == 'ADMIN' ? 'Admin' : 'Staff'} Invitation Email!`;
    const body = `<p>${passwordText} is your automated password. </p>
    <p>Please confrim your email and set your new password.</p> 
        <p>By clicking on this link ${process.env.BASE_URL}/set-password?confirmation_token=${confirmationToken}</p> 
        <p>Thanks</p>
        `;

    const emailSent = await this.emailService.run(email, subject, body);

    if (!emailSent) {
      throw new Error(
        'No invitation email is been sent. Please try again after some time!',
      );
    }

    return 'Invite sent successfully!';
  }
}
