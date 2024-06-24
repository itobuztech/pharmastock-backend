import { Injectable, Logger } from '@nestjs/common';
import { CreateWarehouseStockInput } from './dto/create-warehouseStock.input';
import { PrismaService } from '../prisma/prisma.service';
import { WarehouseStock } from '@prisma/client';
import { PaginationArgs } from 'src/pagination/pagination.dto';

import { StockMovementService } from '../stockMovement/stockMovement.service';
import { CreateStockMovementInput } from 'src/stockMovement/dto/create-stockMovement.input';

@Injectable()
export class WarehouseStockService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger,
    private readonly stockMovementService: StockMovementService,
  ) {}

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
      const data = {
        item: {
          connect: { id: createWarehouseStockInput?.itemId },
        },
        warehouse: {
          connect: { id: createWarehouseStockInput?.warehouseId },
        },
        stocklevel_min: createWarehouseStockInput.stocklevelMin,
        stocklevel_max: createWarehouseStockInput.stocklevelMax,
        stock_status: createWarehouseStockInput.stockStatus,
        stockLevel: createWarehouseStockInput.stockLevel,
        final_qty: createWarehouseStockInput.qty,
      };

      const existingStock = await this.prisma.warehouseStock.findFirst({
        where: {
          itemId: createWarehouseStockInput?.itemId,
        },
      });

      let warehouseStock;
      if (!existingStock) {
        // This section is when a new item is added to the stock.
        warehouseStock = await this.prisma.warehouseStock.create({
          data,
        });

        if (!warehouseStock) {
          throw new Error(
            'Could not create the Warehouse Stock. Please try after sometime!',
          );
        }
      } else {
        // This section is when the item exists.
        warehouseStock = await this.prisma.warehouseStock.update({
          where: {
            id: existingStock?.id,
          },
          data: {
            final_qty: existingStock.final_qty + createWarehouseStockInput.qty,
          },
        });

        if (!warehouseStock) {
          throw new Error(
            'Could not update the Warehouse Stock. Please try after sometime!',
          );
        }
      }

      // Creation of Stock Movement.
      const createStockMovement: CreateStockMovementInput = {
        itemId: createWarehouseStockInput?.itemId,
        qty: createWarehouseStockInput.qty,
        batchName: createWarehouseStockInput.batchName,
        expiry: createWarehouseStockInput.expiry,
        warehouseStockId: warehouseStock.id || existingStock.warehouseId,
      };

      await this.stockMovementService.create(createStockMovement);

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
