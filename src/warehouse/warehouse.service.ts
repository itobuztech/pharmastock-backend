import { Injectable, Logger } from '@nestjs/common';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Warehouse } from '@prisma/client';
import { PaginationArgs } from '../pagination/pagination.dto';
import { WarehouseSearchObject } from '../types/extended-types';

@Injectable()
export class WarehouseService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {}

  async findAll(
    searchText?: string,
    pagination?: Boolean,
    paginationArgs?: PaginationArgs,
  ): Promise<{ warehouses: Warehouse[]; total: number }> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    try {
      let whereClause: Prisma.WarehouseWhereInput | {} = {};

      if (searchText) {
        whereClause = {
          OR: [
            { name: { contains: searchText, mode: 'insensitive' } },
            { location: { contains: searchText, mode: 'insensitive' } },
            { area: { contains: searchText, mode: 'insensitive' } },
            {
              organization: {
                name: { contains: searchText, mode: 'insensitive' },
              },
            },
          ],
        };
      }

      const totalCount = await this.prisma.warehouse.count({
        where: whereClause,
      });

      let searchObject: WarehouseSearchObject = {
        where: whereClause,
        include: {
          organization: true,
          admin: true,
        },
      };
      if (pagination) {
        searchObject = {
          skip,
          take,
          where: whereClause,
          include: {
            organization: true,
            admin: true,
          },
        };
      }

      const warehouses = await this.prisma.warehouse.findMany(searchObject);

      return { warehouses, total: totalCount };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Warehouse> {
    const warehouse = await this.prisma.warehouse.findFirst({
      where: {
        id,
      },
      include: { organization: true, admin: true },
    });

    if (!warehouse) {
      throw new Error('No Warehouse found!');
    }

    return warehouse;
  }

  async create(createWarehouseInput: CreateWarehouseInput) {
    try {
      if (createWarehouseInput.name) {
        const unique = await this.prisma.warehouse.findFirst({
          where: {
            name: createWarehouseInput.name,
          },
        });

        if (unique) {
          throw new Error('Warehouse name alerady present!');
        }
      }

      let data: any = {
        location: createWarehouseInput.location,
        area: createWarehouseInput.area,
        name: createWarehouseInput.name,
      };

      if (createWarehouseInput?.organizationId) {
        data = {
          ...data,
          organization: {
            connect: { id: createWarehouseInput?.organizationId },
          },
        };
      }
      if (createWarehouseInput?.adminId) {
        data = {
          ...data,
          admin: {
            connect: { id: createWarehouseInput?.adminId },
          },
        };
      }

      const warehouse = await this.prisma.warehouse.create({
        data,
        include: { organization: true, admin: true },
      });

      if (!warehouse) {
        throw new Error(
          'Could not create the Warehouse. Please try after sometime!',
        );
      }

      return warehouse;
    } catch (error) {
      throw error;
    }
  }

  async updateWarehouse(id: string, data) {
    if (data.name) {
      const unique = await this.prisma.warehouse.findFirst({
        where: {
          name: data.name,
          NOT: {
            id,
          },
        },
      });

      if (unique) {
        throw new Error('Warehouse name alerady present!');
      }
    }
    const warehouse = await this.prisma.warehouse.update({
      where: {
        id,
      },
      data,
      include: { organization: true, admin: true },
    });

    if (!warehouse) {
      throw new Error(
        'Could not update the Warehouse. Please try after sometime!',
      );
    }

    return warehouse;
  }

  async deleteWarehouse(id: string) {
    const deleted = await this.prisma.warehouse.delete({
      where: {
        id,
      },
    });

    if (!deleted) {
      throw new Error(
        'Could not delete the Warehouse. Please try after sometime!',
      );
    }
    return deleted;
  }
}
