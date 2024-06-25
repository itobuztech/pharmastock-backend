import { Injectable, Logger } from '@nestjs/common';
import { CreatePharmacyStockInput } from './dto/create-pharmacyStock.input';
import { PrismaService } from '../prisma/prisma.service';
import { PharmacyStock } from '@prisma/client';
import { PaginationArgs } from 'src/pagination/pagination.dto';

@Injectable()
export class PharmacyStockService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {}

  async findAll(paginationArgs?: PaginationArgs): Promise<PharmacyStock[]> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    try {
      const pharmacyStock = await this.prisma.pharmacyStock.findMany({
        skip,
        take,
      });

      return pharmacyStock;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<PharmacyStock> {
    const pharmacyStock = await this.prisma.pharmacyStock.findFirst({
      where: {
        id,
      },
    });

    if (!pharmacyStock) {
      throw new Error('No PharmacyStock found!');
    }

    return pharmacyStock;
  }

  async create(createPharmacyStockInput: CreatePharmacyStockInput) {
    try {
      const data = {
        qty: createPharmacyStockInput.qty || null,
        final_qty: createPharmacyStockInput.final_qty || null,
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

      const pharmacyStock = await this.prisma.pharmacyStock.create({
        data,
      });

      if (!pharmacyStock) {
        throw new Error(
          'Could not create the Pharmacy Stock. Please try after sometime!',
        );
      }

      return pharmacyStock;
    } catch (error) {
      throw error;
    }
  }

  async updatePharmacyStock(id: string, data) {
    const pharmacyStock = await this.prisma.pharmacyStock.update({
      where: {
        id,
      },
      data,
    });

    if (!pharmacyStock) {
      throw new Error(
        'Could not update the Pharmacy Stock. Please try after sometime!',
      );
    }

    return pharmacyStock;
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
