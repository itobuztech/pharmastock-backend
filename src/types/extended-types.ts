// Import necessary types from Prisma
import { Prisma } from '@prisma/client';

export interface WarehouseStockSearchObject {
  where: Prisma.WarehouseStockWhereInput;
  include: Prisma.WarehouseStockInclude;
  skip?: number;
  take?: number;
}

export interface UserSearchObject {
  where: Prisma.UserWhereInput;
  include: Prisma.UserInclude;
  skip?: number;
  take?: number;
}

export interface WarehouseSearchObject {
  where: Prisma.WarehouseWhereInput;
  include: Prisma.WarehouseInclude;
  skip?: number;
  take?: number;
}

export interface ItemCategorySearchObject {
  where: Prisma.ItemCategoryWhereInput;
  include: Prisma.ItemCategoryInclude;
  skip?: number;
  take?: number;
}

export interface ItemSearchObject {
  where: Prisma.ItemWhereInput;
  include: Prisma.ItemInclude;
  skip?: number;
  take?: number;
}

export interface OrganizationSearchObject {
  where: Prisma.OrganizationWhereInput;
  skip?: number;
  take?: number;
}

export interface PharmacySearchObject {
  where: Prisma.PharmacyWhereInput;
  include: Prisma.PharmacyInclude;
  skip?: number;
  take?: number;
}

export interface PharmacyStockSearchObject {
  where: Prisma.PharmacyStockWhereInput;
  include: Prisma.PharmacyStockInclude;
  skip?: number;
  take?: number;
}
