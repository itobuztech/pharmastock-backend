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
        for (const input of createWarehouseStockInput) {
          const warehouseId = input.warehouseId;

          const organizationByWarehouse = await this.prisma.warehouse.findFirst(
            {
              select: { organizationId: true },
              where: {
                id: warehouseId,
                status: true,
              },
            },
          );

          if (!organizationByWarehouse) {
            throw new BadRequestException('Warehouse organization not found');
          }

          if (organizationId === '') {
            organizationId = organizationByWarehouse.organizationId;
          } else if (
            organizationId !== '' &&
            organizationId !== organizationByWarehouse.organizationId
          ) {
            throw new BadRequestException(
              'Warehouses do not belong to the same organisation!',
            );
          }
        }
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
          throw new BadRequestException(
            'Pharmacy and Warehouse organization is not same/found!',
          );
        }

        organizationId = organizationByPharmacy.id;
      } else if (clearancePharmacyStockInput) {
        for (const input of createPharmacyStockInput) {
          const pharmacyId = input.pharmacyId;

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

          if (organizationId === '') {
            organizationId = organizationByClearance.id;
          } else if (
            organizationId !== '' &&
            organizationId !== organizationByClearance.id
          ) {
            throw new BadRequestException(
              'Pharmacies do not belong to the same organisation!',
            );
          }
        }
      } else {
        throw new BadRequestException('No valid input variables found');
      }

      // Check if the logged-in user's organization matches the found organization
      if (organizationId !== userOrgId) {
        throw new ForbiddenException(
          'Logged in user organization does not match a Warehouse/Pharmacy organization',
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
