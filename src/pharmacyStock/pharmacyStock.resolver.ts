import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PharmacyStockService } from './pharmacyStock.service';
import { CreatePharmacyStockInput } from './dto/create-pharmacyStock.input';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PharmacyStock } from './entities/pharmacyStock.entity';
import { UserRole } from '@prisma/client';
import { UpdatePharmacyStockInput } from './dto/update-pharmacyStock.input';
import { DeletePharmacyStockInput } from './dto/delete-pharmacyStock.input';
import { PaginationArgs } from 'src/pagination/pagination.dto';

@Resolver(() => PharmacyStock)
export class PharmacyStockResolver {
  constructor(private readonly PharmacyStockService: PharmacyStockService) {}

  @Query(() => [PharmacyStock], { name: 'PharmacyStocks', nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
  ): Promise<PharmacyStock[]> {
    try {
      return await this.PharmacyStockService.findAll(paginationArgs);
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
  async updatePharmacyStock(
    @Args('updatePharmacyStockInput')
    updatePharmacyStockInput: UpdatePharmacyStockInput,
  ): Promise<PharmacyStock> {
    try {
      const { id, ...data } = updatePharmacyStockInput;
      return await this.PharmacyStockService.updatePharmacyStock(id, data);
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
