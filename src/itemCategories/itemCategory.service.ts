import { Injectable, Logger } from '@nestjs/common';
import { CreateItemCategoryInput } from './dto/create-itemCategory.input';
import { PrismaService } from '../prisma/prisma.service';
import { ItemCategory } from '@prisma/client';
import { PaginationArgs } from 'src/pagination/pagination.dto';

@Injectable()
export class ItemCategoryService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {}

  async findAll(paginationArgs?: PaginationArgs): Promise<ItemCategory[]> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    try {
      const itemCategory: any = await this.prisma.itemCategory.findMany({
        skip,
        take,
        include: {
          ItemCategoryRelation: {
            include: {
              item: true,
            },
          },
        },
      });

      if (itemCategory) {
        itemCategory.forEach((ic) => {
          if (ic.ItemCategoryRelation) {
            const relationArr = ic.ItemCategoryRelation;
            const items = [];
            relationArr.forEach((rel) => {
              items.push(rel.item);
            });
            ic.Item = items;
          }
        });
      }

      return itemCategory;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<ItemCategory> {
    const itemCategory: any = await this.prisma.itemCategory.findFirst({
      where: {
        id,
      },
      include: {
        ItemCategoryRelation: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!itemCategory) {
      throw new Error('No Item Category found!');
    }

    if (itemCategory.ItemCategoryRelation) {
      const relationArr = itemCategory.ItemCategoryRelation;
      const items = [];
      relationArr.forEach((rel) => {
        items.push(rel.item);
      });
      itemCategory.Item = items;
    }

    return itemCategory;
  }

  async create(createItemCategoryInput: CreateItemCategoryInput) {
    try {
      const itemCategory = await this.prisma.itemCategory.create({
        data: {
          name: createItemCategoryInput.name || null,
          parentCategoryId: createItemCategoryInput.parentCategoryId || null,
        },
      });

      if (!itemCategory) {
        throw new Error(
          'Could not create the Item Category. Please try after sometime!',
        );
      }

      return itemCategory;
    } catch (error) {
      throw error;
    }
  }

  async updateItemCategory(id: string, data) {
    const itemCategory = await this.prisma.itemCategory.update({
      where: {
        id,
      },
      data,
    });

    if (!itemCategory) {
      throw new Error(
        'Could not update the Item Category. Please try after sometime!',
      );
    }

    return itemCategory;
  }

  async deleteItemCategory(id: string) {
    const deleted = await this.prisma.itemCategory.delete({
      where: {
        id,
      },
    });

    if (!deleted) {
      throw new Error(
        'Could not delete the Item Category. Please try after sometime!',
      );
    }
    return deleted;
  }
}
