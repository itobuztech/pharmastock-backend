import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
  Context,
} from '@nestjs/graphql';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Warehouse } from './entities/warehouse.entity';
import { UserRole } from '@prisma/client';
import { UpdateWarehouseInput } from './dto/update-warehouse.input';
import { DeleteWarehouseInput } from './dto/delete-warehouse.input';
import { PaginationArgs } from '../pagination/pagination.dto';
import { TotalCount } from '../pagination/toalCount.entity';
import { PermissionsGuardOR } from '../auth/guards/permissions-or.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PrivilegesList } from '../privileges/user-privileges';
import { OrganizationGuard } from 'src/auth/guards/organization.guard';

// Define a new type for the paginated result
@ObjectType()
class PaginatedWarehouses extends TotalCount {
  @Field(() => [Warehouse])
  warehouses: Warehouse[];
}

@Resolver(() => Warehouse)
export class WarehouseResolver {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Query(() => PaginatedWarehouses, { name: 'warehouses', nullable: true })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.WAREHOUSE_MANAGEMENT.CAPABILITIES.VIEW])
  async findAll(
    @Context() ctx: any,
    @Args('searchText', { nullable: true }) searchText: string,
    @Args('pagination', { nullable: true }) pagination: Boolean,
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
  ): Promise<PaginatedWarehouses> {
    try {
      return await this.warehouseService.findAll(
        ctx,
        searchText,
        pagination,
        paginationArgs,
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Query(() => Warehouse, { name: 'warehouse' })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR, OrganizationGuard)
  @Permissions([PrivilegesList.WAREHOUSE_MANAGEMENT.CAPABILITIES.VIEW])
  async findOne(@Args('id') id: string): Promise<Warehouse> {
    try {
      return await this.warehouseService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => Warehouse)
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.WAREHOUSE_MANAGEMENT.CAPABILITIES.CREATE])
  async createWarehouse(
    @Context() ctx: any,
    @Args('createWarehouseInput')
    createWarehouseInput: CreateWarehouseInput,
  ): Promise<Warehouse> {
    try {
      return await this.warehouseService.create(ctx, createWarehouseInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => Warehouse)
  @UseGuards(JwtAuthGuard, PermissionsGuardOR, OrganizationGuard)
  @Permissions([PrivilegesList.WAREHOUSE_MANAGEMENT.CAPABILITIES.EDIT])
  async updateWarehouse(
    @Args('updateWarehouseInput')
    updateWarehouseInput: UpdateWarehouseInput,
  ): Promise<Warehouse> {
    try {
      const { id, ...data } = updateWarehouseInput;
      return await this.warehouseService.updateWarehouse(id, data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => Warehouse)
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.WAREHOUSE_MANAGEMENT.CAPABILITIES.DELETE])
  async deleteWarehouse(
    @Args('deleteWarehouseInput')
    deleteWarehouseInput: DeleteWarehouseInput,
  ) {
    try {
      const { id } = deleteWarehouseInput;
      return await this.warehouseService.deleteWarehouse(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
