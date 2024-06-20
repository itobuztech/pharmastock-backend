import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { WarehouseStockService } from './warehouseStock.service';
import { CreateWarehouseStockInput } from './dto/create-warehouseStock.input';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { WarehouseStock } from './entities/warehouseStock.entity';
import { UserRole } from '@prisma/client';
import { UpdateWarehouseStockInput } from './dto/update-warehouseStock.input';
import { DeleteWarehouseStockInput } from './dto/delete-warehouseStock.input';
import { PaginationArgs } from 'src/pagination/pagination.dto';

@Resolver(() => WarehouseStock)
export class WarehouseStockResolver {
  constructor(private readonly warehouseStockService: WarehouseStockService) {}

  @Query(() => [WarehouseStock], { name: 'warehouseStocks', nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
  ): Promise<WarehouseStock[]> {
    try {
      return await this.warehouseStockService.findAll(paginationArgs);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Query(() => WarehouseStock, { name: 'warehouseStock' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Args('id') id: string): Promise<WarehouseStock> {
    try {
      return await this.warehouseStockService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => WarehouseStock)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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

  @Mutation(() => WarehouseStock)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateWarehouseStock(
    @Args('updateWarehouseStockInput')
    updateWarehouseStockInput: UpdateWarehouseStockInput,
  ): Promise<WarehouseStock> {
    try {
      const { id, ...data } = updateWarehouseStockInput;
      return await this.warehouseStockService.updateWarehouseStock(id, data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => WarehouseStock)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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
