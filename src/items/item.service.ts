import { Injectable, Logger } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { PrismaService } from '../prisma/prisma.service';
import { Item } from '@prisma/client';
import { PaginationArgs } from '../pagination/pagination.dto';
import { BaseUnit } from './base-unit.enum';
import { Prisma } from '@prisma/client';
import { ItemSearchObject } from '../types/extended-types';
import { FilterItemInputs } from './dto/filter-item.input';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {}

  async findAll(
    searchText?: string,
    pagination?: Boolean,
    paginationArgs?: PaginationArgs,
    filterArgs?: FilterItemInputs,
  ): Promise<{ items: Item[]; total: number }> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    try {
      let whereClause: Prisma.ItemWhereInput = {};

      if (searchText) {
        whereClause.OR = [
          { name: { contains: searchText, mode: 'insensitive' } },
          { instructions: { contains: searchText, mode: 'insensitive' } },
          { hsn_code: { contains: searchText, mode: 'insensitive' } },
        ];
      }

      if (filterArgs) {
        if (filterArgs.mrpBaseUnit !== null && filterArgs.mrpBaseUnit !== 0) {
          filterArgs['mrp_base_unit'] = filterArgs.mrpBaseUnit;
          delete filterArgs.mrpBaseUnit;
        } else {
          delete filterArgs.mrpBaseUnit;
        }
        if (
          filterArgs.wholeSalePrice !== null &&
          filterArgs.wholeSalePrice !== 0
        ) {
          filterArgs['wholesale_price'] = filterArgs.wholeSalePrice;
          delete filterArgs.wholeSalePrice;
        } else {
          delete filterArgs.wholeSalePrice;
        }
        if (filterArgs.baseUnit === null) {
          delete filterArgs.baseUnit;
        }
        console.log('filterArgs=', filterArgs);

        const filterConditions = Object.keys(filterArgs).map((key) => {
          const value = filterArgs[key];
          console.log('value=', value);

          return typeof value === 'number'
            ? { [key]: { lte: value } }
            : { [key]: value };
        });

        if (whereClause.OR) {
          whereClause = {
            AND: [{ OR: whereClause.OR }, ...filterConditions],
          };
        } else {
          whereClause = {
            AND: filterConditions,
          };
        }
      }

      let searchObject: ItemSearchObject = {
        where: {
          ...whereClause,
          status: true,
        },
        include: {
          ItemCategoryRelation: {
            where: {
              status: true,
            },
            include: {
              itemCategory: {
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
          where: {
            ...whereClause,
            status: true,
          },
          include: {
            ItemCategoryRelation: {
              where: {
                status: true,
              },
              include: {
                itemCategory: {
                  where: {
                    status: true,
                  },
                },
              },
            },
          },
        };
      }

      const items: any = await this.prisma.item.findMany({
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

      if (items) {
        items.forEach((it, i) => {
          if (it.ItemCategoryRelation) {
            const relationArr = it.ItemCategoryRelation;
            const categories = [];
            relationArr.forEach((rel) => {
              categories.push(rel.itemCategory);
            });
            it.Category = categories;
          }
        });
      }

      return { items, total: items.length };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Item> {
    const item: any = await this.prisma.item.findFirst({
      where: {
        id,
      },
      include: {
        ItemCategoryRelation: {
          where: {
            status: true,
          },
          include: {
            itemCategory: {
              where: {
                status: true,
              },
            },
          },
        },
      },
    });

    if (!item) {
      throw new Error('No Item found!');
    }

    if (item.ItemCategoryRelation) {
      const relationArr = item.ItemCategoryRelation;
      const categories = [];
      relationArr.forEach((rel) => {
        categories.push(rel.itemCategory);
      });
      item.Category = categories;
    }

    return item;
  }

  async create(createItemInput: CreateItemInput) {
    try {
      // HANDELING INPUTS. STARTS
      // ITEM NAME UNIQUENESS CHECK. STARTS.
      if (createItemInput.name) {
        const unique = await this.prisma.item.findFirst({
          where: {
            status: true,
            name: createItemInput.name,
          },
        });

        if (unique) {
          throw new Error('Item name alerady present!');
        }
      }
      // ITEM NAME UNIQUENESS CHECK. ENDS.
      // HANDELING INPUTS. ENDS
      let catArr = [];
      // Check if the category ID that is provided is valid or not. STARTS!
      if (createItemInput.category) {
        const categories = createItemInput.category;

        for (const cat of categories) {
          const category = await this.prisma.itemCategory.findFirst({
            where: {
              status: true,
              id: cat,
            },
          });

          if (!category) {
            throw new Error('No category find with this ID!');
          }

          catArr.push(category);
        }
      }
      // Check if the category ID that is provided is valid or not. ENDS!

      // Creting the item. STARTS
      const item: any = await this.prisma.item.create({
        data: {
          baseUnit: createItemInput.baseUnit,
          instructions: createItemInput.instructions,
          mrp_base_unit: createItemInput.mrpBaseUnit,
          wholesale_price: createItemInput.wholesalePrice,
          hsn_code: createItemInput.hsnCode,
          name: createItemInput.name,
        },
      });

      if (!item) {
        throw new Error(
          'Could not create the Item. Please try after sometime!',
        );
      }
      // Creting the item. ENDS

      // Adding the category list with the new created item details.STARTS
      if (catArr) {
        item.Category = catArr;
      }
      // Adding the category list with the new created item details.ENDS

      // Creating item-category-relation. Starts
      if (createItemInput.category) {
        // Filling up the data array with the categories.STARTS
        const data = [];
        createItemInput.category.forEach((cat) => {
          data.push({
            itemId: item?.id,
            itemCategoryId: cat,
          });
        });
        // Filling up the data array with the categories.ENDS

        // Creating the relation.STARTS
        const relations = await this.prisma.itemCategoryRelation.createMany({
          data,
        });

        if (!relations) {
          throw new Error(
            'Could not create the Item and Category Relation. Please try after sometime!',
          );
        }
        // Creating the relation.ENDS
      }
      // Creating item-category-relation. Ends

      return item;
    } catch (error) {
      throw error;
    }
  }

  async updateItem(id: string, data) {
    // HANDLEING THE INPUT. STARTS.
    if (data.hsnCode) {
      data.hsn_code = data.hsnCode;
      delete data.hsnCode;
    }
    if (data.mrpBaseUnit) {
      data.mrp_base_unit = data.mrpBaseUnit;
      delete data.mrpBaseUnit;
    }
    if (data.wholesalePrice) {
      data.wholesale_price = data.wholesalePrice;
      delete data.wholesalePrice;
    }
    // HANDLEING THE INPUT. ENDS.

    if (data.name) {
      const unique = await this.prisma.item.findFirst({
        where: {
          status: true,
          name: data.name,
          NOT: {
            id,
          },
        },
      });

      if (unique) {
        throw new Error('Item name alerady present!');
      }
    }
    let catArr = [];

    if (data.category) {
      const categories = data.category;

      for (const cat of categories) {
        const category = await this.prisma.itemCategory.findFirst({
          where: {
            status: true,
            id: cat,
          },
        });

        if (!category) {
          throw new Error('No category find with this ID!');
        }

        catArr.push(category);
      }

      await this.prisma.itemCategoryRelation.updateMany({
        where: {
          itemId: id,
        },
        data: { status: false },
      });
    } else {
      const itemCatRelation = await this.prisma.itemCategoryRelation.findMany({
        where: {
          status: true,
          itemId: id,
        },
      });

      if (!itemCatRelation) {
        throw new Error('No item category relation found with this item ID!');
      }

      for (const itCatRel of itemCatRelation) {
        const category = await this.prisma.itemCategory.findFirst({
          where: {
            status: true,
            id: itCatRel.itemCategoryId,
          },
        });

        if (!category) {
          throw new Error('No category find with this ID!');
        }

        catArr.push(category);
      }
    }

    let itemData = { ...data };

    delete itemData.category;

    // Updating the item.Starts
    const item: any = await this.prisma.item.update({
      where: {
        id,
      },
      data: itemData,
    });
    // Updating the item.Ends

    // Adding the category list with the new created item details.STARTS
    if (catArr) {
      item.Category = catArr;
    }
    // Adding the category list with the new created item details.ENDS

    // Creating item-category-relation. Starts
    if (data.category) {
      // Filling up the data array with the categories.STARTS
      const dataRelation = [];
      data.category.forEach((cat) => {
        dataRelation.push({
          itemId: item?.id,
          itemCategoryId: cat,
        });
      });
      // Filling up the data array with the categories.ENDS

      // Creating the relation.STARTS
      const relations = await this.prisma.itemCategoryRelation.createMany({
        data: dataRelation,
      });

      if (!relations) {
        throw new Error(
          'Could not create the Item and Category Relation. Please try after sometime!',
        );
      }
      // Creating the relation.ENDS
    }
    // Creating item-category-relation. Ends

    if (!item) {
      throw new Error('Could not update the Item. Please try after sometime!');
    }

    return item;
  }

  async deleteItem(id: string) {
    try {
      const deleted = await this.prisma.item.update({
        where: {
          id,
        },
        data: { status: false },
        include: {
          ItemCategoryRelation: true,
        },
      });

      if (!deleted) {
        throw new Error(
          'Could not delete the Item. Please try after sometime!',
        );
      }

      if (deleted) {
        try {
          await this.prisma.itemCategoryRelation.updateMany({
            where: {
              itemId: id,
            },
            data: { status: false },
          });
          await this.prisma.warehouseStock.updateMany({
            where: {
              itemId: id,
            },
            data: { status: false },
          });
          await this.prisma.pharmacyStock.updateMany({
            where: {
              itemId: id,
            },
            data: { status: false },
          });
          await this.prisma.stockMovement.updateMany({
            where: {
              itemId: id,
            },
            data: { status: false },
          });
          await this.prisma.sKU.updateMany({
            where: {
              itemId: id,
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
