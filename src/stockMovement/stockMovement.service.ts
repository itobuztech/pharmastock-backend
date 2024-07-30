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
    try {
      let data: any = {
        qty: createStockMovementInput.qty,
        batch_name: createStockMovementInput.batchName || null,
        expiry: createStockMovementInput.expiry || null,
        item: {
          connect: {
            id: createStockMovementInput?.itemId,
          },
        },
      };

      if (createStockMovementInput?.warehouseStockId) {
        data = {
          ...data,
          warehouseStock: {
            connect: {
              id: createStockMovementInput?.warehouseStockId,
            },
          },
        };
      }

      if (createStockMovementInput?.pharmacyStockId) {
        data = {
          ...data,
          pharmacyStock: {
            connect: {
              id: createStockMovementInput?.pharmacyStockId,
            },
          },
        };
      }

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

  async deleteStockMovement(id: string) {
    try {
      const deleted = await this.prisma.stockMovement.update({
        where: {
          id,
        },
        data: { status: false },
      });

      if (!deleted) {
        throw new Error(
          'Could not delete the Stock Movement. Please try after sometime!',
        );
      }

      return deleted;
    } catch (error) {
      throw new Error(error);
    }
  }
}
