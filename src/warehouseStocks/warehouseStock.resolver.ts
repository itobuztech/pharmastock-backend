import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
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

// Define a new type for the paginated result
@ObjectType()
class PaginatedWarehouseStocks extends TotalCount {
  @Field(() => [WarehouseStock])
  warehouseStocks: WarehouseStock[];
}

@Resolver(() => WarehouseStock)
export class WarehouseStockResolver {
  constructor(private readonly warehouseStockService: WarehouseStockService) {}

  @Query(() => PaginatedWarehouseStocks, {
    name: 'warehouseStocks',
    nullable: true,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
  ): Promise<PaginatedWarehouseStocks> {
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

  @Query(() => Sku, { name: 'sku' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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

  @Mutation(() => GenerateSku)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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
