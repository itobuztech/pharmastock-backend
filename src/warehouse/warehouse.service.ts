import { Injectable, Logger } from '@nestjs/common';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { PrismaService } from '../prisma/prisma.service';
import { Warehouse } from '@prisma/client';

@Injectable()
export class WarehouseService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {}

  async findAll(): Promise<Warehouse[]> {
    try {
      const warehouse = await this.prisma.warehouse.findMany({});

      return warehouse;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Warehouse> {
    const warehouse = await this.prisma.warehouse.findFirst({
      where: {
        id,
      },
    });

    if (!warehouse) {
      throw new Error('No Warehouse found!');
    }

    return warehouse;
  }

  async create(createWarehouseInput: CreateWarehouseInput) {
    try {
      const location = JSON.stringify(createWarehouseInput.location);

      let data: any = {
        location,
        area: createWarehouseInput.area,
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
    const warehouse = await this.prisma.warehouse.update({
      where: {
        id,
      },
      data,
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
