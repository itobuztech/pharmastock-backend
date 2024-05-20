import * as bcrypt from 'bcrypt';
import { PrismaClient, UserRole } from '@prisma/client'
import { PrivilegesList } from '../src/privileges/user-privileges';
const prisma = new PrismaClient();


async function main() {
    //CREATE UserRoles
    const roles = await prisma.role.createMany({
        data: [
            {
                name: 'Owner',
                description: 'Admin of the whole application',
                userType: UserRole.OWNER,
                privileges: [101, 102, 201, 202, 203, 204, 301, 302, 303, 304]
            },
            {
                name: 'Employer',
                description: 'Entity that employs individuals',
                userType: UserRole.EMPLOYER,
                privileges: [101, 102]
            },
            {
                name: 'User',
                description: 'Usertype of jobseekers',
                userType: UserRole.USER,
                privileges: [101, 102]
            },
        ],
        skipDuplicates: true,
    });

    const ownerRole = await prisma.role.findFirst({
        where: {
            userType: UserRole.OWNER
        }
    });

    const password = await bcrypt.hash('Itobuz#1234', 10);

    //Create OWNER user
    const owner = await prisma.user.create({
        data: {
            email: 'palash@itobuz.com',
            name: 'Admin Creator',
            password: password,
            roleId: ownerRole.id
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