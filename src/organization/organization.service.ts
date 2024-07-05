import { Injectable, Logger } from '@nestjs/common';
import { CreateOrganizationInput } from './dto/create-organization.input';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Organization, Role, UserRole } from '@prisma/client';
import { PaginationArgs } from '../pagination/pagination.dto';
import { TotalCount } from '../pagination/toalCount.entity';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) { }

  async findAll(
    paginationArgs?: PaginationArgs,
  ): Promise<{ organizations: Organization[]; total: number }> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    const totalCount = await this.prisma.organization.count();
    const organizations = await this.prisma.organization.findMany({
      skip,
      take,
    });

    return { organizations, total: totalCount };
  }

  async findOne(id: string): Promise<Organization> {
    const organization = await this.prisma.organization.findFirst({
      where: {
        id,
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
        name: createOrganizationInput.name,
      },
    });

    if (unique) {
      throw new Error('Organization name alerady present!');
    }

    const organization = await this.prisma.organization.create({
      data: {
        name: createOrganizationInput.name,
        description: createOrganizationInput.description,
        active: createOrganizationInput.active,
        address: createOrganizationInput.address,
        city: createOrganizationInput.city,
        country: createOrganizationInput.country,
        contact: createOrganizationInput.contact
      },
    });

    if (!organization) {
      throw new Error(
        'Could not create the Organization. Please try after sometime!',
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
    const unique = await this.prisma.organization.findFirst({
      where: {
        name: data.name,
      },
    });

    if (unique) {
      throw new Error('Organization name alerady present!');
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
    const deleted = await this.prisma.organization.delete({
      where: {
        id,
      },
    });

    if (!deleted) {
      throw new Error(
        'Could not delete the Organization. Please try after sometime!',
      );
    }
    return deleted;
  }
}
