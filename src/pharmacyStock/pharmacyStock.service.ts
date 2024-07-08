import { Injectable, Logger } from '@nestjs/common';
import { CreatePharmacyStockInput } from './dto/create-pharmacyStock.input';
import { PrismaService } from '../prisma/prisma.service';
import { PharmacyStock } from '@prisma/client';
import { PaginationArgs } from '../pagination/pagination.dto';

import { StockMovementService } from '../stockMovement/stockMovement.service';
import { CreateStockMovementInput } from 'src/stockMovement/dto/create-stockMovement.input';

@Injectable()
export class PharmacyStockService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger,
    private readonly stockMovementService: StockMovementService,
  ) {}

  async findAll(
    paginationArgs?: PaginationArgs,
  ): Promise<{ pharmacyStocks: PharmacyStock[]; total: number }> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    try {
      const totalCount = await this.prisma.pharmacyStock.count();
      const pharmacyStocks = await this.prisma.pharmacyStock.findMany({
        skip,
        take,
        include: {
          warehouse: true,
          pharmacy: true,
        },
      });

      return { pharmacyStocks, total: totalCount };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<PharmacyStock> {
    const pharmacyStock = await this.prisma.pharmacyStock.findFirst({
      where: {
        id,
      },
      include: {
        warehouse: true,
        pharmacy: true,
      },
    });

    if (!pharmacyStock) {
      throw new Error('No Pharmacy Stock found!');
    }

    return pharmacyStock;
  }

  async create(createPharmacyStockInput: CreatePharmacyStockInput) {
    try {
      // This section checks whether the relational ID is present or not! Starts
      if (createPharmacyStockInput?.itemId) {
        const itemCheck = await this.prisma.item.findFirst({
          where: {
            id: createPharmacyStockInput?.itemId,
          },
        });

        if (!itemCheck) throw new Error('No Item present with this ID!');
      }
      if (createPharmacyStockInput?.warehouseId) {
        const warehouse = await this.prisma.warehouse.findFirst({
          where: {
            id: createPharmacyStockInput?.warehouseId,
          },
        });

        if (!warehouse) throw new Error('No Warehouse present with this ID!');
      }
      if (createPharmacyStockInput?.pharmacyId) {
        const pharmacyCheck = await this.prisma.pharmacy.findFirst({
          where: {
            id: createPharmacyStockInput?.pharmacyId,
          },
        });

        if (!pharmacyCheck)
          throw new Error('No Pharmacy present with this ID!');
      }
      // This section checks whether the relational ID is present or not! Ends

      // Setting up the data to be used!Starts
      const data = {
        final_qty: createPharmacyStockInput.qty,
        item: {
          connect: { id: createPharmacyStockInput?.itemId },
        },
        warehouse: {
          connect: { id: createPharmacyStockInput?.warehouseId },
        },
        pharmacy: {
          connect: { id: createPharmacyStockInput?.pharmacyId },
        },
      };
      // Setting up the data to be used!Ends

      // Updates the warehouse stock. As stock is transfered for the warehouse to the pharmacy. STARTS
      const existingStock = await this.prisma.warehouseStock.findFirst({
        where: {
          itemId: createPharmacyStockInput?.itemId,
        },
      });

      const warehouseStock = await this.prisma.warehouseStock.update({
        where: {
          id: existingStock?.id,
        },
        data: {
          final_qty: existingStock.final_qty - createPharmacyStockInput.qty,
        },
      });

      if (!warehouseStock) {
        throw new Error(
          'Could not update the Warehouse Stock. Please try after sometime!',
        );
      }
      // Updates the warehouse stock. As stock is transfered for the warehouse to the pharmacy. ENDS

      // CHECKING IF THE PHARMACY STOCK ALREADY PRESENT OR NOT, FOR THE ID. STARTS
      const existingPharmacyStock = await this.prisma.pharmacyStock.findFirst({
        where: {
          itemId: createPharmacyStockInput?.itemId,
        },
      });
      // CHECKING IF THE PHARMACY STOCK ALREADY PRESENT OR NOT, FOR THE ID. ENDS

      // CREATING OR UPDATING THE PHARMACY STOCK. STARTS
      let pharmacyStock;
      if (!existingPharmacyStock) {
        // CREATING THE STOCK IF ALREADY NOT PRESENT!STARTS
        pharmacyStock = await this.prisma.pharmacyStock.create({
          data,
          include: {
            warehouse: true,
            pharmacy: true,
          },
        });

        if (!pharmacyStock) {
          throw new Error(
            'Could not create the Warehouse Stock. Please try after sometime!',
          );
        }
        // CREATING THE STOCK IF ALREADY NOT PRESENT!ENDS
      } else {
        // UPDATING THE STOCK!STARTS
        pharmacyStock = await this.prisma.pharmacyStock.update({
          where: {
            id: existingPharmacyStock?.id,
          },
          data: {
            final_qty:
              existingPharmacyStock.final_qty + createPharmacyStockInput.qty,
          },
          include: {
            warehouse: true,
            pharmacy: true,
          },
        });

        if (!pharmacyStock) {
          throw new Error(
            'Could not update the Warehouse Stock. Please try after sometime!',
          );
        }
        // UPDATING THE STOCK!ENDS
      }
      // CREATING OR UPDATING THE PHARMACY STOCK. ENDS

      // Creation of Stock Movement data.STARTS
      const createStockMovement: CreateStockMovementInput = {
        itemId: createPharmacyStockInput?.itemId,
        qty: createPharmacyStockInput.qty,
        batchName: null,
        expiry: null,
        pharmacyStockId: pharmacyStock.id || existingPharmacyStock.id,
      };
      // Creation of Stock Movement data.ENDS

      // CALLING THE STOCKMOVEMENT CREATE METHOD, PASSING "createStockMovement" AS THE ARGUMENT TO IT! STARTS
      await this.stockMovementService.create(createStockMovement);
      // CALLING THE STOCKMOVEMENT CREATE METHOD, PASSING "createStockMovement" AS THE ARGUMENT TO IT! ENDS

      return pharmacyStock;
    } catch (error) {
      throw error;
    }
  }

  async deletePharmacyStock(id: string) {
    const deleted = await this.prisma.pharmacyStock.delete({
      where: {
        id,
      },
    });

    if (!deleted) {
      throw new Error(
        'Could not delete the Pharmacy Stock. Please try after sometime!',
      );
    }
    return deleted;
  }
}
