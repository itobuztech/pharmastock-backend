import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ItemCategoryService } from './itemCategory.service';
import { CreateItemCategoryInput } from './dto/create-itemCategory.input';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ItemCategory } from './entities/itemCategory.entity';
import { UserRole } from '@prisma/client';
import { UpdateItemCategoryInput } from './dto/update-itemCategory.input';
import { DeleteItemCategoryInput } from './dto/delete-itemCategory.input';
import { PaginationArgs } from 'src/pagination/pagination.dto';

@Resolver(() => ItemCategory)
export class ItemCategoryResolver {
  constructor(private readonly itemService: ItemCategoryService) {}

  @Query(() => [ItemCategory], { name: 'itemCategories', nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
  ): Promise<ItemCategory[]> {
    try {
      return await this.itemService.findAll(paginationArgs);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Query(() => ItemCategory, { name: 'itemCategory' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Args('id') id: string): Promise<ItemCategory> {
    try {
      return await this.itemService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => ItemCategory)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createItemCategory(
    @Args('createItemCategoryInput')
    createItemCategoryInput: CreateItemCategoryInput,
  ): Promise<ItemCategory> {
    try {
      return await this.itemService.create(createItemCategoryInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => ItemCategory)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateItemCategory(
    @Args('updateItemCategoryInput')
    updateItemCategoryInput: UpdateItemCategoryInput,
  ): Promise<ItemCategory> {
    try {
      const { id, ...data } = updateItemCategoryInput;
      return await this.itemService.updateItemCategory(id, data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => ItemCategory)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteItemCategory(
    @Args('deleteItemCategoryInput')
    deleteItemCategoryInput: DeleteItemCategoryInput,
  ) {
    try {
      const { id } = deleteItemCategoryInput;
      return await this.itemService.deleteItemCategory(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
