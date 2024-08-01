import { Catch, Injectable, Logger } from '@nestjs/common';
import { CreatePharmacyStockInput } from './dto/create-pharmacyStock.input';
import { PrismaService } from '../prisma/prisma.service';
import { PharmacyStock, Prisma } from '@prisma/client';
import { PaginationArgs } from '../pagination/pagination.dto';

import { StockMovementService } from '../stockMovement/stockMovement.service';
import { CreateStockMovementInput } from 'src/stockMovement/dto/create-stockMovement.input';
import { PharmacyStockSearchObject } from '../types/extended-types';
import { FilterPharmacyStockInputs } from './dto/filter-pharmacyStock.input';
import { AccountService } from '../account/account.service';

@Injectable()
export class PharmacyStockService {
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
  ): Promise<{ pharmacyStocks: PharmacyStock[]; total: number }> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    try {
      const loggedinUser = await this.accountService.findOne(ctx);
      const loggedinUserRole = loggedinUser?.role;
      const organizationId = loggedinUser?.user?.organizationId;

      let whereClause: Prisma.PharmacyStockWhereInput = {
        status: true,
      };

      if (searchText) {
        whereClause.OR = [
          {
            warehouse: {
              name: { contains: searchText, mode: 'insensitive' },
            },
          },
          {
            pharmacy: {
              name: { contains: searchText, mode: 'insensitive' },
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
        const filterConditions: Prisma.PharmacyStockWhereInput[] = [];

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

      let searchObject: PharmacyStockSearchObject = {
        where: whereClause,
        include: {
          warehouse: true,
          item: true,
          pharmacy: true,
        },
      };
      if (pagination) {
        searchObject = {
          skip,
          take,
          where: whereClause,
          include: {
            warehouse: true,
            item: true,
            pharmacy: true,
          },
        };
      }

      let pharmacyStocks: any = await this.prisma.pharmacyStock.findMany(
        searchObject,
      );

      // Add organizationId if the user is not SUPERADMIN
      if (loggedinUserRole !== 'SUPERADMIN') {
        const pharmacyStocksFinal = pharmacyStocks.filter(
          (pS, i) => pS?.warehouse?.organization?.id === organizationId,
        );

        pharmacyStocksFinal.forEach((pS: any) => {
          const finalMrp_base_unit = pS?.item?.mrp_base_unit * pS?.final_qty;
          const finalWholesale_price =
            pS?.item?.wholesale_price * pS?.final_qty;

          pS['totalMrpBaseUnit'] = finalMrp_base_unit;
          pS['totalWholesalePrice'] = finalWholesale_price;
        });

        pharmacyStocks = pharmacyStocksFinal;
      } else {
        pharmacyStocks.forEach((pS: any) => {
          const finalMrp_base_unit = pS?.item?.mrp_base_unit * pS?.final_qty;
          const finalWholesale_price =
            pS?.item?.wholesale_price * pS?.final_qty;

          pS['totalMrpBaseUnit'] = finalMrp_base_unit;
          pS['totalWholesalePrice'] = finalWholesale_price;
        });
      }

      return { pharmacyStocks, total: pharmacyStocks.length };
    } catch (error) {
      throw error;
    }
  }

  async findAllByPharmacyId(
    pharmacyId: string,
    paginationArgs?: PaginationArgs,
  ): Promise<{ pharmacyStocks: PharmacyStock[]; total: number }> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    try {
      const totalCount = await this.prisma.pharmacyStock.count();
      const pharmacyStocks = await this.prisma.pharmacyStock.findMany({
        where: {
          pharmacyId: pharmacyId,
        },
        skip,
        take,
        include: {
          warehouse: true,
          item: true,
          pharmacy: true,
        },
      });

      pharmacyStocks.forEach((pS) => {
        const finalMrp_base_unit = pS.item.mrp_base_unit * pS.final_qty;
        const finalWholesale_price = pS.item.wholesale_price * pS.final_qty;

        pS['totalMrpBaseUnit'] = finalMrp_base_unit;
        pS['totalWholesalePrice'] = finalWholesale_price;
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
        item: true,
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
          warehouseId: createPharmacyStockInput?.warehouseId,
          status: true,
        },
      });

      if (!existingStock) {
        throw new Error(
          'There is no existing Stock with this item and warehouse. Please try after sometime!',
        );
      }

      const checkingNegativeValue =
        existingStock.final_qty - createPharmacyStockInput.qty < 0;

      if (checkingNegativeValue) {
        throw new Error(
          `There is only ${existingStock.final_qty} number of items in stock!`,
        );
      }

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
          status: true,
          itemId: createPharmacyStockInput?.itemId,
          pharmacyId: createPharmacyStockInput?.pharmacyId,
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
            item: true,
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
            item: true,
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
      // SELECTING THE BATCH NAME. STARTS.
      const batchNameExisting = await this.prisma.stockMovement.findMany({
        where: {
          warehouseStockId: existingStock.id,
          // pharmacyStockId: null,
        },
        orderBy: {
          expiry: 'asc',
        },
      });

      const copiedBatchNameExisting = JSON.parse(
        JSON.stringify(batchNameExisting),
      );

      let chkqty = createPharmacyStockInput.qty;

      const rowArr = [];
      for (const row of copiedBatchNameExisting) {
        if (chkqty <= 0) break;

        const qtyArr = await this.prisma.stockMovement.findMany({
          where: {
            batch_name: row.batch_name,
            warehouseStockId: null,
            status: true,
          },
        });

        let qtyValArr = [];
        if (qtyArr && qtyArr.length > 0) {
          qtyValArr = qtyArr.map((qtV) => {
            return qtV.qty;
          });
        }

        let qtyValTotal = 0;
        if (qtyValArr.length > 0) {
          qtyValTotal = qtyValArr.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0,
          );
        }

        if (row.qty != qtyValTotal) {
          row.qty = row.qty - qtyValTotal;
          if (chkqty < row.qty) {
            row.qty = chkqty;
            chkqty = 0;
          } else {
            chkqty = chkqty - row.qty;
          }

          rowArr.push({
            ...row,
          });
        }
      }

      for (const rowArrVal of rowArr) {
        // Creation of Stock Movement data.STARTS
        const createStockMovement: CreateStockMovementInput = {
          itemId: createPharmacyStockInput?.itemId,
          qty: rowArrVal.qty,
          batchName: rowArrVal.batch_name,
          expiry: rowArrVal.expiry,
          pharmacyStockId: pharmacyStock.id || existingPharmacyStock.id,
        };
        // Creation of Stock Movement data.ENDS

        // CALLING THE STOCKMOVEMENT CREATE METHOD, PASSING "createStockMovement" AS THE ARGUMENT TO IT! STARTS
        await this.stockMovementService.create(createStockMovement);
        // CALLING THE STOCKMOVEMENT CREATE METHOD, PASSING "createStockMovement" AS THE ARGUMENT TO IT! ENDS
      }

      // SELECTING THE BATCH NAME. ENDS.

      return pharmacyStock;
    } catch (error) {
      throw error;
    }
  }

  async deletePharmacyStock(id: string) {
    try {
      const deleted = await this.prisma.pharmacyStock.update({
        where: {
          id,
        },
        data: { status: false },
      });

      if (!deleted) {
        throw new Error(
          'Could not delete the Pharmacy Stock. Please try after sometime!',
        );
      }

      if (deleted) {
        try {
          await this.prisma.stockMovement.updateMany({
            where: {
              pharmacyStockId: id,
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
}
