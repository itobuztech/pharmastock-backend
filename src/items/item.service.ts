import { Injectable, Logger } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { PrismaService } from '../prisma/prisma.service';
import { Item } from '@prisma/client';
import { PaginationArgs } from '../pagination/pagination.dto';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {}

  async findAll(
    paginationArgs?: PaginationArgs,
  ): Promise<{ items: Item[]; total: number }> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    try {
      const totalCount = await this.prisma.item.count();
      const items: any = await this.prisma.item.findMany({
        skip,
        take,
        include: {
          ItemCategoryRelation: {
            include: {
              itemCategory: true,
            },
          },
        },
      });

      if (items) {
        items.forEach((it) => {
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

      return { items, total: totalCount };
      // return item;
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
          include: {
            itemCategory: true,
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
      let catArr = [];
      // Check if the category ID that is provided is valid or not. STARTS!
      if (createItemInput.category) {
        const categories = createItemInput.category;

        for (const cat of categories) {
          const category = await this.prisma.itemCategory.findFirst({
            where: {
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
          sku: createItemInput.sku,
          mrp_base_unit: createItemInput.mrp_base_unit,
          wholesale_price: createItemInput.wholesale_price,
          hsn_code: createItemInput.hsn_code,
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
    let catArr = [];

    if (data.category) {
      this.prisma.itemCategoryRelation.deleteMany({
        where: {
          itemId: id,
        },
      });

      const categories = data.category;

      for (const cat of categories) {
        const category = await this.prisma.itemCategory.findFirst({
          where: {
            id: cat,
          },
        });

        if (!category) {
          throw new Error('No category find with this ID!');
        }

        catArr.push(category);
      }
    } else {
      const itemCatRelation = await this.prisma.itemCategoryRelation.findMany({
        where: {
          itemId: id,
        },
      });

      if (!itemCatRelation) {
        throw new Error('No item category relation found with this item ID!');
      }

      for (const itCatRel of itemCatRelation) {
        const category = await this.prisma.itemCategory.findFirst({
          where: {
            id: itCatRel.itemCategoryId,
          },
        });

        if (!category) {
          throw new Error('No category find with this ID!');
        }

        catArr.push(category);
      }
    }

    let itemData = data;

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
    const deleted = await this.prisma.item.delete({
      where: {
        id,
      },
    });

    if (!deleted) {
      throw new Error('Could not delete the Item. Please try after sometime!');
    }
    return deleted;
  }

  async deleteItemCategoryRelation(id: string) {
    const deleted = await this.prisma.itemCategoryRelation.delete({
      where: {
        id,
      },
    });

    if (!deleted) {
      throw new Error(
        'Could not delete the Item and Category Relation. Please try after sometime!',
      );
    }
    return deleted;
  }
}
