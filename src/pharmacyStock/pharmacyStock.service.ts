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
import { ClearancePharmacyStockInput } from './dto/clearance-pharmacyStock.input';
import { generateLotName } from 'src/util/helper';
import { StockMovementsType } from 'src/types/enums/stockMovementsType.enum';

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
      const pharmacyId = loggedinUser?.user?.pharmacy?.id || null;

      let whereClause: Prisma.PharmacyStockWhereInput = {
        status: true,
      };

      if (pharmacyId) {
        whereClause = {
          ...whereClause,
          pharmacy: {
            id: pharmacyId,
          },
        };
      }

      if (searchText) {
        whereClause.OR = [
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

      const pharmacyCount = await this.prisma.pharmacyStock.count({
        where: whereClause,
      });

      let searchObject: PharmacyStockSearchObject = {
        where: whereClause,
        include: {
          item: true,
          pharmacy: {
            include: {
              organization: {
                where: {
                  status: true,
                },
              },
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
            item: true,
            pharmacy: {
              include: {
                organization: {
                  where: {
                    status: true,
                  },
                },
              },
            },
          },
        };
      }

      let pharmacyStocks: any = await this.prisma.pharmacyStock.findMany({
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
        const pharmacyStocksFinal = pharmacyStocks.filter(
          (pS, i) => pS?.pharmacy?.organizationId === organizationId,
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

      return { pharmacyStocks, total: pharmacyCount };
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
      const totalCount = await this.prisma.pharmacyStock.count({
        where: {
          pharmacyId: pharmacyId,
        },
      });
      const pharmacyStocks = await this.prisma.pharmacyStock.findMany({
        where: {
          pharmacyId: pharmacyId,
        },
        skip,
        take,
        include: {
          item: true,
          pharmacy: {
            include: {
              organization: {
                where: {
                  status: true,
                },
              },
            },
          },
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
        pharmacy: {
          include: {
            organization: {
              where: {
                status: true,
              },
            },
          },
        },
        item: true,
      },
    });

    if (!pharmacyStock) {
      throw new Error('No Pharmacy Stock found!');
    }

    return pharmacyStock;
  }

  async create(user, createPharmacyStockInput) {
    try {
      let organization = null;
      try {
        organization = await this.prisma.user.findFirst({
          select: { organizationId: true },
          where: {
            id: user.userId,
          },
        });
      } catch (error) {
        console.error(error);
        throw new Error('No organization found with the logged in user!');
      }

      const organizationId = organization.organizationId;

      const itemObjArr = [...createPharmacyStockInput.itemArr];

      const itemIdArr = itemObjArr.map((iA) => {
        return iA.itemId;
      });

      let itemCheck = null;
      // This section checks whether the relational ID is present or not! Starts
      if (itemIdArr && itemIdArr.length > 0) {
        itemCheck = await this.prisma.item.findMany({
          where: {
            id: {
              in: itemIdArr,
            },
          },
        });

        if (!itemCheck)
          throw new Error('Some items with the provided IDs are not present!');
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

      // Updates the warehouse stock. As stock is transfered for the warehouse to the pharmacy. STARTS
      const existingStock = await this.prisma.warehouseStock.findMany({
        where: {
          itemId: { in: itemIdArr },
          warehouseId: createPharmacyStockInput?.warehouseId,
          status: true,
        },
        include: {
          item: true,
        },
      });

      const existingStockPresentArr = existingStock.map((eS) => {
        return eS.itemId;
      });

      const nonExistingStockArr = itemCheck.filter(
        (item) => !existingStockPresentArr.includes(item.id),
      );

      const nonExistingStockNameArr = nonExistingStockArr.map(
        (nonExistingStock) => nonExistingStock.name,
      );

      if (nonExistingStockArr.length > 0) {
        throw new Error(
          `There is no existing Stock of this ${nonExistingStockNameArr} item in this warehouse!`,
        );
      }

      existingStock.forEach((eS) => {
        const filteredItems = itemObjArr.filter(
          (item) => item.itemId === eS.itemId,
        );

        const checkingNegativeValue = eS.final_qty - filteredItems[0].qty < 0;

        if (checkingNegativeValue) {
          throw new Error(
            `There is only ${eS.final_qty} number of ${eS.item.name} in stock!`,
          );
        }
      });
      const lotName = await generateLotName();

      for (const eS of existingStock) {
        const filteredItems2 = itemObjArr.filter(
          (item) => item.itemId === eS.itemId,
        );

        const warehouseStock = await this.prisma.warehouseStock.update({
          where: {
            id: eS?.id,
          },
          data: {
            final_qty: eS.final_qty - filteredItems2[0].qty,
          },
        });

        if (!warehouseStock) {
          throw new Error(
            'Could not update the Warehouse Stock. Please try after sometime!',
          );
        }
        // Updates the warehouse stock. As stock is transfered for the warehouse to the pharmacy. ENDS

        // CHECKING IF THE PHARMACY STOCK ALREADY PRESENT OR NOT, FOR THE ID. STARTS
        const existingPharmacyStock = await this.prisma.pharmacyStock.findFirst(
          {
            where: {
              status: true,
              itemId: eS?.itemId,
              pharmacyId: createPharmacyStockInput?.pharmacyId,
            },
          },
        );
        // CHECKING IF THE PHARMACY STOCK ALREADY PRESENT OR NOT, FOR THE ID. ENDS

        // CREATING OR UPDATING THE PHARMACY STOCK. STARTS
        let pharmacyStock;
        if (!existingPharmacyStock) {
          // CREATING THE STOCK IF ALREADY NOT PRESENT!STARTS
          pharmacyStock = await this.prisma.pharmacyStock.create({
            data: {
              final_qty: filteredItems2[0].qty,
              item: {
                connect: { id: eS?.itemId },
              },
              pharmacy: {
                connect: { id: createPharmacyStockInput?.pharmacyId },
              },
            },
            include: {
              pharmacy: true,
              item: true,
            },
          });

          if (!pharmacyStock) {
            throw new Error(
              'Could not create the Pharmacy Stock. Please try after sometime!',
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
                existingPharmacyStock.final_qty + filteredItems2[0].qty,
            },
            include: {
              pharmacy: true,
              item: true,
            },
          });

          if (!pharmacyStock) {
            throw new Error(
              'Could not update the Pharmacy Stock. Please try after sometime!',
            );
          }
          // UPDATING THE STOCK!ENDS
        }
        // CREATING OR UPDATING THE PHARMACY STOCK. ENDS

        // SELECTING THE BATCH NAME. STARTS.
        const batchNameExisting = await this.prisma.stockMovement.findMany({
          where: {
            warehouseStockId: eS.id,
          },
          orderBy: {
            expiry: 'asc',
          },
        });

        const copiedBatchNameExisting = JSON.parse(
          JSON.stringify(batchNameExisting),
        );

        let chkqty = filteredItems2[0].qty;

        const rowArr = [];
        for (const row of copiedBatchNameExisting) {
          if (chkqty <= 0) break;

          const qtyArr = await this.prisma.stockMovement.findMany({
            where: {
              batch_name: row.batch_name,
              pharmacyStockId: {
                not: null,
              },
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

        // Creation of Stock Movement data.STARTS
        for (const rowArrVal of rowArr) {
          const createStockMovement: CreateStockMovementInput = {
            itemId: eS?.itemId,
            qty: rowArrVal.qty,
            batchName: rowArrVal.batch_name,
            expiry: rowArrVal.expiry,
            pharmacyStockId: pharmacyStock.id || existingPharmacyStock.id,
            organizationId: organizationId,
            lotName,
            warehouseId: createPharmacyStockInput.warehouseId,
            pharmacyId: createPharmacyStockInput.pharmacyId,
            transactionType: StockMovementsType.MOVEMENT,
          };
          // Creation of Stock Movement data.ENDS

          // CALLING THE STOCKMOVEMENT CREATE METHOD, PASSING "createStockMovement" AS THE ARGUMENT TO IT! STARTS
          await this.stockMovementService.create(createStockMovement);
          // CALLING THE STOCKMOVEMENT CREATE METHOD, PASSING "createStockMovement" AS THE ARGUMENT TO IT! ENDS
        }
      }
      // SELECTING THE BATCH NAME. ENDS.

      return 'Pharmacy Stock created successfully!';
    } catch (error) {
      throw error;
    }
  }

  async clearancePharmacyStock(
    user,
    clearancePharmacyStockInput: ClearancePharmacyStockInput[],
  ) {
    let createPharmacyClearanceArr = [];
    let pharmacyStockArr = [];
    try {
      let organization = null;
      try {
        organization = await this.prisma.user.findFirst({
          select: { organizationId: true },
          where: {
            id: user.userId,
          },
        });
      } catch (error) {
        console.error(error);
        throw new Error('No organization found with the logged in user!');
      }

      const organizationId = organization.organizationId;

      for (const inputs of clearancePharmacyStockInput) {
        try {
          const itemId = await this.prisma.item.findFirst({
            where: {
              id: inputs.itemId,
              status: true,
            },
          });

          if (!itemId) throw new Error('No Item present with this ID!');
        } catch (error) {
          throw error;
        }

        try {
          const pharmacyId = await this.prisma.pharmacy.findFirst({
            where: {
              id: inputs.pharmacyId,
              status: true,
            },
          });

          if (!pharmacyId) throw new Error('No Pharmacy present with this ID!');
        } catch (error) {
          throw error;
        }

        try {
          const pharmacyStock = await this.prisma.pharmacyStock.findFirst({
            where: {
              pharmacyId: inputs.pharmacyId,
              itemId: inputs.itemId,
              status: true,
            },
            include: {
              item: true,
            },
          });

          if (!pharmacyStock || pharmacyStock.final_qty === 0)
            throw new Error(
              'No stock is present of this Item with this pharmacy!',
            );

          const checkingNegativeValue =
            pharmacyStock.final_qty - inputs.qty < 0;

          pharmacyStockArr.push(pharmacyStock);

          if (checkingNegativeValue) {
            throw new Error(
              `There is only ${pharmacyStock.final_qty} number of ${pharmacyStock.item.name} in stock!`,
            );
          }
        } catch (error) {
          throw error;
        }
      }

      let i = -1;
      for (const inputs of clearancePharmacyStockInput) {
        i++;
        try {
          let batchNames;
          try {
            batchNames = await this.prisma.stockMovement.findMany({
              where: {
                pharmacyStockId: pharmacyStockArr[i].id,
                pharmacyStockClearanceId: null,
                status: true,
              },
              orderBy: {
                expiry: 'asc',
              },
            });
          } catch (error) {
            throw error;
          }

          const groupedByBatchName = batchNames.reduce((acc, item) => {
            if (!acc[item.batch_name]) {
              acc[item.batch_name] = {
                batch_name: item.batch_name,
                total_qty: 0,
                itemId: item.itemId,
                pharmacyStockId: item.pharmacyStockId,
                pharmacyId: item.pharmacyId,
              };
            }
            acc[item.batch_name].total_qty += item.qty;
            return acc;
          }, {});

          const groupedArray = Object.values(groupedByBatchName);

          try {
            const updatedPharmacyStock = await this.prisma.pharmacyStock.update(
              {
                where: {
                  id: pharmacyStockArr[i].id,
                },
                data: {
                  final_qty: pharmacyStockArr[i].final_qty - inputs.qty,
                },
              },
            );

            if (!updatedPharmacyStock) {
              throw new Error(
                'Could not update the Pharmacy Stock. Please try after sometime!',
              );
            }
          } catch (error) {
            throw error;
          }

          const createPharmacyClearance =
            await this.prisma.pharmacyStockClearance.create({
              data: {
                itemId: inputs.itemId,
                pharmacyStockId: pharmacyStockArr[i].id,
                qty: inputs.qty,
              },
              include: {
                pharmacyStock: {
                  include: {
                    pharmacy: true,
                  },
                },
                item: true,
              },
            });

          if (!createPharmacyClearance)
            throw new Error('Could not transfer the items! ');

          createPharmacyClearanceArr.push(createPharmacyClearance);

          const copiedgroupedArray = JSON.parse(JSON.stringify(groupedArray));

          let chkqty = inputs.qty;

          const rowArr = [];
          for (const row of copiedgroupedArray) {
            if (chkqty <= 0) break;

            const qtyArr = await this.prisma.stockMovement.findMany({
              where: {
                batch_name: row.batch_name,
                pharmacyStockClearanceId: {
                  not: null,
                },
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

            if (row.total_qty != qtyValTotal) {
              row.total_qty = row.total_qty - qtyValTotal;
              if (chkqty < row.total_qty) {
                row.total_qty = chkqty;
                chkqty = 0;
              } else {
                chkqty = chkqty - row.total_qty;
              }

              rowArr.push({
                ...row,
              });
            }
          }

          const lotName = await generateLotName();
          for (const rowArrVal of rowArr) {
            // Creation of Stock Movement data.STARTS
            const createStockMovement: CreateStockMovementInput = {
              itemId: inputs?.itemId,
              qty: rowArrVal.total_qty,
              batchName: rowArrVal.batch_name,
              expiry: rowArrVal.expiry,
              pharmacyStockClearanceId: createPharmacyClearance.id,
              organizationId: organizationId,
              pharmacyId: rowArrVal.pharmacyId,
              lotName,
              transactionType: StockMovementsType.EXIT,
            };
            // Creation of Stock Movement data.ENDS

            try {
              // CALLING THE STOCKMOVEMENT CREATE METHOD, PASSING "createStockMovement" AS THE ARGUMENT TO IT! STARTS
              await this.stockMovementService.create(createStockMovement);
              // CALLING THE STOCKMOVEMENT CREATE METHOD, PASSING "createStockMovement" AS THE ARGUMENT TO IT! ENDS
            } catch (error) {
              throw error;
            }
          }
        } catch (error) {
          throw error;
        }
      }

      return createPharmacyClearanceArr;
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

  async maxPharmacyStockQty(ctx) {
    try {
      const loggedinUser = await this.accountService.findOne(ctx);
      const loggedinUserRole = loggedinUser?.role;
      const organizationId = loggedinUser?.user?.organizationId;

      let totalQty;
      if (loggedinUserRole !== 'SUPERADMIN') {
        totalQty = await this.prisma.pharmacyStock.findFirst({
          where: {
            pharmacy: {
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
        totalQty = await this.prisma.pharmacyStock.findFirst({
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
