import * as bcrypt from 'bcrypt';
import { PrismaClient, UserRole } from '@prisma/client';
import { PrivilegesList } from '../src/privileges/user-privileges';
const prisma = new PrismaClient();

async function main() {
  //CREATE UserRoles
  const roles = await prisma.role.createMany({
    data: [
      {
        name: 'Superadmin',
        description: 'Super admin of the whole application',
        userType: UserRole.SUPERADMIN,
        privileges: [101, 102, 201, 202, 203, 204, 301, 302, 303, 304],
      },
      {
        name: 'Admin',
        description: 'Admin made by super admin',
        userType: UserRole.ADMIN,
        privileges: [101, 102],
      },
      {
        name: 'Staff',
        description: 'Staff made by admin',
        userType: UserRole.STAFF,
        privileges: [101, 102],
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

  if (!superAdminRole) {
    return;
  }
  if (!adminRole) {
    return;
  }

  const password = await bcrypt.hash('Itobuz#1234', 10);

  const organization = await prisma.organization.create({
    data: {
      name: 'dymmyOrganization',
      description: 'Dummy Org one',
      active: true,
      address: 'kolkata 567',
      city: 'Kolkata',
      country: 'India',
    },
  });

  //Create OWNER user
  await prisma.user.create({
    data: {
      email: 'palash@itobuz.com',
      name: 'Admin Creator',
      password: password,
      username: 'Palash',
      role: {
        connect: { id: superAdminRole.id },
      },
    },
  });
  await prisma.user.create({
    data: {
      email: 'sudeep@itobuz.com',
      name: 'Admin',
      password: password,
      username: 'Sudeep',
      role: {
        connect: { id: adminRole.id },
      },
      organization: {
        connect: { id: organization?.id },
      },
    },
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
