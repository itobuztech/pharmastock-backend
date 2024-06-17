import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrganizationService } from './organization.service';
import { CreateOrganizationInput } from './dto/create-organization.input';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Organization } from './entities/organization.entity';
import { UserRole } from '@prisma/client';
import { UpdateOrganizationInput } from './dto/update-organization.input';
import { DeleteOrganizationInput } from './dto/delete-organization.input';
import { STATUS_CODES } from 'http';

@Resolver(() => Organization)
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @Query(() => [Organization], { name: 'organizations', nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<Organization[]> {
    try {
      return await this.organizationService.findAll();
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Query(() => Organization, { name: 'organizationByName' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Args('name') name: string): Promise<Organization> {
    try {
      return await this.organizationService.findOne(name);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Query(() => Organization, { name: 'organization' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOneById(@Args('id') id: string): Promise<Organization> {
    try {
      return await this.organizationService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => Organization)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createOrganization(
    @Args('createOrganizationInput')
    createOrganizationInput: CreateOrganizationInput,
  ): Promise<Organization> {
    try {
      return await this.organizationService.create(createOrganizationInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => Organization)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateOrganization(
    @Args('updateOrganizationInput')
    updateOrganizationInput: UpdateOrganizationInput,
  ): Promise<Organization> {
    try {
      const { id, ...data } = updateOrganizationInput;
      return await this.organizationService.updateOrganization(id, data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => Organization)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteOrganization(
    @Args('deleteOrganizationInput')
    deleteOrganizationInput: DeleteOrganizationInput,
  ) {
    try {
      const { id } = deleteOrganizationInput;
      return await this.organizationService.deleteOrganization(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
