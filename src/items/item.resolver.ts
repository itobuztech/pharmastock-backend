import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ItemService } from './item.service';
import { CreateItemInput } from './dto/create-item.input';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Item } from './entities/item.entity';
import { ItemCategoryRelation } from './entities/item-category-relation.entity';
import { UserRole } from '@prisma/client';
import { UpdateItemInput } from './dto/update-item.input';
import { DeleteItemInput } from './dto/delete-item.input';
import { DeleteItemCategoryRelationInput } from './dto/delete-item-category-relation.input';
import { PaginationArgs } from 'src/pagination/pagination.dto';

@Resolver(() => Item)
export class ItemResolver {
  constructor(private readonly itemService: ItemService) {}

  @Query(() => [Item], { name: 'items', nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
  ): Promise<Item[]> {
    try {
      return await this.itemService.findAll(paginationArgs);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Query(() => Item, { name: 'item' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Args('id') id: string): Promise<Item> {
    try {
      return await this.itemService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => Item)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createItem(
    @Args('createItemInput')
    createItemInput: CreateItemInput,
  ): Promise<Item> {
    try {
      return await this.itemService.create(createItemInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => Item)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateItem(
    @Args('updateItemInput')
    updateItemInput: UpdateItemInput,
  ): Promise<Item> {
    try {
      const { id, ...data } = updateItemInput;
      return await this.itemService.updateItem(id, data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => Item)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteItem(
    @Args('deleteItemInput')
    deleteItemInput: DeleteItemInput,
  ) {
    try {
      const { id } = deleteItemInput;
      return await this.itemService.deleteItem(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => ItemCategoryRelation)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteItemCategoryRelation(
    @Args('deleteItemCategoryRelationInput')
    deleteItemCategoryRelationInput: DeleteItemCategoryRelationInput,
  ) {
    try {
      const { id } = deleteItemCategoryRelationInput;
      return await this.itemService.deleteItemCategoryRelation(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
