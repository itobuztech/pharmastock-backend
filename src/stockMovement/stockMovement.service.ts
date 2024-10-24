import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateStockMovementInput } from './dto/create-stockMovement.input';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, StockMovement, TransactionType } from '@prisma/client';
import { PaginationArgs } from '../pagination/pagination.dto';
import { FilterStockMovementsInputs } from './dto/filter-stockMovements.input';
import { StockMovementsByBatch } from './entities/stockMovementByBatch.entity';
import { BatchStockMovementsInput } from './dto/batch-stockMovements.input';
import { StockMovementsByLot } from './entities/stockMovementByLot.entity';
import { StockMovementsType } from 'src/types/enums/stockMovementsType.enum';

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
      if (user.role.userType !== 'SUPERADMIN') {
        try {
          organization = await this.prisma.user.findFirst({
            select: { organizationId: true },
            where: {
              id: user.userId,
            },
          });
        } catch (error) {
          console.log(error);
          throw new Error('No organization found with this User Id!');
        }
      }
      const organizationId = organization?.organizationId || null;

      let whereClause: Prisma.StockMovementWhereInput = {
        status: true,
        pharmacyId: null,
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
            warehouse: {
              name: { contains: searchText, mode: 'insensitive' },
            },
            organization: {
              name: { contains: searchText, mode: 'insensitive' },
            },
          },
        ];
      }

      if (organizationId) {
        whereClause = {
          ...whereClause,
          organizationId,
        };
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
            warehouse: {
              select: {
                name: true,
              },
            },
            organization: {
              select: {
                name: true,
              },
            },
          },
        });
      } catch (error) {
        console.log(error);
        throw new Error('Stock movement fetching error!!');
      }

      stockMovements.map((sM: any) => {
        sM.item = sM.item?.name || null;
        sM.warehouse = sM.warehouse?.name || null;
        sM.organisation = sM.organization?.name || null;
        sM.lotName = sM.lot_name || null;
      });

      return { stockMovements, total: stockMovementCount };
    } catch (error) {
      throw error;
    }
  }

  async findAllLot(
    user,
    searchText?: string,
    paginationArgs?: PaginationArgs,
    filterArgs?: FilterStockMovementsInputs,
  ): Promise<{ stockMovements: StockMovement[]; total: number }> {
    const { skip = 0, take = 10 } = paginationArgs || {};

    try {
      let organization = null;

      if (
        user.role.userType === 'STAFF' &&
        filterArgs &&
        filterArgs?.transactionType &&
        filterArgs?.transactionType !== 'EXIT'
      ) {
        throw new Error('Staffs can only watch Stock Exit Movements!');
      }

      if (user.role.userType !== 'SUPERADMIN') {
        try {
          organization = await this.prisma.user.findFirst({
            select: { organizationId: true },
            where: {
              id: user.userId,
            },
          });
        } catch (error) {
          console.log(error);
          throw new Error('No organization found with this User Id!');
        }
      }
      const organizationId = organization?.organizationId || null;

      let whereClause: Prisma.StockMovementWhereInput = {
        status: true,
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
            warehouse: {
              name: { contains: searchText, mode: 'insensitive' },
            },
            organization: {
              name: { contains: searchText, mode: 'insensitive' },
            },
          },
        ];
      }

      if (organizationId) {
        whereClause = {
          ...whereClause,
          organizationId,
        };
      }

      const filterConditions: Prisma.StockMovementWhereInput[] = [];
      if (filterArgs) {
        // Add transactionType filter if provided
        if (user.role.userType === 'STAFF') {
          filterArgs.transactionType = StockMovementsType.EXIT;
          filterConditions.push({
            transactionType: StockMovementsType.EXIT,
          });
        } else if (filterArgs.transactionType) {
          filterConditions.push({
            transactionType: filterArgs.transactionType,
          });
        }

        // Add warehouseId filter if provided
        if (filterArgs.warehouseId) {
          filterConditions.push({
            warehouseId: filterArgs.warehouseId,
          });
        }

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

        // Map remaining filter arguments
        Object.keys(filterArgs).forEach((key) => {
          if (
            key !== 'startDate' &&
            key !== 'endDate' &&
            key !== 'transactionType' &&
            key !== 'warehouseId'
          ) {
            const value = filterArgs[key];
            filterConditions.push({
              [key]: typeof value === 'number' ? { lte: value } : value,
            });
          }
        });
      } else if (user.role.userType === 'STAFF') {
        filterConditions.push({
          transactionType: StockMovementsType.EXIT,
        });
      }

      // Combine base conditions with search and filter conditions
      if (whereClause.OR) {
        whereClause = {
          AND: [whereClause, ...filterConditions],
        };
      } else {
        whereClause = {
          AND: [whereClause, ...filterConditions],
        };
      }
      let stockMovementCount = null;
      try {
        stockMovementCount = await this.prisma.stockMovement.findMany({
          where: whereClause,
          distinct: ['lot_name'],
        });
      } catch (error) {
        console.log(error);
        throw new Error('Stock movements count fetching error!!');
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
          distinct: ['lot_name'],
          include: {
            item: {
              select: {
                name: true,
              },
            },
            warehouse: {
              select: {
                name: true,
                id: true,
              },
            },
            organization: {
              select: {
                name: true,
              },
            },
          },
        });
      } catch (error) {
        console.log(error);
        throw new Error('Stock movement fetching error!!');
      }

      stockMovements.map((sM: any) => {
        sM.item = sM?.item?.name || null;
        sM.organisation = sM?.organization?.name || null;
        sM.lotName = sM?.lot_name || null;
        sM.warehouse = sM?.warehouse?.name || null;
      });

      return { stockMovements, total: stockMovementCount.length };
    } catch (error) {
      throw error;
    }
  }

  async findAllByBatch(
    batchStockMovementsInput,
    user,
    searchText?: string,
    paginationArgs?: PaginationArgs,
    filterArgs?: FilterStockMovementsInputs,
  ): Promise<{
    stockMovementsByBatch: StockMovementsByBatch[];
    total: number;
  }> {
    const { skip = 0, take = 10 } = paginationArgs || {};

    const { batchName } = batchStockMovementsInput;

    try {
      let organization = null;
      if (user.role.userType !== 'SUPERADMIN') {
        try {
          organization = await this.prisma.user.findFirst({
            select: { organizationId: true },
            where: {
              id: user.userId,
            },
          });
        } catch (error) {
          console.log(error);
          throw new Error('No organization found with this User Id!');
        }
      }
      const organizationId = organization?.organizationId || null;

      let whereClause: Prisma.StockMovementWhereInput = {
        status: true,
        batch_name: batchName,
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
            warehouse: {
              name: { contains: searchText, mode: 'insensitive' },
            },
            organization: {
              name: { contains: searchText, mode: 'insensitive' },
            },
          },
        ];
      }

      if (organizationId) {
        whereClause = {
          ...whereClause,
          organizationId,
        };
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

      let stockMovementsByBatch = null;
      try {
        stockMovementsByBatch = await this.prisma.stockMovement.findMany({
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
            warehouse: {
              select: {
                name: true,
              },
            },
            organization: {
              select: {
                name: true,
              },
            },
            pharmacy: {
              select: {
                name: true,
              },
            },
          },
        });
      } catch (error) {
        console.log(error);
        throw new Error('Stock movement fetching error!!');
      }

      stockMovementsByBatch.map((sM: any) => {
        sM.item = sM.item.name;
        sM.organisation = sM.organization.name;
        sM.lotName = sM.lot_name;

        if (sM.warehouseStockId) {
          sM.warehouse = sM.warehouse.name || null;
          sM.pharmacy = null;
          sM.pharmacyClearance = null;
        }

        if (sM.pharmacyStockId) {
          sM.warehouse = sM.warehouse.name || null;
          sM.pharmacy = sM.pharmacy.name || null;
          sM.pharmacyClearance = null;
        }

        if (sM.pharmacyStockClearanceId) {
          sM.pharmacyClearance = sM.pharmacy.name || null;
          sM.warehouse = null;
          sM.pharmacy = null;
        }
      });

      return { stockMovementsByBatch, total: stockMovementCount };
    } catch (error) {
      throw error;
    }
  }

  async findAllByLotName(
    lotStockMovementsInput,
    user,
    searchText?: string,
    paginationArgs?: PaginationArgs,
  ): Promise<{
    stockMovementsByLot: StockMovementsByLot[];
    total: number;
  }> {
    const { skip = 0, take = 10 } = paginationArgs || {};

    const { lotName } = lotStockMovementsInput;

    try {
      let organization = null;
      if (user.role.userType !== 'SUPERADMIN') {
        try {
          organization = await this.prisma.user.findFirst({
            select: { organizationId: true },
            where: {
              id: user.userId,
            },
          });
        } catch (error) {
          console.log(error);
          throw new BadRequestException(
            'No organization found with this User Id!',
          );
        }
      }
      const organizationId = organization?.organizationId || null;

      if (user.role.userType === 'STAFF') {
        const lotTransactionType = await this.prisma.stockMovement.findFirst({
          select: { transactionType: true },
          where: {
            lot_name: lotName,
          },
        });

        if (lotTransactionType.transactionType !== StockMovementsType.EXIT) {
          throw new BadRequestException('Staffs can only see Exit Movements!');
        }
      }

      let whereClause: Prisma.StockMovementWhereInput = {
        status: true,
        lot_name: lotName,
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
            warehouse: {
              name: { contains: searchText, mode: 'insensitive' },
            },
            organization: {
              name: { contains: searchText, mode: 'insensitive' },
            },
          },
        ];
      }

      if (organizationId) {
        whereClause = {
          ...whereClause,
          organizationId,
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

      let stockMovementsByLot = null;
      try {
        stockMovementsByLot = await this.prisma.stockMovement.findMany({
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
            warehouse: {
              select: {
                name: true,
              },
            },
            organization: {
              select: {
                name: true,
              },
            },
            pharmacy: {
              select: {
                name: true,
              },
            },
          },
        });
      } catch (error) {
        console.log(error);
        throw new Error('Stock movement fetching error!!');
      }

      stockMovementsByLot.map((sM: any) => {
        sM.item = sM.item.name;
        sM.organisation = sM.organization.name;
        sM.lotName = sM.lot_name;

        if (sM.warehouseStockId) {
          sM.warehouse = sM.warehouse.name || null;
          sM.pharmacy = null;
          sM.pharmacyClearance = null;
        }

        if (sM.pharmacyStockId) {
          sM.warehouse = sM.warehouse.name || null;
          sM.pharmacy = sM.pharmacy.name || null;
          sM.pharmacyClearance = null;
        }

        if (sM.pharmacyStockClearanceId) {
          sM.pharmacyClearance = sM.pharmacy.name || null;
          sM.warehouse = null;
          sM.pharmacy = null;
        }
      });

      return { stockMovementsByLot, total: stockMovementCount };
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
        lot_name: createStockMovementInput.lotName || null,
        item: {
          connect: {
            id: createStockMovementInput?.itemId,
          },
        },
        transactionType: createStockMovementInput?.transactionType,
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
      if (createStockMovementInput?.warehouseId) {
        data = {
          ...data,
          warehouse: {
            connect: {
              id: createStockMovementInput?.warehouseId,
            },
          },
        };
      }
      if (createStockMovementInput?.pharmacyId) {
        data = {
          ...data,
          pharmacy: {
            connect: {
              id: createStockMovementInput?.pharmacyId,
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
