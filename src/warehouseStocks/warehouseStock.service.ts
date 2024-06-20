import { Injectable, Logger } from '@nestjs/common';
import { CreateWarehouseStockInput } from './dto/create-warehouseStock.input';
import { PrismaService } from '../prisma/prisma.service';
import { WarehouseStock } from '@prisma/client';
import { PaginationArgs } from 'src/pagination/pagination.dto';

@Injectable()
export class WarehouseStockService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {}

  async findAll(paginationArgs?: PaginationArgs): Promise<WarehouseStock[]> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    try {
      const warehouseStock = await this.prisma.warehouseStock.findMany({
        skip,
        take,
      });

      return warehouseStock;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<WarehouseStock> {
    const warehouseStock = await this.prisma.warehouseStock.findFirst({
      where: {
        id,
      },
    });

    if (!warehouseStock) {
      throw new Error('No WarehouseStock found!');
    }

    return warehouseStock;
  }

  async create(createWarehouseStockInput: CreateWarehouseStockInput) {
    try {
      let data: any = {
        stocklevel_min: createWarehouseStockInput.stocklevel_min,
        stocklevel_max: createWarehouseStockInput.stocklevel_max,
        stock_status: createWarehouseStockInput.stock_status,
        stockLevel: createWarehouseStockInput.stockLevel,
      };

      if (createWarehouseStockInput?.itemId) {
        data = {
          ...data,
          item: {
            connect: { id: createWarehouseStockInput?.itemId },
          },
        };
      }
      if (createWarehouseStockInput?.warehouseId) {
        data = {
          ...data,
          warehouse: {
            connect: { id: createWarehouseStockInput?.warehouseId },
          },
        };
      }

      const warehouseStock = await this.prisma.warehouseStock.create({
        data,
      });

      if (!warehouseStock) {
        throw new Error(
          'Could not create the WarehouseStock. Please try after sometime!',
        );
      }

      return warehouseStock;
    } catch (error) {
      throw error;
    }
  }

  async updateWarehouseStock(id: string, data) {
    const warehouseStock = await this.prisma.warehouseStock.update({
      where: {
        id,
      },
      data,
    });

    if (!warehouseStock) {
      throw new Error(
        'Could not update the WarehouseStock. Please try after sometime!',
      );
    }

    return warehouseStock;
  }

  async deleteWarehouseStock(id: string) {
    const deleted = await this.prisma.warehouseStock.delete({
      where: {
        id,
      },
    });

    if (!deleted) {
      throw new Error(
        'Could not delete the WarehouseStock. Please try after sometime!',
      );
    }
    return deleted;
  }
}
