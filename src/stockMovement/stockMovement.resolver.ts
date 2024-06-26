import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { StockMovementService } from './stockMovement.service';
import { CreateStockMovementInput } from './dto/create-stockMovement.input';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { StockMovement } from './entities/stockMovement.entity';
import { UserRole } from '@prisma/client';
import { DeleteStockMovementInput } from './dto/delete-stockMovement.input';
import { PaginationArgs } from 'src/pagination/pagination.dto';

@Resolver(() => StockMovement)
export class StockMovementResolver {
  constructor(private readonly stockMovementService: StockMovementService) {}

  @Query(() => [StockMovement], { name: 'stockMovements', nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
  ): Promise<StockMovement[]> {
    try {
      return await this.stockMovementService.findAll(paginationArgs);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Query(() => StockMovement, { name: 'stockMovement' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Args('id') id: string): Promise<StockMovement> {
    try {
      return await this.stockMovementService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => StockMovement)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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

  @Mutation(() => StockMovement)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteStockMovement(
    @Args('deleteStockMovementInput')
    deleteStockMovementInput: DeleteStockMovementInput,
  ) {
    try {
      const { id } = deleteStockMovementInput;
      return await this.stockMovementService.deleteStockMovement(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
