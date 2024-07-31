import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
  Context,
} from '@nestjs/graphql';
import { WarehouseStockService } from './warehouseStock.service';
import { CreateWarehouseStockInput } from './dto/create-warehouseStock.input';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { WarehouseStock } from './entities/warehouseStock.entity';
import { UserRole } from '@prisma/client';
import { DeleteWarehouseStockInput } from './dto/delete-warehouseStock.input';
import { PaginationArgs } from '../pagination/pagination.dto';
import { TotalCount } from '../pagination/toalCount.entity';
import { CreateSkuNameInput } from './dto/create-skuName.input';
import { GenerateSku } from './entities/generate-sku.entity';
import { Sku } from './entities/sku.entity';
import { FilterWarehouseStockInputs } from './dto/filter-warehouseStock.input';
import { PermissionsGuardOR } from 'src/auth/guards/permissions-or.guard';
import { PrivilegesList } from 'src/privileges/user-privileges';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { AccountService } from '../account/account.service';

// Define a new type for the paginated result
@ObjectType()
class PaginatedWarehouseStocks extends TotalCount {
  @Field(() => [WarehouseStock])
  warehouseStocks: WarehouseStock[];
}

@Resolver(() => WarehouseStock)
export class WarehouseStockResolver {
  constructor(
    private readonly warehouseStockService: WarehouseStockService,
    private readonly accountService: AccountService,
  ) {}

  @Query(() => PaginatedWarehouseStocks, {
    name: 'warehouseStocks',
    nullable: true,
  })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([
    PrivilegesList.STOCK_MANAGEMENT_ADMIN.CAPABILITIES.VIEW,
    PrivilegesList.STOCK_MANAGEMENT_STAFF.CAPABILITIES.VIEW,
  ])
  async findAll(
    @Context() ctx: any,
    @Args('searchText', { nullable: true }) searchText: string,
    @Args('pagination', { nullable: true }) pagination: Boolean,
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
    @Args('filterArgs', { nullable: true })
    filterArgs: FilterWarehouseStockInputs,
  ): Promise<PaginatedWarehouseStocks> {
    try {
      return await this.warehouseStockService.findAll(
        ctx,
        searchText,
        pagination,
        paginationArgs,
        filterArgs,
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Query(() => PaginatedWarehouseStocks, {
    name: 'warehouseStocksByWarehouse',
    nullable: true,
  })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([
    PrivilegesList.STOCK_MANAGEMENT_ADMIN.CAPABILITIES.VIEW,
    PrivilegesList.STOCK_MANAGEMENT_STAFF.CAPABILITIES.VIEW,
  ])
  async findAllByWarehouseId(
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
    @Args('warehouseId') warehouseId: string,
  ): Promise<PaginatedWarehouseStocks> {
    try {
      return await this.warehouseStockService.findAllByWarehouseId(
        warehouseId,
        paginationArgs,
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Query(() => WarehouseStock, { name: 'warehouseStock' })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([
    PrivilegesList.STOCK_MANAGEMENT_ADMIN.CAPABILITIES.VIEW,
    PrivilegesList.STOCK_MANAGEMENT_STAFF.CAPABILITIES.VIEW,
  ])
  async findOne(@Args('id') id: string): Promise<WarehouseStock> {
    try {
      return await this.warehouseStockService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Query(() => Sku, { name: 'sku' })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([
    PrivilegesList.STOCK_MANAGEMENT_ADMIN.CAPABILITIES.VIEW,
    PrivilegesList.STOCK_MANAGEMENT_STAFF.CAPABILITIES.VIEW,
  ])
  async getSkuByOrgWarhItem(
    @Args('itemId') itemId: string,
    @Args('warehouseId') warehouseId: string,
    @Args('organizationId') organizationId: string,
  ): Promise<Sku> {
    try {
      return await this.warehouseStockService.getSkuByOrgWarhItem(
        itemId,
        warehouseId,
        organizationId,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => WarehouseStock)
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.STOCK_MANAGEMENT_ADMIN.CAPABILITIES.CREATE])
  async createWarehouseStock(
    @Args('createWarehouseStockInput')
    createWarehouseStockInput: CreateWarehouseStockInput,
  ): Promise<WarehouseStock> {
    try {
      return await this.warehouseStockService.create(createWarehouseStockInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => GenerateSku)
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.STOCK_MANAGEMENT_ADMIN.CAPABILITIES.EDIT])
  async generateSKU(
    @Args('generateSkuNameInput')
    createSkuNameInput: CreateSkuNameInput,
  ): Promise<{ sku: string }> {
    try {
      return await this.warehouseStockService.generateSKU(createSkuNameInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => WarehouseStock)
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.STOCK_MANAGEMENT_ADMIN.CAPABILITIES.DELETE])
  async deleteWarehouseStock(
    @Args('deleteWarehouseStockInput')
    deleteWarehouseStockInput: DeleteWarehouseStockInput,
  ) {
    try {
      const { id } = deleteWarehouseStockInput;
      return await this.warehouseStockService.deleteWarehouseStock(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
