import { Injectable, Logger } from '@nestjs/common';
import { CreateStockMovementInput } from './dto/create-stockMovement.input';
import { PrismaService } from '../prisma/prisma.service';
import { StockMovement } from '@prisma/client';
import { PaginationArgs } from 'src/pagination/pagination.dto';

@Injectable()
export class StockMovementService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {}

  async findAll(paginationArgs?: PaginationArgs): Promise<StockMovement[]> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    try {
      const stockMovement = await this.prisma.stockMovement.findMany({
        skip,
        take,
      });

      return stockMovement;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<StockMovement> {
    const stockMovement = await this.prisma.stockMovement.findFirst({
      where: {
        id,
      },
    });

    if (!stockMovement) {
      throw new Error('No StockMovement found!');
    }

    return stockMovement;
  }

  async create(createStockMovementInput: CreateStockMovementInput) {
    console.log('createStockMovementInput=', createStockMovementInput);

    try {
      let data = {
        qty: createStockMovementInput.qty,
        final_qty: createStockMovementInput.finalQty,
        batch_name: createStockMovementInput.batchName,
        expiry: createStockMovementInput.expiry,
        warehouseStock: {
          connect: {
            id: createStockMovementInput?.warehouseStockId,
          },
        },
        item: {
          connect: {
            id: createStockMovementInput?.itemId,
          },
        },
        pharmacyStock: {
          connect: {
            id: createStockMovementInput?.pharmacyStockId,
          },
        },
      };

      const stockMovement = await this.prisma.stockMovement.create({
        data,
      });

      if (!stockMovement) {
        throw new Error(
          'Could not create the Stock Movement. Please try after sometime!',
        );
      }

      return stockMovement;
    } catch (error) {
      throw error;
    }
  }

  async updateStockMovement(id: string, data) {
    const stockMovement = await this.prisma.stockMovement.update({
      where: {
        id,
      },
      data,
    });

    if (!stockMovement) {
      throw new Error(
        'Could not update the Stock Movement. Please try after sometime!',
      );
    }

    return stockMovement;
  }

  async deleteStockMovement(id: string) {
    const deleted = await this.prisma.stockMovement.delete({
      where: {
        id,
      },
    });

    if (!deleted) {
      throw new Error(
        'Could not delete the Stock Movement. Please try after sometime!',
      );
    }
    return deleted;
  }
}
