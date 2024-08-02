import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
  Context,
} from '@nestjs/graphql';
import { PharmacyStockService } from './pharmacyStock.service';
import { CreatePharmacyStockInput } from './dto/create-pharmacyStock.input';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PharmacyStock } from './entities/pharmacyStock.entity';
import { UserRole } from '@prisma/client';
import { DeletePharmacyStockInput } from './dto/delete-pharmacyStock.input';
import { PaginationArgs } from '../pagination/pagination.dto';
import { TotalCount } from '../pagination/toalCount.entity';
import { FilterPharmacyStockInputs } from './dto/filter-pharmacyStock.input';
import { PermissionsGuardOR } from '../auth/guards/permissions-or.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PrivilegesList } from '../privileges/user-privileges';
import { ClearancePharmacyStockInput } from './dto/clearance-pharmacyStock.input';
import { ClearancePharmacyStock } from './entities/clearancePharmacyStock.entity';

// Define a new type for the paginated result
@ObjectType()
class PaginatedPharmacyStocks extends TotalCount {
  @Field(() => [PharmacyStock])
  pharmacyStocks: PharmacyStock[];
}

@Resolver(() => PharmacyStock)
export class PharmacyStockResolver {
  constructor(private readonly PharmacyStockService: PharmacyStockService) {}

  @Query(() => PaginatedPharmacyStocks, {
    name: 'PharmacyStocks',
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
    filterArgs: FilterPharmacyStockInputs,
  ): Promise<PaginatedPharmacyStocks> {
    try {
      return await this.PharmacyStockService.findAll(
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

  @Query(() => PaginatedPharmacyStocks, {
    name: 'pharmacyStocksByPharmacy',
    nullable: true,
  })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([
    PrivilegesList.STOCK_MANAGEMENT_ADMIN.CAPABILITIES.VIEW,
    PrivilegesList.STOCK_MANAGEMENT_STAFF.CAPABILITIES.VIEW,
  ])
  async findAllByPharmacyId(
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
    @Args('pharmacyId') pharmacyId: string,
  ): Promise<PaginatedPharmacyStocks> {
    try {
      return await this.PharmacyStockService.findAllByPharmacyId(
        pharmacyId,
        paginationArgs,
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Query(() => PharmacyStock, { name: 'PharmacyStock' })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([
    PrivilegesList.STOCK_MANAGEMENT_ADMIN.CAPABILITIES.VIEW,
    PrivilegesList.STOCK_MANAGEMENT_STAFF.CAPABILITIES.VIEW,
  ])
  async findOne(@Args('id') id: string): Promise<PharmacyStock> {
    try {
      return await this.PharmacyStockService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => PharmacyStock)
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([
    PrivilegesList.STOCK_MANAGEMENT_ADMIN.CAPABILITIES.CREATE,
    PrivilegesList.STOCK_MANAGEMENT_STAFF.CAPABILITIES.CREATE,
  ])
  async createPharmacyStock(
    @Args('createPharmacyStockInput')
    createPharmacyStockInput: CreatePharmacyStockInput,
  ): Promise<PharmacyStock> {
    try {
      return await this.PharmacyStockService.create(createPharmacyStockInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => [ClearancePharmacyStock])
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.STOCK_MANAGEMENT_STAFF.CAPABILITIES.CREATE])
  async clearancePharmacyStock(
    @Args('clearancePharmacyStockInput', {
      type: () => [ClearancePharmacyStockInput],
    })
    clearancePharmacyStockInput: ClearancePharmacyStockInput[],
  ): Promise<ClearancePharmacyStock[]> {
    try {
      return await this.PharmacyStockService.clearancePharmacyStock(
        clearancePharmacyStockInput,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => PharmacyStock)
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.STOCK_MANAGEMENT_ADMIN.CAPABILITIES.DELETE])
  async deletePharmacyStock(
    @Args('deletePharmacyStockInput')
    deletePharmacyStockInput: DeletePharmacyStockInput,
  ) {
    try {
      const { id } = deletePharmacyStockInput;
      return await this.PharmacyStockService.deletePharmacyStock(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
