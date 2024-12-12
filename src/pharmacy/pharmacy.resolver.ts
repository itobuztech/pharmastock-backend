import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
  Context,
} from '@nestjs/graphql';
import { PharmacyService } from './pharmacy.service';
import { CreatePharmacyInput } from './dto/create-pharmacy.input';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  PaginatedPharmacies,
  pharmaciesByOrganization,
  Pharmacy,
} from './entities/pharmacy.entity';
import { UserRole } from '@prisma/client';
import { UpdatePharmacyInput } from './dto/update-pharmacy.input';
import { DeletePharmacyInput } from './dto/delete-pharmacy.input';
import { PaginationArgs } from '../pagination/pagination.dto';
import { PermissionsGuardOR } from '../auth/guards/permissions-or.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PrivilegesList } from '../privileges/user-privileges';
import { OrganizationGuard } from 'src/auth/guards/organization.guard';

@Resolver(() => Pharmacy)
export class PharmacyResolver {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Query(() => PaginatedPharmacies, {
    name: 'pharmacies',
    nullable: true,
  })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.PHARMACY_MANAGEMENT.CAPABILITIES.VIEW])
  async findAll(
    @Context() ctx: any,
    @Args('searchText', { nullable: true }) searchText: string,
    @Args('pagination', { nullable: true }) pagination: Boolean,
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
  ): Promise<PaginatedPharmacies> {
    try {
      return await this.pharmacyService.findAll(
        ctx,
        searchText,
        pagination,
        paginationArgs,
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Query(() => [pharmaciesByOrganization], {
    name: 'pharmaciesByOrganization',
    nullable: true,
  })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.PHARMACY_MANAGEMENT.CAPABILITIES.VIEW])
  async pharmaciesByOrganizationRes(
    @Context() ctx: any,
    @Args('organizationId') organizationId: string,
  ): Promise<pharmaciesByOrganization[]> {
    try {
      return await this.pharmacyService.pharmaciesByOrganizationSer(
        ctx,
        organizationId,
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Query(() => Pharmacy, { name: 'pharmacy' })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR, OrganizationGuard)
  @Permissions([PrivilegesList.PHARMACY_MANAGEMENT.CAPABILITIES.VIEW])
  async findOne(@Args('id') id: string): Promise<Pharmacy> {
    try {
      return await this.pharmacyService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => Pharmacy)
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.PHARMACY_MANAGEMENT.CAPABILITIES.CREATE])
  async createPharmacy(
    @Context() ctx: any,
    @Args('createPharmacyInput')
    createPharmacyInput: CreatePharmacyInput,
  ): Promise<Pharmacy> {
    try {
      return await this.pharmacyService.create(ctx, createPharmacyInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => Pharmacy)
  @UseGuards(JwtAuthGuard, PermissionsGuardOR, OrganizationGuard)
  @Permissions([PrivilegesList.PHARMACY_MANAGEMENT.CAPABILITIES.EDIT])
  async updatePharmacy(
    @Args('updatePharmacyInput')
    updatePharmacyInput: UpdatePharmacyInput,
  ): Promise<Pharmacy> {
    try {
      console.log('updatePharmacyInput=', updatePharmacyInput);
      const { id, ...data } = updatePharmacyInput;

      return await this.pharmacyService.updatePharmacy(id, data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => Pharmacy)
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.PHARMACY_MANAGEMENT.CAPABILITIES.DELETE])
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
