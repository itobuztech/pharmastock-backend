import { Injectable, Logger } from '@nestjs/common';
import { CreateOrganizationInput } from './dto/create-organization.input';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Organization, Role, UserRole } from '@prisma/client';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {}

  async findAll(): Promise<Organization[]> {
    const organizations = await this.prisma.organization.findMany({});

    return organizations;
  }

  async findOne(name: string): Promise<Organization> {
    const organization = await this.prisma.organization.findFirst({
      where: {
        name,
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
