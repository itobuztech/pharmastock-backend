import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
} from '@nestjs/graphql';
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
import { PaginationArgs } from '../pagination/pagination.dto';
import { TotalCount } from '../pagination/toalCount.entity';
import { PermissionsGuardOR } from '../auth/guards/permissions-or.guard';
import { PrivilegesList } from '../privileges/user-privileges';
import { Permissions } from '../auth/decorators/permissions.decorator';

// Define a new type for the paginated result
@ObjectType()
class PaginatedItemCategories extends TotalCount {
  @Field(() => [ItemCategory])
  itemCategories: ItemCategory[];
}

@Resolver(() => ItemCategory)
export class ItemCategoryResolver {
  constructor(private readonly itemCategoryService: ItemCategoryService) {}

  @Query(() => PaginatedItemCategories, {
    name: 'itemCategories',
    nullable: true,
  })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.ITEM_CATEGORIES_MANAGEMENT.CAPABILITIES.VIEW])
  async findAll(
    @Args('searchText', { nullable: true }) searchText: string,
    @Args('pagination', { nullable: true }) pagination: Boolean,
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
  ): Promise<PaginatedItemCategories> {
    try {
      return await this.itemCategoryService.findAll(
        searchText,
        pagination,
        paginationArgs,
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Query(() => ItemCategory, { name: 'itemCategory' })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.ITEM_CATEGORIES_MANAGEMENT.CAPABILITIES.VIEW])
  async findOne(@Args('id') id: string): Promise<ItemCategory> {
    try {
      return await this.itemCategoryService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => ItemCategory)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  async createItemCategory(
    @Args('createItemCategoryInput')
    createItemCategoryInput: CreateItemCategoryInput,
  ): Promise<ItemCategory> {
    try {
      return await this.itemCategoryService.create(createItemCategoryInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => ItemCategory)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  async updateItemCategory(
    @Args('updateItemCategoryInput')
    updateItemCategoryInput: UpdateItemCategoryInput,
  ): Promise<ItemCategory> {
    try {
      const { id, ...data } = updateItemCategoryInput;
      return await this.itemCategoryService.updateItemCategory(id, data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => ItemCategory)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  async deleteItemCategory(
    @Args('deleteItemCategoryInput')
    deleteItemCategoryInput: DeleteItemCategoryInput,
  ) {
    try {
      const { id } = deleteItemCategoryInput;
      return await this.itemCategoryService.deleteItemCategory(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
