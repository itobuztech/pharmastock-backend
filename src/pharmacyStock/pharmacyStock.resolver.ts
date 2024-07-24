import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
  ): Promise<PaginatedPharmacyStocks> {
    try {
      return await this.PharmacyStockService.findAll(paginationArgs);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Query(() => PaginatedPharmacyStocks, {
    name: 'pharmacyStocksByPharmacy',
    nullable: true,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Args('id') id: string): Promise<PharmacyStock> {
    try {
      return await this.PharmacyStockService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => PharmacyStock)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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

  @Mutation(() => PharmacyStock)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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
