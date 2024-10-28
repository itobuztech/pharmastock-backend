import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { StockMovementService } from './stockMovement.service';
import { CreateStockMovementInput } from './dto/create-stockMovement.input';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StockMovement } from './entities/stockMovement.entity';
import { PaginationArgs } from '../pagination/pagination.dto';
import { PermissionsGuardOR } from '../auth/guards/permissions-or.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PrivilegesList } from '../privileges/user-privileges';
import { TotalCount } from 'src/pagination/toalCount.entity';
import { FilterStockMovementsInputs } from './dto/filter-stockMovements.input';
import { BatchStockMovementsInput } from './dto/batch-stockMovements.input';
import { StockMovementsByBatch } from './entities/stockMovementByBatch.entity';
import { LotStockMovementsInput } from './dto/lot-stockMovements.input';
import { StockMovementsByLotName } from './entities/stockMovementByLotName.entity';
import { StockMovementsByLot } from './entities/stockMovementByLot.entity';

// Define a new type for the paginated result
@ObjectType()
class PaginatedStockMovements extends TotalCount {
  @Field(() => [StockMovement])
  stockMovements: StockMovement[];
}

@ObjectType()
class PaginatedStockMovementsLot extends TotalCount {
  @Field(() => [StockMovementsByLot])
  stockMovementsLot: StockMovementsByLot[];
}

@ObjectType()
class PaginatedStockMovementsByBatch extends TotalCount {
  @Field(() => [StockMovementsByBatch])
  stockMovementsByBatch: StockMovementsByBatch[];
}

@ObjectType()
class PaginatedStockMovementsByLotName extends TotalCount {
  @Field(() => [StockMovementsByLotName])
  stockMovementsByLotName: StockMovementsByLotName[];
}

@Resolver(() => StockMovement)
export class StockMovementResolver {
  constructor(private readonly stockMovementService: StockMovementService) {}

  @Query(() => PaginatedStockMovements, {
    name: 'stockMovements',
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
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
    @Args('filterArgs', { nullable: true })
    filterArgs: FilterStockMovementsInputs,
  ): Promise<PaginatedStockMovements> {
    try {
      const user = ctx.req.user;

      return await this.stockMovementService.findAll(
        user,
        searchText,
        paginationArgs,
        filterArgs,
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Query(() => PaginatedStockMovementsLot, {
    name: 'stockMovementsLot',
    nullable: true,
  })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([
    PrivilegesList.STOCK_MANAGEMENT_ADMIN.CAPABILITIES.VIEW,
    PrivilegesList.STOCK_MANAGEMENT_STAFF.CAPABILITIES.VIEW,
  ])
  async findAllLot(
    @Context() ctx: any,
    @Args('searchText', { nullable: true }) searchText: string,
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
    @Args('filterArgs', { nullable: true })
    filterArgs: FilterStockMovementsInputs,
  ): Promise<PaginatedStockMovementsLot> {
    try {
      const user = ctx.req.user;

      return await this.stockMovementService.findAllLot(
        user,
        searchText,
        paginationArgs,
        filterArgs,
      );
    } catch (e) {
      throw e;
    }
  }

  @Query(() => PaginatedStockMovementsByBatch, {
    name: 'stockMovementsByBatch',
    nullable: true,
  })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([
    PrivilegesList.STOCK_MANAGEMENT_ADMIN.CAPABILITIES.VIEW,
    PrivilegesList.STOCK_MANAGEMENT_STAFF.CAPABILITIES.VIEW,
  ])
  async findAllByBatch(
    @Context() ctx: any,
    @Args('batchStockMovementsInput')
    batchStockMovementsInput: BatchStockMovementsInput,
    @Args('searchText', { nullable: true }) searchText: string,
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
    @Args('filterArgs', { nullable: true })
    filterArgs: FilterStockMovementsInputs,
  ): Promise<PaginatedStockMovementsByBatch> {
    try {
      const user = ctx.req.user;

      return await this.stockMovementService.findAllByBatch(
        batchStockMovementsInput,
        user,
        searchText,
        paginationArgs,
        filterArgs,
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Query(() => PaginatedStockMovementsByBatch, {
    name: 'stockMovementsByLot',
    nullable: true,
  })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([
    PrivilegesList.STOCK_MANAGEMENT_ADMIN.CAPABILITIES.VIEW,
    PrivilegesList.STOCK_MANAGEMENT_STAFF.CAPABILITIES.VIEW,
  ])
  async findAllByLot(
    @Context() ctx: any,
    @Args('batchStockMovementsInput')
    batchStockMovementsInput: BatchStockMovementsInput,
    @Args('searchText', { nullable: true }) searchText: string,
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
    @Args('filterArgs', { nullable: true })
    filterArgs: FilterStockMovementsInputs,
  ): Promise<PaginatedStockMovementsByBatch> {
    try {
      const user = ctx.req.user;

      return await this.stockMovementService.findAllByBatch(
        batchStockMovementsInput,
        user,
        searchText,
        paginationArgs,
        filterArgs,
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
  @Query(() => PaginatedStockMovementsByLotName, {
    name: 'stockMovementsByLotName',
    nullable: true,
  })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([
    PrivilegesList.STOCK_MANAGEMENT_ADMIN.CAPABILITIES.VIEW,
    PrivilegesList.STOCK_MANAGEMENT_STAFF.CAPABILITIES.VIEW,
  ])
  async findAllByLotName(
    @Context() ctx: any,
    @Args('lotStockMovementsInput')
    lotStockMovementsInput: LotStockMovementsInput,
    @Args('searchText', { nullable: true }) searchText: string,
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
  ): Promise<PaginatedStockMovementsByLotName> {
    try {
      const user = ctx.req.user;

      return await this.stockMovementService.findAllByLotName(
        lotStockMovementsInput,
        user,
        searchText,
        paginationArgs,
      );
    } catch (e) {
      throw e;
    }
  }

  @Mutation(() => StockMovement)
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([
    PrivilegesList.STOCK_MANAGEMENT_ADMIN.CAPABILITIES.CREATE,
    PrivilegesList.STOCK_MANAGEMENT_STAFF.CAPABILITIES.CREATE,
  ])
  async createStockMovement(
    @Args('createStockMovementInput')
    createStockMovementInput: CreateStockMovementInput,
  ) {
    try {
      return await this.stockMovementService.create(createStockMovementInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
