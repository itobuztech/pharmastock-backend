import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
  Context,
} from '@nestjs/graphql';
import { ItemService } from './item.service';
import { CreateItemInput } from './dto/create-item.input';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Item } from './entities/item.entity';
import { UpdateItemInput } from './dto/update-item.input';
import { DeleteItemInput } from './dto/delete-item.input';
import { PaginationArgs } from '../pagination/pagination.dto';
import { TotalCount } from '../pagination/toalCount.entity';
import { FilterItemInputs } from './dto/filter-item.input';
import { PermissionsGuardOR } from '../auth/guards/permissions-or.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PrivilegesList } from '../privileges/user-privileges';
import { MaxPrice } from './entities/maxPrice.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { PharmacyStockItem } from './entities/pharmacyStockItem.entity';

// Define a new type for the paginated result
@ObjectType()
class PaginatedItems extends TotalCount {
  @Field(() => [Item])
  items: Item[];
}
@ObjectType()
class PaginatedPharmacyStockItem extends TotalCount {
  @Field(() => [PharmacyStockItem])
  items: PharmacyStockItem[];
}

@Resolver(() => Item)
export class ItemResolver {
  constructor(private readonly itemService: ItemService) {}

  @Query(() => PaginatedItems, {
    name: 'items',
    nullable: true,
  })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.ITEM_MANAGEMENT.CAPABILITIES.VIEW])
  async findAll(
    @Args('searchText', { nullable: true }) searchText: string,
    @Args('pagination', { nullable: true }) pagination: Boolean,
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
    @Args('filterArgs', { nullable: true }) filterArgs: FilterItemInputs,
  ): Promise<PaginatedItems> {
    try {
      return await this.itemService.findAll(
        searchText,
        pagination,
        paginationArgs,
        filterArgs,
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Query(() => Item, { name: 'item' })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.ITEM_MANAGEMENT.CAPABILITIES.VIEW])
  async findOne(@Args('id') id: string): Promise<Item> {
    try {
      return await this.itemService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Query(() => MaxPrice, { name: 'maxPrice' })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.ITEM_MANAGEMENT.CAPABILITIES.VIEW])
  async maxPrice(): Promise<MaxPrice> {
    try {
      return await this.itemService.maxPrice();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => Item)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuardOR)
  @Roles(UserRole.SUPERADMIN)
  @Permissions([PrivilegesList.ITEM_MANAGEMENT.CAPABILITIES.CREATE])
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
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuardOR)
  @Roles(UserRole.SUPERADMIN)
  @Permissions([PrivilegesList.ITEM_MANAGEMENT.CAPABILITIES.EDIT])
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
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuardOR)
  @Roles(UserRole.SUPERADMIN)
  @Permissions([PrivilegesList.ITEM_MANAGEMENT.CAPABILITIES.DELETE])
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

  @Query(() => PaginatedPharmacyStockItem)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuardOR)
  @Roles(UserRole.STAFF)
  @Permissions([PrivilegesList.ITEM_MANAGEMENT.CAPABILITIES.VIEW])
  async pharmacyStocksItems(
    @Context() ctx: any,
    @Args('searchText', { nullable: true }) searchText: string,
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
  ): Promise<PaginatedPharmacyStockItem> {
    try {
      return await this.itemService.pharmacyStocksItemsService(
        ctx,
        searchText,
        paginationArgs,
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
