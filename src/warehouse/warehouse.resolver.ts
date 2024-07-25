import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(
    @Args('searchText', { nullable: true }) searchText: string,
    @Args('pagination', { nullable: true }) pagination: Boolean,
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
  ): Promise<PaginatedWarehouses> {
    try {
      return await this.warehouseService.findAll(
        searchText,
        pagination,
        paginationArgs,
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Query(() => Warehouse, { name: 'warehouse' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Args('id') id: string): Promise<Warehouse> {
    try {
      return await this.warehouseService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => Warehouse)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createWarehouse(
    @Args('createWarehouseInput')
    createWarehouseInput: CreateWarehouseInput,
  ): Promise<Warehouse> {
    try {
      return await this.warehouseService.create(createWarehouseInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => Warehouse)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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
