import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { PharmacyService } from './pharmacy.service';
import { CreatePharmacyInput } from './dto/create-pharmacy.input';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Pharmacy } from './entities/pharmacy.entity';
import { UserRole } from '@prisma/client';
import { UpdatePharmacyInput } from './dto/update-pharmacy.input';
import { DeletePharmacyInput } from './dto/delete-pharmacy.input';
import { PaginationArgs } from 'src/pagination/pagination.dto';
import { TotalCount } from '../pagination/toalCount.entity';

// Define a new type for the paginated result
@ObjectType()
class PaginatedPharmacies extends TotalCount {
  @Field(() => [Pharmacy])
  pharmacies: Pharmacy[];
}

@Resolver(() => Pharmacy)
export class PharmacyResolver {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Query(() => PaginatedPharmacies, {
    name: 'pharmacies',
    nullable: true,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
  ): Promise<PaginatedPharmacies> {
    try {
      return await this.pharmacyService.findAll(paginationArgs);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Query(() => Pharmacy, { name: 'pharmacy' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Args('id') id: string): Promise<Pharmacy> {
    try {
      return await this.pharmacyService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => Pharmacy)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createPharmacy(
    @Args('createPharmacyInput')
    createPharmacyInput: CreatePharmacyInput,
  ): Promise<Pharmacy> {
    try {
      return await this.pharmacyService.create(createPharmacyInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => Pharmacy)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updatePharmacy(
    @Args('updatePharmacyInput')
    updatePharmacyInput: UpdatePharmacyInput,
  ): Promise<Pharmacy> {
    try {
      const { id, ...data } = updatePharmacyInput;
      return await this.pharmacyService.updatePharmacy(id, data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => Pharmacy)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deletePharmacy(
    @Args('deletePharmacyInput')
    deletePharmacyInput: DeletePharmacyInput,
  ) {
    try {
      const { id } = deletePharmacyInput;
      return await this.pharmacyService.deletePharmacy(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
