import { Injectable, Logger } from '@nestjs/common';
import { CreateStockMovementInput } from './dto/create-stockMovement.input';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, StockMovement } from '@prisma/client';
import { PaginationArgs } from '../pagination/pagination.dto';
import { FilterStockMovementsInputs } from './dto/filter-stockMovements.input';

@Injectable()
export class StockMovementService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {}

  async findAll(
    user,
    searchText?: string,
    paginationArgs?: PaginationArgs,
    filterArgs?: FilterStockMovementsInputs,
  ): Promise<{ stockMovements: StockMovement[]; total: number }> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    try {
      let organization = null;
      try {
        organization = await this.prisma.organization.findFirst({
          where: {
            User: {
              some: {
                id: user.userId,
              },
            },
          },
        });
      } catch (error) {
        console.log(error);
        throw new Error('No organization found with this User Id!');
      }

      const organizationId = organization.id;

      let whereClause: Prisma.StockMovementWhereInput = {
        status: true,
        organizationId,
      };

      if (searchText) {
        whereClause.OR = [
          {
            batch_name: {
              contains: searchText,
              mode: 'insensitive',
            },
          },
          {
            item: {
              name: { contains: searchText, mode: 'insensitive' },
            },
          },
        ];
      }

      if (filterArgs) {
        const filterConditions: Prisma.StockMovementWhereInput[] = [];

        // Add date range filter if provided
        if (filterArgs.startDate && filterArgs.endDate) {
          filterConditions.push({
            OR: [
              {
                createdAt: {
                  gte: filterArgs.startDate,
                  lte: filterArgs.endDate,
                },
              },
              {
                updatedAt: {
                  gte: filterArgs.startDate,
                  lte: filterArgs.endDate,
                },
              },
            ],
          });
        }

        // Combine base conditions with search and filter conditions
        whereClause = {
          AND: [whereClause, ...filterConditions],
        };
      }

      let stockMovementCount = null;
      try {
        stockMovementCount = await this.prisma.stockMovement.count({
          where: whereClause,
        });
      } catch (error) {
        console.log(error);
        throw new Error('Stock movement count fetching error!!');
      }

      let stockMovements = null;
      try {
        stockMovements = await this.prisma.stockMovement.findMany({
          skip,
          take,
          where: whereClause,
          orderBy: {
            updatedAt: 'desc',
          },
          include: {
            item: {
              select: {
                name: true,
              },
            },
            warehouseStock: {
              include: {
                warehouse: {
                  select: { name: true },
                },
              },
            },
            pharmacyStock: {
              include: {
                pharmacy: {
                  select: { name: true },
                },
              },
            },
            pharmacyStockClearance: {
              include: {
                pharmacyStock: {
                  include: {
                    pharmacy: {
                      select: { name: true },
                    },
                  },
                },
              },
            },
          },
        });
      } catch (error) {
        console.log(error);
        throw new Error('Stock movement fetching error!!');
      }

      stockMovements.map((sM: any) => {
        sM.item = sM.item.name;
        if (sM.warehouseStock) {
          sM.warehouseName = sM.warehouseStock.warehouse.name;
        }
        if (sM.pharmacyStock || sM.pharmacyStockClearance) {
          sM.pharmacyName =
            sM?.pharmacyStock?.pharmacy?.name ||
            sM?.pharmacyStockClearance?.pharmacyStock?.pharmacy?.name;
        }
      });

      return { stockMovements, total: stockMovementCount };
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

      if (createStockMovementInput?.organizationId) {
        data = {
          ...data,
          organization: {
            connect: {
              id: createStockMovementInput?.organizationId,
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

      if (createStockMovementInput?.pharmacyStockClearanceId) {
        data = {
          ...data,
          pharmacyStockClearance: {
            connect: {
              id: createStockMovementInput?.pharmacyStockClearanceId,
            },
          },
        };
      }

      console.log('data=', data);

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
