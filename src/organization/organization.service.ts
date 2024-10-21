import * as bcrypt from 'bcrypt';
import { Injectable, Logger } from '@nestjs/common';
import { CreateOrganizationInput } from './dto/create-organization.input';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Organization, UserRole } from '@prisma/client';
import { PaginationArgs } from '../pagination/pagination.dto';
import { OrganizationSearchObject } from '../types/extended-types';
import { generateInvitePassword, generateToken } from '../util/helper';
import { EmailService } from '../email/email.service';

@Injectable()
export class OrganizationService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger,
    private readonly emailService: EmailService,
  ) {}

  async findAll(
    searchText?: string,
    pagination?: Boolean,
    paginationArgs?: PaginationArgs,
  ): Promise<{ organizations: Organization[]; total: number }> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    try {
      let whereClause: Prisma.OrganizationWhereInput = { status: true };

      if (searchText) {
        whereClause = {
          ...whereClause,
          OR: [
            { name: { contains: searchText, mode: 'insensitive' } },
            { description: { contains: searchText, mode: 'insensitive' } },
            { address: { contains: searchText, mode: 'insensitive' } },
            { city: { contains: searchText, mode: 'insensitive' } },
          ],
        };
      }

      let searchObject: OrganizationSearchObject = {
        where: whereClause,
      };

      const organizationsCount = await this.prisma.organization.count({
        ...searchObject,
      });

      if (pagination) {
        searchObject = {
          skip,
          take,
          where: whereClause,
        };
      }

      const organizations = await this.prisma.organization.findMany({
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

      return { organizations, total: organizationsCount };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Organization> {
    const organization = await this.prisma.organization.findFirst({
      where: {
        id,
      },
      include: {
        User: true,
      },
    });

    if (!organization) {
      throw new Error('No Organization found with this name!');
    }

    return organization;
  }

  async create(createOrganizationInput: CreateOrganizationInput) {
    const unique = await this.prisma.organization.findFirst({
      where: {
        status: true,
        name: createOrganizationInput.name,
      },
    });

    if (unique) {
      throw new Error('Organization name alerady present!');
    }

    const { adminEmail } = createOrganizationInput;

    const adminPresent = await this.prisma.user.findUnique({
      where: {
        status: true,
        email: adminEmail,
      },
    });

    if (adminPresent) {
      throw new Error('This email already taken by an Admin!');
    }

    const organization = await this.prisma.organization.create({
      data: {
        name: createOrganizationInput.name,
        description: createOrganizationInput.description,
        active: createOrganizationInput.active,
        address: createOrganizationInput.address,
        city: createOrganizationInput.city,
        country: createOrganizationInput.country,
        contact: createOrganizationInput.contact,
      },
    });

    if (!organization) {
      throw new Error(
        'Could not create the Organization. Please try after sometime!',
      );
    }

    const adminRole = await this.prisma.role.findFirst({
      where: {
        userType: UserRole.ADMIN,
      },
    });

    if (!adminRole) {
      throw new Error('No admin role found!');
    }

    const confirmationToken = await generateToken();
    const passwordText = await generateInvitePassword();

    const password = await bcrypt.hash(passwordText, 10);

    const data: any = {
      email: adminEmail,
      emailConfirmationToken: confirmationToken,
      password,
      role: {
        connect: { id: adminRole.id },
      },
      organization: {
        connect: { id: organization.id },
      },
    };
    const createAdmin = await this.prisma.user.create({
      data,
    });

    if (!createAdmin) {
      throw new Error('Could not create the Admin. Please try after sometime!');
    }

    const subject = 'Admin Invitation Email!';
    const body = `<p>${passwordText} is your automated password. </p>
    <p>Please confrim your email and set your new password.</p> 
        <p>By clicking on this link ${process.env.BASE_URL}/set-password?confirmation_token=${confirmationToken}</p> 
        <p>Thanks</p>
        `;

    const emailSent = await this.emailService.run(adminEmail, subject, body);

    if (!emailSent) {
      throw new Error(
        'No invitation email is been sent. Please try again after some time!',
      );
    }

    return organization;
  }

  async findOneById(id: string): Promise<Organization> {
    const organization = await this.prisma.organization.findFirst({
      where: {
        id,
      },
    });

    if (!organization) {
      throw new Error('No Organization found!');
    }

    return organization;
  }

  async updateOrganization(id: string, data) {
    if (data.name) {
      const unique = await this.prisma.organization.findFirst({
        where: {
          status: true,
          name: data.name,
          NOT: {
            id,
          },
        },
      });

      if (unique) {
        throw new Error('Organization name alerady present!');
      }
    }

    const organization = await this.prisma.organization.update({
      where: {
        id,
      },
      data,
    });

    if (!organization) {
      throw new Error(
        'Could not update the Organization. Please try after sometime!',
      );
    }

    return organization;
  }

  async deleteOrganization(id: string) {
    try {
      const deleted = await this.prisma.organization.update({
        where: {
          id,
        },
        data: { status: false },
      });

      if (!deleted) {
        throw new Error(
          'Could not delete the Organization. Please try after sometime!',
        );
      }

      if (deleted) {
        try {
          await this.prisma.warehouse.updateMany({
            where: {
              organizationId: id,
            },
            data: { status: false },
          });
          await this.prisma.pharmacy.updateMany({
            where: {
              organizationId: id,
            },
            data: { status: false },
          });
          await this.prisma.sKU.updateMany({
            where: {
              organizationId: id,
            },
            data: { status: false },
          });
        } catch (error) {
          throw new Error(error);
        }
      }

      return deleted;
    } catch (error) {
      throw new Error(error);
    }
  }
}
