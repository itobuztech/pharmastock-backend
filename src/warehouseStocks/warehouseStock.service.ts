import { Injectable, Logger } from '@nestjs/common';
import { CreateWarehouseStockInput } from './dto/create-warehouseStock.input';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, WarehouseStock } from '@prisma/client';
import { PaginationArgs } from 'src/pagination/pagination.dto';

import { StockMovementService } from '../stockMovement/stockMovement.service';
import { CreateStockMovementInput } from 'src/stockMovement/dto/create-stockMovement.input';
import { CreateSkuNameInput } from './dto/create-skuName.input';
import { Sku } from './entities/sku.entity';
import { WarehouseStockSearchObject } from '../types/extended-types';
import { FilterPharmacyStockInputs } from 'src/pharmacyStock/dto/filter-pharmacyStock.input';
import { AccountService } from '../account/account.service';
import { generateLotName } from 'src/util/helper';
import { StockMovementsType } from 'src/types/enums/stock-movements-type.enum';

@Injectable()
export class WarehouseStockService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger,
    private readonly stockMovementService: StockMovementService,
    private readonly accountService: AccountService,
  ) {}

  async findAll(
    ctx,
    searchText?: string,
    pagination?: Boolean,
    paginationArgs?: PaginationArgs,
    filterArgs?: FilterPharmacyStockInputs,
  ): Promise<{
    warehouseStocks: WarehouseStock[];
    total: number;
  }> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    try {
      const loggedinUser = await this.accountService.findOne(ctx);
      const loggedinUserRole = loggedinUser?.role;
      const organizationId = loggedinUser?.user?.organizationId;

      let whereClause: Prisma.WarehouseStockWhereInput = {
        status: true,
      };

      if (loggedinUserRole !== 'SUPERADMIN') {
        whereClause = {
          ...whereClause,
          warehouse: {
            organizationId,
          },
        };
      }

      if (searchText) {
        whereClause = {
          ...whereClause,
          OR: [
            {
              warehouse: {
                name: { contains: searchText, mode: 'insensitive' },
              },
            },
            {
              SKU: {
                sku: { contains: searchText, mode: 'insensitive' },
              },
            },
            {
              item: {
                name: { contains: searchText, mode: 'insensitive' },
              },
            },
          ],
        };
      }

      if (filterArgs) {
        const filterConditions: Prisma.WarehouseStockWhereInput[] = [];

        // Add quantity filter if provided
        if (filterArgs.qty) {
          filterConditions.push({
            final_qty: { lte: filterArgs.qty },
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
          if (key !== 'startDate' && key !== 'endDate' && key !== 'qty') {
            const value = filterArgs[key];
            filterConditions.push({
              [key]: typeof value === 'number' ? { lte: value } : value,
            });
          }
        });

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
      }

      const warehouseStocksCount = await this.prisma.warehouseStock.count({
        where: whereClause,
      });

      let searchObject: WarehouseStockSearchObject = {
        where: whereClause,
        include: {
          warehouse: {
            where: {
              status: true,
            },
            include: {
              organization: {
                where: {
                  status: true,
                },
              },
            },
          },
          item: {
            where: {
              status: true,
            },
          },
          SKU: {
            where: {
              status: true,
            },
          },
        },
      };
      if (pagination) {
        searchObject = {
          skip,
          take,
          where: whereClause,
          include: {
            warehouse: {
              where: {
                status: true,
              },
              include: {
                organization: {
                  where: {
                    status: true,
                  },
                },
              },
            },
            item: {
              where: {
                status: true,
              },
            },
            SKU: {
              where: {
                status: true,
              },
            },
          },
        };
      }

      let warehouseStocks: any = await this.prisma.warehouseStock.findMany({
        ...searchObject,
        orderBy: [
          {
            updatedAt: 'desc',
          },
          {
            createdAt: 'asc',
          },
        ],
      });

      // Add organizationId if the user is not SUPERADMIN
      warehouseStocks.forEach((wS: any) => {
        const finalMrp_base_unit = wS?.item?.mrp_base_unit * wS?.final_qty;
        const finalWholesale_price = wS?.item?.wholesale_price * wS?.final_qty;

        wS['currency'] = process.env.CURRENCY_TYPE;
        wS['totalMrpBaseUnit'] = finalMrp_base_unit;
        wS['totalWholesalePrice'] = finalWholesale_price;
      });

      return { warehouseStocks, total: warehouseStocksCount };
    } catch (error) {
      throw error;
    }
  }

  async findAllByWarehouseId(
    ctx,
    warehouseId: string,
    searchText?: string,
    pagination?: Boolean,
    paginationArgs?: PaginationArgs,
    filterArgs?: FilterPharmacyStockInputs,
  ): Promise<{ warehouseStocks: WarehouseStock[]; total: number }> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    try {
      const loggedinUser = await this.accountService.findOne(ctx);
      const loggedinUserRole = loggedinUser?.role;
      const organizationId = loggedinUser?.user?.organizationId;

      let whereClause: Prisma.WarehouseStockWhereInput = {
        status: true,
        warehouseId,
      };

      if (searchText) {
        whereClause.OR = [
          {
            warehouse: {
              name: { contains: searchText, mode: 'insensitive' },
            },
          },
          {
            SKU: {
              sku: { contains: searchText, mode: 'insensitive' },
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
        const filterConditions: Prisma.WarehouseStockWhereInput[] = [];

        // Add quantity filter if provided
        if (filterArgs.qty) {
          filterConditions.push({
            final_qty: { lte: filterArgs.qty },
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
          if (key !== 'startDate' && key !== 'endDate' && key !== 'qty') {
            const value = filterArgs[key];
            filterConditions.push({
              [key]: typeof value === 'number' ? { lte: value } : value,
            });
          }
        });

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
      }

      const totalCount = await this.prisma.warehouseStock.count({
        where: whereClause,
      });

      let searchObject: WarehouseStockSearchObject = {
        where: whereClause,
        include: {
          warehouse: {
            where: {
              status: true,
            },
            include: {
              organization: {
                where: {
                  status: true,
                },
              },
            },
          },
          item: {
            where: {
              status: true,
            },
          },
          SKU: {
            where: {
              status: true,
            },
          },
        },
      };
      if (pagination) {
        searchObject = {
          skip,
          take,
          where: whereClause,
          include: {
            warehouse: {
              where: {
                status: true,
              },
              include: {
                organization: {
                  where: {
                    status: true,
                  },
                },
              },
            },
            item: {
              where: {
                status: true,
              },
            },
            SKU: {
              where: {
                status: true,
              },
            },
          },
        };
      }

      let warehouseStocks: any = await this.prisma.warehouseStock.findMany({
        ...searchObject,
        orderBy: [
          {
            updatedAt: 'desc',
          },
          {
            createdAt: 'asc',
          },
        ],
      });

      // Add organizationId if the user is not SUPERADMIN
      if (loggedinUserRole !== 'SUPERADMIN') {
        const warehouseStocksFinal = warehouseStocks.filter(
          (wS, i) => wS.warehouse.organization.id === organizationId,
        );

        warehouseStocksFinal.forEach((wS: any) => {
          const finalMrp_base_unit = wS.item.mrp_base_unit * wS.final_qty;
          const finalWholesale_price = wS.item.wholesale_price * wS.final_qty;

          wS['currency'] = process.env.CURRENCY_TYPE;
          wS['totalMrpBaseUnit'] = finalMrp_base_unit;
          wS['totalWholesalePrice'] = finalWholesale_price;
        });

        warehouseStocks = warehouseStocksFinal;
      } else {
        warehouseStocks.forEach((wS: any) => {
          const finalMrp_base_unit = wS?.item?.mrp_base_unit * wS?.final_qty;
          const finalWholesale_price =
            wS?.item?.wholesale_price * wS?.final_qty;

          wS['currency'] = process.env.CURRENCY_TYPE;
          wS['totalMrpBaseUnit'] = finalMrp_base_unit;
          wS['totalWholesalePrice'] = finalWholesale_price;
        });
      }

      return { warehouseStocks, total: warehouseStocks.length };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<WarehouseStock> {
    const warehouseStock: any = await this.prisma.warehouseStock.findFirst({
      where: {
        id,
      },
      include: {
        warehouse: {
          where: {
            status: true,
          },
          include: {
            organization: {
              where: {
                status: true,
              },
            },
          },
        },
        item: {
          where: {
            status: true,
          },
        },
        SKU: {
          where: {
            status: true,
          },
        },
      },
    });

    if (!warehouseStock) {
      throw new Error('No WarehouseStock found!');
    }

    return warehouseStock;
  }

  async hasDuplicateElement(arr: any[]): Promise<Boolean> {
    return new Set(arr).size !== arr.length;
  }

  async create(ctx, createWarehouseStockInputs: CreateWarehouseStockInput[]) {
    try {
      const batchNameArr = createWarehouseStockInputs.map(
        (createWarehouseStockInput) => {
          return createWarehouseStockInput.batchName;
        },
      );

      const duplicate = await this.hasDuplicateElement(batchNameArr);

      if (duplicate) {
        throw new Error('Can not have same batch names!');
      }
      const organization = await this.prisma.organization.findFirst({
        where: {
          User: {
            some: {
              id: ctx.req.user.userId,
            },
          },
        },
      });

      if (!organization) {
        throw new Error('No organisation found with this logged in user!');
      }
      const organizationId = organization.id;

      // Checking all the validations. Starts!
      for (const createWarehouseStockInput of createWarehouseStockInputs) {
        // This section checks whether the relational ID is present or not! Starts
        const itemCheck = await this.prisma.item.findFirst({
          where: {
            id: createWarehouseStockInput?.itemId,
          },
        });

        if (!itemCheck) throw new Error('No Item present with this ID!');

        const warehouse = await this.prisma.warehouse.findFirst({
          where: {
            id: createWarehouseStockInput.warehouseId,
          },
        });

        if (!warehouse) throw new Error('No Warehouse present with this ID!');
        // This section checks whether the relational ID is present or not! Ends

        // CHECKING FOR UNIQUE BATCHNAME IN SKU MOVEMENT.STARTS.
        const batchName = await this.prisma.stockMovement.findFirst({
          where: {
            status: true,
            batch_name: createWarehouseStockInput.batchName,
          },
        });

        if (batchName) {
          throw new Error('Batch Name already present!');
        }
        // CHECKING FOR UNIQUE BATCHNAME IN SKU MOVEMENT.ENDS.

        // CHECKING IF THE WAREHOUSE STOCK ALREADY PRESENT OR NOT, FOR THE ID. STARTS
        const existingStockForValidation =
          await this.prisma.warehouseStock.findFirst({
            where: {
              itemId: createWarehouseStockInput?.itemId,
              warehouseId: createWarehouseStockInput?.warehouseId,
            },
          });
        // CHECKING IF THE WAREHOUSE STOCK ALREADY PRESENT OR NOT, FOR THE ID. ENDS

        if (!existingStockForValidation) {
          // CHECKING IF THE SAME NAMED SKU IS PRESENT OR NOT. STARTS.
          const Sku = await this.prisma.sKU.findFirst({
            where: {
              status: true,
              sku: createWarehouseStockInput.sku,
            },
          });

          if (Sku) throw new Error('SKU already present!');
          // CHECKING IF THE SAME NAMED SKU IS PRESENT OR NOT. ENDS.
        }
      }

      // Checking all the validations. Ends!

      const lotName = await generateLotName();

      // Create or updating section. Starts!
      for (const createWarehouseStockInput of createWarehouseStockInputs) {
        // CHECKING IF THE WAREHOUSE STOCK ALREADY PRESENT OR NOT, FOR THE ID. STARTS
        const existingStock = await this.prisma.warehouseStock.findFirst({
          where: {
            itemId: createWarehouseStockInput?.itemId,
            warehouseId: createWarehouseStockInput?.warehouseId,
          },
        });
        // CHECKING IF THE WAREHOUSE STOCK ALREADY PRESENT OR NOT, FOR THE ID. ENDS
        // CREATING OR UPDATING THE WAREHOUSE STOCK. STARTS
        let warehouseStock;
        let sku;
        if (!existingStock) {
          // Setting up the data to be used!Starts
          const data = {
            item: {
              connect: { id: createWarehouseStockInput?.itemId },
            },
            warehouse: {
              connect: { id: createWarehouseStockInput?.warehouseId },
            },
            final_qty: createWarehouseStockInput.qty,
          };
          // Setting up the data to be used!ENDS

          // CREATING THE STOCK IF ALREADY NOT PRESENT!STARTS
          warehouseStock = await this.prisma.warehouseStock.create({
            data,
            include: {
              warehouse: true,
              item: true,
              SKU: true,
            },
          });

          if (!warehouseStock) {
            throw new Error(
              'Could not create the Warehouse Stock. Please try after sometime!',
            );
          }
          // CREATING THE STOCK IF ALREADY NOT PRESENT!ENDS

          // CREATION OF SKU FOR THE ITEM STOCK. STARTS
          sku = await this.prisma.sKU.create({
            data: {
              sku: createWarehouseStockInput.sku,
              stocklevel_min: createWarehouseStockInput.stocklevelMin,
              stocklevel_max: createWarehouseStockInput.stocklevelMax,
              stock_status: createWarehouseStockInput.stockStatus,
              stockLevel: createWarehouseStockInput.stockLevel,
              item: {
                connect: { id: createWarehouseStockInput?.itemId },
              },
              organization: {
                connect: { id: organizationId },
              },
              warehouseStock: {
                connect: { id: warehouseStock?.id },
              },
              warehouse: {
                connect: { id: createWarehouseStockInput?.warehouseId },
              },
            },
          });

          if (!sku) {
            throw new Error(
              'Could not create the SKU. Please try after sometime!',
            );
          }
          // CREATION OF SKU FOR THE ITEM STOCK. ENDS

          warehouseStock.SKU = sku;
        } else {
          // CHECKING IF THE SAME NAMED SKU IS PRESENT OR NOT IN OTHER ROWS. STARTS.
          const Sku = await this.prisma.sKU.findFirst({
            where: {
              status: true,
              sku: createWarehouseStockInput.sku,
              NOT: {
                warehouseStockId: existingStock?.id,
              },
            },
          });

          if (Sku) throw new Error('SKU already present!');
          // CHECKING IF THE SAME NAMED SKU IS PRESENT OR NOT IN OTHER ROWS. ENDS.

          // UPDATING THE SKU. STARTS.
          const updatingSkuData = { sku: createWarehouseStockInput.sku };

          if (createWarehouseStockInput.stocklevelMin) {
            updatingSkuData['stocklevel_min'] =
              createWarehouseStockInput.stocklevelMin;
          }
          if (createWarehouseStockInput.stocklevelMax) {
            updatingSkuData['stocklevel_max'] =
              createWarehouseStockInput.stocklevelMax;
          }
          if (createWarehouseStockInput.stockStatus) {
            updatingSkuData['stock_status'] =
              createWarehouseStockInput.stockStatus;
          }
          if (createWarehouseStockInput.stockLevel) {
            updatingSkuData['stockLevel'] =
              createWarehouseStockInput.stockLevel;
          }

          sku = await this.prisma.sKU.update({
            where: {
              warehouseStockId: existingStock?.id,
            },
            data: updatingSkuData,
          });

          if (!sku) {
            throw new Error(
              'Could not update the SKU. Please try after sometime!',
            );
          }
          // UPDATING THE SKU. ENDS.
          // UPDATING THE STOCK!STARTS
          warehouseStock = await this.prisma.warehouseStock.update({
            where: {
              id: existingStock?.id,
            },
            data: {
              final_qty:
                existingStock.final_qty + createWarehouseStockInput.qty,
            },
            include: {
              warehouse: true,
              item: true,
              SKU: true,
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
          warehouseId: createWarehouseStockInput.warehouseId,
          organizationId: organizationId,
          lotName,
          transactionType: StockMovementsType.ENTRY,
        };
        // Creation of Stock Movement data.ENDS

        // CALLING THE STOCKMOVEMENT CREATE METHOD, PASSING "createStockMovement" AS THE ARGUMENT TO IT! STARTS
        await this.stockMovementService.create(createStockMovement);
        // CALLING THE STOCKMOVEMENT CREATE METHOD, PASSING "createStockMovement" AS THE ARGUMENT TO IT! ENDS
      }
      // Create or updating section. Ends!

      return 'Warehouse stocks created successfully';
    } catch (error) {
      throw error;
    }
  }

  async deleteWarehouseStock(id: string) {
    try {
      const deleted = await this.prisma.warehouseStock.update({
        where: {
          id,
        },
        data: { status: false },
      });

      if (!deleted) {
        throw new Error(
          'Could not delete the Warehouse Stock. Please try after sometime!',
        );
      }

      if (deleted) {
        try {
          await this.prisma.stockMovement.updateMany({
            where: {
              warehouseStockId: id,
            },
            data: { status: false },
          });
          await this.prisma.sKU.updateMany({
            where: {
              warehouseStockId: id,
            },
            data: { status: false },
          });
        } catch (error) {
          throw new Error(error);
        }
      }

      return deleted;
    } catch (error) {
      throw new Error(error);
    }
  }

  async generateSKU(createSkuNameInput: CreateSkuNameInput) {
    try {
      // This section checks whether the relational ID is present or not! Starts
      const itemCheck = await this.prisma.item.findFirst({
        where: {
          id: createSkuNameInput?.itemId,
        },
      });

      if (!itemCheck) {
        throw new Error('No Item present with this ID!');
      }

      const warehouse = await this.prisma.warehouse.findFirst({
        where: {
          id: createSkuNameInput.warehouseId,
        },
      });

      if (!warehouse) {
        throw new Error('No Warehouse present with this ID!');
      }
      const organization = await this.prisma.organization.findFirst({
        where: {
          id: createSkuNameInput.organizationId,
        },
      });

      if (!organization) {
        throw new Error('No organization present with this ID!');
      }
      // This section checks whether the relational ID is present or not! Ends

      // SKU VALUE CREATION. STARTS.
      const itemName = itemCheck.name;
      const warehouseName = warehouse.name;
      const orgName = organization.name;

      const skuNameGenerated = `${itemName} ${warehouseName} ${orgName}`;
      // SKU VALUE CREATION. ENDS.

      return { sku: skuNameGenerated };
    } catch (error) {
      throw error;
    }
  }

  async getSkuByOrgWarhItem(
    itemId: string,
    warehouseId: string,
    organizationId: string,
  ): Promise<Sku> {
    try {
      const sku = await this.prisma.sKU.findFirst({
        where: {
          status: true,
          itemId,
          warehouseId,
          organizationId,
        },
      });

      if (!sku) {
        throw new Error('There is no SKU present with these IDs!');
      }
      return sku;
    } catch (error) {
      throw error;
    }
  }

  async maxWarehouseStockQty(ctx) {
    try {
      const loggedinUser = await this.accountService.findOne(ctx);
      const loggedinUserRole = loggedinUser?.role;
      const organizationId = loggedinUser?.user?.organizationId;

      let totalQty;
      if (loggedinUserRole !== 'SUPERADMIN') {
        totalQty = await this.prisma.warehouseStock.findFirst({
          where: {
            warehouse: {
              organizationId: organizationId,
            },
            status: true,
          },
          select: {
            final_qty: true,
          },
          orderBy: {
            final_qty: 'desc',
          },
        });
      } else {
        totalQty = await this.prisma.warehouseStock.findFirst({
          select: {
            final_qty: true,
          },
          where: {
            status: true,
          },
          orderBy: {
            final_qty: 'desc',
          },
        });
      }

      if (totalQty && totalQty.final_qty) {
        totalQty = totalQty.final_qty;
      }

      return { totalQty };
    } catch (error) {
      throw new Error(error);
    }
  }
}
