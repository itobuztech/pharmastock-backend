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

// Define a new type for the paginated result
@ObjectType()
class PaginatedStockMovements extends TotalCount {
  @Field(() => [StockMovement])
  stockMovements: StockMovement[];
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

  @Mutation(() => StockMovement)
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([
    PrivilegesList.STOCK_MANAGEMENT_ADMIN.CAPABILITIES.CREATE,
    PrivilegesList.STOCK_MANAGEMENT_STAFF.CAPABILITIES.CREATE,
  ])
  async createStockMovement(
    @Args('createStockMovementInput')
    createStockMovementInput: CreateStockMovementInput,
  ): Promise<StockMovement> {
    try {
      return await this.stockMovementService.create(createStockMovementInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
