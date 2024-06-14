import * as bcrypt from 'bcrypt';
import { PrismaClient, UserRole } from '@prisma/client'
import { PrivilegesList } from '../src/privileges/user-privileges';
const prisma = new PrismaClient();

console.log("gg");


async function main() {
    //CREATE UserRoles
    const roles = await prisma.role.createMany({
        data: [
            {
                name: 'Superadmin',
                description: 'Super admin of the whole application',
                userType: UserRole.SUPERADMIN,
                privileges: [101, 102, 201, 202, 203, 204, 301, 302, 303, 304]
            },
            {
                name: 'Admin',
                description: 'Admin made by super admin',
                userType: UserRole.ADMIN,
                privileges: [101, 102]
            },
            {
                name: 'Staff',
                description: 'Staff made by admin',
                userType: UserRole.STAFF,
                privileges: [101, 102]
            },
        ],
        skipDuplicates: true,
    });

    const superAdminRole = await prisma.role.findFirst({
        where: {
            userType: UserRole.SUPERADMIN
        }
    });

    const password = await bcrypt.hash('Itobuz#1234', 10);

    //Create OWNER user
    const owner = await prisma.user.create({
        data: {
            email: 'palash@itobuz.com',
            name: 'Admin Creator',
            password: password,
            roleId: superAdminRole.id
        },
    });
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })