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
      // This section checks whether the relational ID is present or not! Starts
      const itemCheck = await this.prisma.item.findFirst({
        where: {
          id: createWarehouseStockInput?.itemId,
        },
      });

      if (!itemCheck) throw new Error('No Item present with this ID!');

      const warehouse = await this.prisma.warehouse.findFirst({
        where: {
          id: createWarehouseStockInput?.warehouseId,
        },
      });

      if (!warehouse) throw new Error('No Warehouse present with this ID!');

      // This section checks whether the relational ID is present or not! Ends

      // Setting up the data to be used!Starts
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
      // Setting up the data to be used!ENDS

      // CHECKING IF THE WAREHOUSE STOCK ALREADY PRESENT OR NOT, FOR THE ID. STARTS
      const existingStock = await this.prisma.warehouseStock.findFirst({
        where: {
          itemId: createWarehouseStockInput?.itemId,
        },
      });
      // CHECKING IF THE WAREHOUSE STOCK ALREADY PRESENT OR NOT, FOR THE ID. ENDS

      // CREATING OR UPDATING THE WAREHOUSE STOCK. STARTS
      let warehouseStock;
      if (!existingStock) {
        // CREATING THE STOCK IF ALREADY NOT PRESENT!STARTS
        warehouseStock = await this.prisma.warehouseStock.create({
          data,
        });

        if (!warehouseStock) {
          throw new Error(
            'Could not create the Warehouse Stock. Please try after sometime!',
          );
        }
        // CREATING THE STOCK IF ALREADY NOT PRESENT!ENDS
      } else {
        // UPDATING THE STOCK!STARTS
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
        // UPDATING THE STOCK!ENDS
      }
      // CREATING OR UPDATING THE WAREHOUSE STOCK. ENDS

      // Creation of Stock Movement data.STARTS
      const createStockMovement: CreateStockMovementInput = {
        itemId: createWarehouseStockInput?.itemId,
        qty: createWarehouseStockInput.qty,
        batchName: createWarehouseStockInput.batchName,
        expiry: createWarehouseStockInput.expiry,
        warehouseStockId: warehouseStock.id || existingStock.id,
      };
      // Creation of Stock Movement data.ENDS

      // CALLING THE STOCKMOVEMENT CREATE METHOD, PASSING "createStockMovement" AS THE ARGUMENT TO IT! STARTS
      await this.stockMovementService.create(createStockMovement);
      // CALLING THE STOCKMOVEMENT CREATE METHOD, PASSING "createStockMovement" AS THE ARGUMENT TO IT! ENDS

      return warehouseStock;
    } catch (error) {
      throw error;
    }
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
