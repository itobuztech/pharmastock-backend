import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const ctx = GqlExecutionContext.create(context);
      const user = ctx.getContext().req.user;

      // Fetch the user's organization
      const userOrg = await this.prisma.organization.findFirst({
        select: { id: true },
        where: {
          User: {
            some: {
              id: user.userId,
            },
          },
        },
      });

      if (!userOrg) {
        throw new ForbiddenException(
          'User is not associated with any organization',
        );
      }

      const userOrgId = userOrg.id;

      const {
        createWarehouseStockInput,
        createPharmacyStockInput,
        clearancePharmacyStockInput,
      } = ctx.getContext().req.body.variables;

      let organizationId = '';

      if (createWarehouseStockInput) {
        const warehouseId = createWarehouseStockInput.warehouseId;

        const organizationByWarehouse =
          await this.prisma.organization.findFirst({
            select: { id: true },
            where: {
              Warehouse: {
                some: { id: warehouseId },
              },
            },
          });

        if (!organizationByWarehouse) {
          throw new BadRequestException('Warehouse organization not found');
        }

        organizationId = organizationByWarehouse.id;
      } else if (createPharmacyStockInput) {
        const { warehouseId, pharmacyId } = createPharmacyStockInput;

        const organizationByPharmacy = await this.prisma.organization.findFirst(
          {
            select: { id: true },
            where: {
              Warehouse: { some: { id: warehouseId } },
              Pharmacy: { some: { id: pharmacyId } },
            },
          },
        );

        if (!organizationByPharmacy) {
          throw new BadRequestException('Pharmacy organization not found');
        }

        organizationId = organizationByPharmacy.id;
      } else if (clearancePharmacyStockInput) {
        const pharmacyId = clearancePharmacyStockInput.pharmacyId;

        const organizationByClearance =
          await this.prisma.organization.findFirst({
            select: { id: true },
            where: {
              Pharmacy: { some: { id: pharmacyId } },
            },
          });

        if (!organizationByClearance) {
          throw new BadRequestException(
            'Clearance pharmacy organization not found',
          );
        }

        organizationId = organizationByClearance.id;
      } else {
        throw new BadRequestException('No valid input variables found');
      }

      // Check if the logged-in user's organization matches the found organization
      if (userOrgId !== organizationId) {
        throw new ForbiddenException(
          'Logged in user organization does not match the Warehouse/Pharmacy organization',
        );
      }

      return true;
    } catch (error) {
      // Log the error for debugging
      console.error('Error in OrganizationGuard:', error);

      // Re-throw the error for NestJS to handle it
      throw error;
    }
  }
}
