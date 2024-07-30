import { Injectable, Logger } from '@nestjs/common';
import { CreateOrganizationInput } from './dto/create-organization.input';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Organization } from '@prisma/client';
import { PaginationArgs } from '../pagination/pagination.dto';
import { OrganizationSearchObject } from '../types/extended-types';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {}

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
          OR: [
            { name: { contains: searchText, mode: 'insensitive' } },
            { description: { contains: searchText, mode: 'insensitive' } },
            { address: { contains: searchText, mode: 'insensitive' } },
            { city: { contains: searchText, mode: 'insensitive' } },
          ],
        };
      }

      const totalCount = await this.prisma.organization.count({
        where: whereClause,
      });

      let searchObject: OrganizationSearchObject = {
        where: whereClause,
      };
      if (pagination) {
        searchObject = {
          skip,
          take,
          where: whereClause,
        };
      }

      const organizations = await this.prisma.organization.findMany(
        searchObject,
      );

      return { organizations, total: totalCount };
    } catch (error) {
      throw error;
    }
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
        status: true,
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
        contact: createOrganizationInput.contact,
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
