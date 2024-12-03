import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
} from '@nestjs/graphql';
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
import { PaginationArgs } from '../pagination/pagination.dto';
import { TotalCount } from '../pagination/toalCount.entity';
import { PermissionsGuardOR } from '../auth/guards/permissions-or.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PrivilegesList } from '../privileges/user-privileges';

// Define a new type for the paginated result
@ObjectType()
class PaginatedOrganizations extends TotalCount {
  @Field(() => [Organization])
  organizations: Organization[];
}

@Resolver(() => Organization)
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @Query(() => PaginatedOrganizations, {
    name: 'organizations',
    nullable: true,
  })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.ORGANIZATION_MANAGEMENT.CAPABILITIES.VIEW])
  async findAll(
    @Args('searchText', { nullable: true }) searchText: string,
    @Args('pagination', { nullable: true }) pagination: Boolean,
    @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
  ): Promise<PaginatedOrganizations> {
    try {
      return await this.organizationService.findAll(
        searchText,
        pagination,
        paginationArgs,
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Query(() => Organization, { name: 'organizationByName' })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.ORGANIZATION_MANAGEMENT.CAPABILITIES.VIEW])
  async findOne(@Args('name') name: string): Promise<Organization> {
    try {
      return await this.organizationService.findOne(name);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Query(() => Organization, { name: 'organization' })
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.ORGANIZATION_MANAGEMENT.CAPABILITIES.VIEW])
  async findOneById(@Args('id') id: string): Promise<Organization> {
    try {
      return await this.organizationService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => Organization)
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.ORGANIZATION_MANAGEMENT.CAPABILITIES.CREATE])
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
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.ORGANIZATION_MANAGEMENT.CAPABILITIES.EDIT])
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
  @UseGuards(JwtAuthGuard, PermissionsGuardOR)
  @Permissions([PrivilegesList.ORGANIZATION_MANAGEMENT.CAPABILITIES.DELETE])
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
