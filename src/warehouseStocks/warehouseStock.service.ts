import { Injectable, Logger } from '@nestjs/common';
import { CreateWarehouseStockInput } from './dto/create-warehouseStock.input';
import { PrismaService } from '../prisma/prisma.service';
import { WarehouseStock } from '@prisma/client';
import { PaginationArgs } from 'src/pagination/pagination.dto';

import { StockMovementService } from '../stockMovement/stockMovement.service';
import { CreateStockMovementInput } from 'src/stockMovement/dto/create-stockMovement.input';
import { CreateSkuNameInput } from './dto/create-skuName.input';
import { Sku } from './entities/sku.entity';

@Injectable()
export class WarehouseStockService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger,
    private readonly stockMovementService: StockMovementService,
  ) {}

  async findAll(paginationArgs?: PaginationArgs): Promise<{
    warehouseStocks: WarehouseStock[];
    total: number;
  }> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    try {
      const totalCount = await this.prisma.warehouseStock.count();
      const warehouseStocks: any = await this.prisma.warehouseStock.findMany({
        skip,
        take,
        include: {
          warehouse: {
            include: {
              organization: true,
            },
          },
          item: true,
          SKU: true,
        },
      });

      warehouseStocks.forEach((wS) => {
        const finalMrp_base_unit = wS.item.mrp_base_unit * wS.final_qty;
        const finalWholesale_price = wS.item.wholesale_price * wS.final_qty;

        wS['totalMrpBaseUnit'] = finalMrp_base_unit;
        wS['totalWholesalePrice'] = finalWholesale_price;
      });

      return { warehouseStocks, total: totalCount };
    } catch (error) {
      throw error;
    }
  }
  async findAllByWarehouseId(
    warehouseId: string,
    paginationArgs?: PaginationArgs,
  ): Promise<{ warehouseStocks: WarehouseStock[]; total: number }> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    try {
      const totalCount = await this.prisma.warehouseStock.count();
      const warehouseStocks = await this.prisma.warehouseStock.findMany({
        where: {
          warehouseId: warehouseId,
        },
        skip,
        take,
        include: {
          warehouse: true,
          item: true,
          SKU: true,
        },
      });

      return { warehouseStocks, total: totalCount };
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
        warehouse: true,
        item: true,
        SKU: true,
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
      console.log(itemCheck);

      if (!itemCheck) throw new Error('No Item present with this ID!');

      const warehouse = await this.prisma.warehouse.findFirst({
        where: {
          id: createWarehouseStockInput.warehouseId,
        },
      });

      if (!warehouse) throw new Error('No Warehouse present with this ID!');

      const organization = await this.prisma.organization.findFirst({
        where: {
          id: createWarehouseStockInput.organizationId,
        },
      });

      if (!organization)
        throw new Error('No organization present with this ID!');
      // This section checks whether the relational ID is present or not! Ends

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

      // CHECKING IF THE WAREHOUSE STOCK ALREADY PRESENT OR NOT, FOR THE ID. STARTS
      const existingStock = await this.prisma.warehouseStock.findFirst({
        where: {
          itemId: createWarehouseStockInput?.itemId,
          warehouseId: createWarehouseStockInput?.warehouseId,
        },
      });
      // CHECKING IF THE WAREHOUSE STOCK ALREADY PRESENT OR NOT, FOR THE ID. ENDS

      // CHECKING FOR UNIQUE BATCHNAME IN SKU MOVEMENT.STARTS.
      const batchName = await this.prisma.stockMovement.findFirst({
        where: {
          batch_name: createWarehouseStockInput.batchName,
        },
      });

      if (batchName) {
        throw new Error('Batch Name already present!');
      }
      // CHECKING FOR UNIQUE BATCHNAME IN SKU MOVEMENT.ENDS.

      // CREATING OR UPDATING THE WAREHOUSE STOCK. STARTS
      let warehouseStock;
      let sku;
      if (!existingStock) {
        // CHECKING IF THE SAME NAMED SKU IS PRESENT OR NOT. STARTS.
        const Sku = await this.prisma.sKU.findFirst({
          where: {
            sku: createWarehouseStockInput.sku,
          },
        });

        if (Sku) throw new Error('SKU already present!');
        // CHECKING IF THE SAME NAMED SKU IS PRESENT OR NOT. ENDS.

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
              connect: { id: createWarehouseStockInput?.organizationId },
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
          updatingSkuData['stockLevel'] = createWarehouseStockInput.stockLevel;
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
            final_qty: existingStock.final_qty + createWarehouseStockInput.qty,
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
}
