import * as bcrypt from 'bcrypt';
import { PrismaClient, UserRole } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  //CREATE UserRoles
  await prisma.role.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.organization.deleteMany({});
  await prisma.itemCategory.deleteMany({});
  await prisma.warehouse.deleteMany({});
  console.clear();

  const roles = await prisma.role.createMany({
    data: [
      {
        name: 'Superadmin',
        description: 'Super admin of the whole application',
        userType: UserRole.SUPERADMIN,
        privileges: [
          101, 102, 111, 112, 113, 114, 121, 122, 123, 124, 141, 142, 143, 144,
          151, 161, 162, 163, 164, 171, 172, 173, 174, 181, 191, 201, 202, 203,
          204, 211,
        ],
      },
      {
        name: 'Admin',
        description: 'Admin made by super admin',
        userType: UserRole.ADMIN,
        privileges: [
          101, 102, 111, 151, 152, 153, 154, 161, 171, 181, 182, 183, 184, 191,
          192, 193, 194, 211,
        ],
      },
      {
        name: 'Staff',
        description: 'Staff made by admin',
        userType: UserRole.STAFF,
        privileges: [
          101, 102, 151, 171, 191, 201, 202, 203, 204, 211, 212, 213, 214,
        ],
      },
    ],
    skipDuplicates: true,
  });

  const superAdminRole = await prisma.role.findFirst({
    where: {
      userType: UserRole.SUPERADMIN,
    },
  });
  const adminRole = await prisma.role.findFirst({
    where: {
      userType: UserRole.ADMIN,
    },
  });
  const staffRole = await prisma.role.findFirst({
    where: {
      userType: UserRole.STAFF,
    },
  });

  if (!superAdminRole || !adminRole || !staffRole) {
    return;
  }

  const password = await bcrypt.hash('Itobuz#1234', 10); //Password is same Itobuz#1234 for all default users.

  const organization1 = await prisma.organization.create({
    data: {
      name: 'MediCare Supplies',
      description: 'A leading distributor of medical equipment and health supplies, specializing in hospitals and clinics.',
      active: true,
      address: 'S82, Heathrow Airport Cargo Area, Hounslow, London, TW6 2SB',
      city: 'Hounslow',
      country: 'UK',
      contact: '+919073458041',
    },
  });

  //Create users for the organization
  await prisma.user.createMany({
    data: [
      {
        email: 'admin@itobuz.com',
        name: 'John Doe',
        password: password,
        username: 'john',
        roleId: superAdminRole.id
      },
      {
        email: 'robert.brown@itobuz.com',
        name: 'Robert Brown',
        password: password,
        username: 'jane',
        roleId: adminRole.id,
        organizationId: organization1?.id
      },
      {
        email: 'mark.taylor@itobuz.com',
        name: 'Robert Brown',
        password: password,
        username: 'robbrown01',
        roleId: staffRole.id,
        organizationId: organization1?.id
      }
    ]
  });

  // Create Item Categories
  await prisma.itemCategory.createMany({
    data: [
      {
        name: 'Medical Equipment'
      },
      {
        name: 'Pharmaceuticals',
      },
      {
        name: 'Medical Consumables',
      },
      {
        name: 'Diagnostic Tools',
      },
      {
        name: 'Home Healthcare Products',
      },
      {
        name: 'Surgical Supplies',
      },
      {
        name: 'Hospital Furniture',
      },
      {
        name: 'Wound Care Products',
      },
      {
        name: 'Rehabilitation and Therapy Equipment',
      },
      {
        name: 'Incontinence Products',
      },
      {
        name: 'Medical Laboratory Supplies',
      },
      {
        name: 'Infection Control and Sterilization'
      }
    ]
  });

  const category1 = await prisma.itemCategory.findFirst({
    name: 'Surgical Supplies'
  });

  const category2 = await prisma.itemCategory.findFirst({
    name: 'Wound Care Products'
  });

  const category3 = await prisma.itemCategory.findFirst({
    name: 'Diagnostic Tools'
  });

  // Create warehouses
  await prisma.warehouse.createMany({
    data: [
      {
        name: 'Oldham Warehouse #1',
        location: 'Oldham',
        area: '929 square meters',
        organizationId: organization1.id
      },
      {
        name: 'Bolton',
        location: 'Industrial base of UK',
        area: '~1200 square meters',
        organizationId: organization1.id
      },
    ]
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
