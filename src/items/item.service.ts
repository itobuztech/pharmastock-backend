import { Injectable, Logger } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { PrismaService } from '../prisma/prisma.service';
import { Item } from '@prisma/client';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {}

  async findAll(): Promise<Item[]> {
    try {
      const item = await this.prisma.item.findMany({});

      return item;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.prisma.item.findFirst({
      where: {
        id,
      },
    });

    if (!item) {
      throw new Error('No Item found!');
    }

    return item;
  }

  async create(createItemInput: CreateItemInput) {
    try {
      const item = await this.prisma.item.create({
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

      return item;
    } catch (error) {
      throw error;
    }
  }

  async updateItem(id: string, data) {
    const item = await this.prisma.item.update({
      where: {
        id,
      },
      data,
    });

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
}
