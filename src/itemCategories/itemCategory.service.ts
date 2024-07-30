import { Injectable, Logger } from '@nestjs/common';
import { CreateItemCategoryInput } from './dto/create-itemCategory.input';
import { PrismaService } from '../prisma/prisma.service';
import { ItemCategory, Prisma } from '@prisma/client';
import { PaginationArgs } from '../pagination/pagination.dto';
import { ItemCategorySearchObject } from '../types/extended-types';

@Injectable()
export class ItemCategoryService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {}

  async findAll(
    searchText?: string,
    pagination?: Boolean,
    paginationArgs?: PaginationArgs,
  ): Promise<{ itemCategories: ItemCategory[]; total: number }> {
    const { skip = 0, take = 10 } = paginationArgs || {};
    try {
      const totalCount = await this.prisma.itemCategory.count({
        where: {
          status: true,
          name: {
            contains: searchText,
            mode: 'insensitive',
          },
        },
      });

      let searchObject: ItemCategorySearchObject = {
        where: {
          status: true,
          name: {
            contains: searchText,
            mode: 'insensitive',
          },
        },
        include: {
          ItemCategoryRelation: {
            where: { status: true },
            include: {
              item: { where: { status: true } },
            },
          },
          parent: { where: { status: true } },
        },
      };
      if (pagination) {
        searchObject = {
          skip,
          take,
          where: {
            status: true,
            name: {
              contains: searchText,
              mode: 'insensitive',
            },
          },
          include: {
            ItemCategoryRelation: {
              where: { status: true },
              include: {
                item: { where: { status: true } },
              },
            },
            parent: { where: { status: true } },
          },
        };
      }

      const itemCategories: any = await this.prisma.itemCategory.findMany(
        searchObject,
      );

      if (itemCategories) {
        itemCategories.forEach((ic, i) => {
          if (ic.ItemCategoryRelation) {
            const relationArr = ic.ItemCategoryRelation;
            const items = [];
            relationArr.forEach((rel) => {
              items.push(rel.item);
            });
            ic.Item = items;
          }
          if (ic.parent) {
            ic.parentCategory = ic.parent;
          }
        });
      }

      return { itemCategories, total: totalCount };
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
          where: { status: true },
          include: {
            item: { where: { status: true } },
          },
        },
        parent: { where: { status: true } },
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

    if (itemCategory.parent) {
      itemCategory.parentCategory = itemCategory.parent;
    }
    return itemCategory;
  }

  async create(createItemCategoryInput: CreateItemCategoryInput) {
    try {
      let data: any = {
        name: createItemCategoryInput.name || null,
      };

      if (createItemCategoryInput?.parentCategoryId) {
        data = {
          ...data,
          parent: {
            connect: {
              id: createItemCategoryInput?.parentCategoryId,
            },
          },
        };
      }

      const itemCategory = await this.prisma.itemCategory.create({
        data,
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
    try {
      const deleted = await this.prisma.itemCategory.update({
        where: {
          id,
        },
        data: { status: false },
        include: {
          ItemCategoryRelation: { where: { status: true } },
        },
      });

      if (!deleted) {
        throw new Error(
          'Could not delete the Item Category. Please try after sometime!',
        );
      }

      if (deleted) {
        await this.prisma.itemCategoryRelation.updateMany({
          where: {
            itemCategoryId: id,
          },
          data: { status: false },
        });
      }

      return deleted;
    } catch (error) {
      throw new Error(error);
    }
  }
}
