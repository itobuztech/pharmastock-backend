import { Injectable, Logger } from '@nestjs/common';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Warehouse } from '@prisma/client';
import { PaginationArgs } from '../pagination/pagination.dto';
import { WarehouseSearchObject } from '../types/extended-types';
import { AccountService } from '../account/account.service';

@Injectable()
export class WarehouseService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger,
    private readonly accountService: AccountService,
  ) {}

  async findAll(
    ctx,
    searchText?: string,
    pagination?: Boolean,
    paginationArgs?: PaginationArgs,
  ): Promise<{ warehouses: Warehouse[]; total: number }> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    try {
      const loggedinUser = await this.accountService.findOne(ctx);
      const loggedinUserRole = loggedinUser?.role;
      const organizationId = loggedinUser?.user?.organizationId;

      let whereClause: Prisma.WarehouseWhereInput = {
        status: true,
      };

      if (loggedinUserRole !== 'SUPERADMIN') {
        whereClause['organizationId'] = organizationId;
      }

      if (searchText) {
        whereClause = {
          ...whereClause,
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

      const warehouseCount = await this.prisma.warehouse.count({
        where: whereClause,
      });

      let searchObject: WarehouseSearchObject = {
        where: whereClause,
        include: {
          organization: {
            where: {
              status: true,
            },
          },
          admin: true,
        },
      };
      if (pagination) {
        searchObject = {
          skip,
          take,
          where: whereClause,
          include: {
            organization: {
              where: {
                status: true,
              },
            },
            admin: true,
          },
        };
      }

      const warehouses = await this.prisma.warehouse.findMany({
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

      return { warehouses, total: warehouseCount };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Warehouse> {
    const warehouse = await this.prisma.warehouse.findFirst({
      where: {
        id,
      },
      include: {
        organization: {
          where: {
            status: true,
          },
        },
        admin: true,
      },
    });

    if (!warehouse) {
      throw new Error('No Warehouse found!');
    }

    return warehouse;
  }

  async create(ctx, createWarehouseInput: CreateWarehouseInput) {
    try {
      if (
        !createWarehouseInput.name ||
        createWarehouseInput.name.trim() === ''
      ) {
        throw new Error('Name cannot be blank or only contain spaces.');
      }

      const notUnique = await this.prisma.warehouse.findFirst({
        where: {
          status: true,
          name: createWarehouseInput.name,
        },
      });

      if (notUnique) {
        throw new Error('Warehouse name alerady present!');
      }

      let organizationId = '';
      try {
        const loggedinUser = await this.accountService.findOne(ctx);
        const loggedinUserRole = loggedinUser?.role;
        organizationId = loggedinUser?.user?.organizationId;

        if (!organizationId) {
          throw new Error('No organization is registered with this user!');
        }
      } catch (error) {
        throw error;
      }

      let data: any = {
        location: createWarehouseInput.location,
        area: createWarehouseInput.area,
        name: createWarehouseInput.name,
        organization: {
          connect: { id: organizationId },
        },
      };

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
        include: {
          organization: true,
          admin: true,
        },
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
      const notUnique = await this.prisma.warehouse.findFirst({
        where: {
          status: true,
          name: data.name,
          NOT: {
            id,
          },
        },
      });

      if (notUnique) {
        throw new Error('Warehouse name alerady present!');
      }
    }
    const warehouse = await this.prisma.warehouse.update({
      where: {
        id,
      },
      data,
      include: {
        organization: true,
        admin: true,
      },
    });

    if (!warehouse) {
      throw new Error(
        'Could not update the Warehouse. Please try after sometime!',
      );
    }

    return warehouse;
  }

  async deleteWarehouse(id: string) {
    try {
      const deleted = await this.prisma.warehouse.update({
        where: {
          id,
        },
        data: { status: false },
      });

      if (!deleted) {
        throw new Error(
          'Could not delete the Warehouse. Please try after sometime!',
        );
      }

      if (deleted) {
        try {
          await this.prisma.warehouseStock.updateMany({
            where: {
              warehouseId: id,
            },
            data: { status: false },
          });
          await this.prisma.pharmacyStock.updateMany({
            where: {
              StockMovement: {
                some: {
                  warehouseStock: {
                    warehouseId: id,
                  },
                },
              },
            },
            data: { status: false },
          });
          await this.prisma.sKU.updateMany({
            where: {
              warehouseId: id,
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
