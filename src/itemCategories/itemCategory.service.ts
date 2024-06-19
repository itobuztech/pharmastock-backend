import { Injectable, Logger } from '@nestjs/common';
import { CreateItemCategoryInput } from './dto/create-itemCategory.input';
import { PrismaService } from '../prisma/prisma.service';
import { ItemCategory } from '@prisma/client';

@Injectable()
export class ItemCategoryService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {}

  async findAll(): Promise<ItemCategory[]> {
    try {
      const itemCategory = await this.prisma.itemCategory.findMany({});

      return itemCategory;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<ItemCategory> {
    const itemCategory = await this.prisma.itemCategory.findFirst({
      where: {
        id,
      },
    });

    if (!itemCategory) {
      throw new Error('No Item Category found!');
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
