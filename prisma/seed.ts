import * as bcrypt from 'bcrypt';
import { NestFactory } from '@nestjs/core';
import { PrismaClient, UserRole } from '@prisma/client';

import { BaseUnit } from '../src/items/base-unit.enum';
import { StockMovementsType } from '../src/types/enums/stock-movements-type.enum';
import { AppModule } from '../src/app.module';
import { StockMovementService } from '../src/stockMovement/stockMovement.service';
console.log('stockMovementService=', StockMovementService);

console.log('gg');

import { generateLotName } from '../src/util/helper';

const prisma = new PrismaClient();

export async function resetDatabase() {
  await prisma.role.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.organization.deleteMany({});
  await prisma.itemCategory.deleteMany({});
  await prisma.item.deleteMany({});
  await prisma.itemCategoryRelation.deleteMany({});
  await prisma.warehouse.deleteMany({});
  await prisma.warehouseStock.deleteMany({});
  await prisma.pharmacy.deleteMany({});
  await prisma.pharmacyStock.deleteMany({});
  await prisma.pharmacyStockClearance.deleteMany({});
  await prisma.stockMovement.deleteMany({});
  await prisma.sKU.deleteMany({});
  console.clear();
}

export async function seedData() {
  // const app = await NestFactory.createApplicationContext(AppModule);
  // const stockMovementService = app.get(StockMovementService);

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

  const password = await bcrypt.hash('Itobuz#1234', 10);

  // Organizations Creation
  const organizationOne = await prisma.organization.create({
    data: {
      name: 'HealthFirst Supplies',
      description: 'A reliable supplier of premium healthcare products.',
      active: true,
      address: '20 Broadway Street',
      city: 'New York',
      country: 'USA',
      contact: '+11234567890',
    },
  });
  const organizationTwo = await prisma.organization.create({
    data: {
      name: 'Wellness Medical Distribution',
      description:
        'Focused on delivering top-quality medical supplies worldwide.',
      active: true,
      address: '88 King Street',
      city: 'Melbourne',
      country: 'Australia',
      contact: '+61345678910',
    },
  });
  const organizationThree = await prisma.organization.create({
    data: {
      name: 'Global MedTech Solutions',
      description:
        'Innovating the healthcare industry with cutting-edge technology.',
      active: true,
      address: '15 Park Avenue',
      city: 'Toronto',
      country: 'Canada',
      contact: '+14164567890',
    },
  });
  await prisma.organization.create({
    data: {
      name: 'LifeCare Equipment Co.',
      description: 'Your trusted partner in hospital and clinic equipment.',
      active: true,
      address: '4 Rue Saint-Honoré',
      city: 'Paris',
      country: 'France',
      contact: '+33123456789',
    },
  });
  await prisma.organization.create({
    data: {
      name: 'MediWorld Distributors',
      description: 'Global leaders in medical product distribution.',
      active: true,
      address: '50 Marina Bay Sands',
      city: 'Singapore',
      country: 'Singapore',
      contact: '+6581234567',
    },
  });

  // Warehouse Creation
  const warehouses = await prisma.warehouse.createManyAndReturn({
    data: [
      {
        name: 'Central Distribution Hub',
        location: 'New York City, NY',
        area: 'Downtown',
        organizationId: organizationOne?.id, // Replace with actual organization ID or leave null
        status: true,
      },
      {
        name: 'Northwest Storage Facility',
        location: 'Seattle, WA',
        area: 'Industrial Zone',
        organizationId: organizationOne?.id,
        status: true,
      },
      {
        name: 'Southern Supplies Depot',
        location: 'Austin, TX',
        area: 'South Congress',
        organizationId: organizationTwo?.id,
        status: true,
      },
      {
        name: 'West Coast Warehouse',
        location: 'San Francisco, CA',
        area: 'Bay Area',
        organizationId: organizationTwo?.id,
        status: true,
      },
      {
        name: 'Midwest Logistics Center',
        location: 'Chicago, IL',
        area: 'River North',
        organizationId: organizationThree?.id,
        status: true,
      },
      {
        name: 'European Fulfillment Center',
        location: 'Berlin, Germany',
        area: 'Friedrichshain',
        organizationId: organizationThree?.id,
        status: true,
      },
    ],
  });

  // Pharmacy Creation
  const pharmacyOneOrgOne = await prisma.pharmacy.create({
    data: {
      name: 'Central City Pharmacy',
      location: 'Downtown, New York City, NY',
      organizationId: organizationOne?.id, // Replace with actual organization ID or leave null
      contact_info: '+12125550101', // Ensure valid phone number format
      status: true,
    },
  });
  const pharmacyTwoOrgOne = await prisma.pharmacy.create({
    data: {
      name: 'HealthPlus Pharmacy',
      location: 'Industrial Zone, Seattle, WA',
      organizationId: organizationOne?.id, // Replace with actual organization ID or leave null
      contact_info: '+12065550402', // Ensure valid phone number format
      status: true,
    },
  });

  const pharmacyOneOrgTwo = await prisma.pharmacy.create({
    data: {
      name: 'CareFirst Pharmacy',
      location: 'Bay Area, San Francisco, CA',
      organizationId: organizationTwo?.id, // Replace with actual organization ID or leave null
      contact_info: '+14155550404', // Ensure valid phone number format
      status: true,
    },
  });
  const pharmacyTwoOrgTwo = await prisma.pharmacy.create({
    data: {
      name: 'Wellness Pharmacy',
      location: 'South Congress, Austin, TX',
      organizationId: organizationTwo?.id, // Replace with actual organization ID or leave null
      contact_info: '+15125550303', // Ensure valid phone number format
      status: true,
    },
  });

  const pharmacyOneOrgThree = await prisma.pharmacy.create({
    data: {
      name: 'MedTrust Pharmacy',
      location: 'River North, Chicago, IL',
      organizationId: organizationThree?.id, // Replace with actual organization ID or leave null
      contact_info: '+49305550606', // Ensure valid phone number format
      status: true,
    },
  });
  const pharmacyTwoOrgThree = await prisma.pharmacy.create({
    data: {
      name: 'EuroCare Pharmacy',
      location: 'Friedrichshain, Berlin, Germany',
      organizationId: organizationThree?.id, // Replace with actual organization ID or leave null
      contact_info: '+91225550707', // Ensure valid phone number format
      status: true,
    },
  });

  // Users Creation
  await prisma.user.createMany({
    data: [
      {
        email: 'sudeprAdmin@itobuz.com',
        name: 'John Doe',
        password: password,
        username: 'johnDoe',
        roleId: superAdminRole.id,
      },
      // Organization One Users
      {
        email: 'robertAdmin.healthfirst@itobuz.com',
        name: 'Robert Brown',
        password: password,
        username: 'robertBrown',
        roleId: adminRole.id,
        organizationId: organizationOne?.id,
        isEmailConfirmed: true,
      },
      {
        email: 'bruceAdmin.healthfirst@itobuz.com',
        name: 'Bruce Wayne',
        password: password, // Replace with hashed password
        username: 'bruceWayne',
        roleId: adminRole.id,
        organizationId: organizationOne?.id,
        isEmailConfirmed: true,
      },
      {
        email: 'aliceStaff.healthfirst@itobuz.com',
        name: 'Alice Johnson',
        password: password,
        username: 'aliceJohnson',
        roleId: staffRole.id,
        organizationId: organizationOne?.id,
        pharmacyId: pharmacyOneOrgOne.id,
        isEmailConfirmed: true,
      },
      {
        email: 'clarkStaff.healthfirst@itobuz.com',
        name: 'Clark Kent',
        password: password, // Replace with hashed password
        username: 'clarkKent',
        roleId: staffRole.id,
        organizationId: organizationOne?.id,
        pharmacyId: pharmacyTwoOrgOne.id,
        isEmailConfirmed: true,
      },
      // Organization Two Users
      {
        email: 'dianaAdmin.wellness@itobuz.com',
        name: 'Diana Prince',
        password: password,
        username: 'dianaPrince',
        roleId: adminRole.id,
        organizationId: organizationTwo?.id,
        isEmailConfirmed: true,
      },
      {
        email: 'bruceAdmin.wellness@itobuz.com',
        name: 'Bruce Wayne',
        password: password, // Replace with hashed password
        username: 'bruceManager',
        roleId: adminRole.id,
        organizationId: organizationTwo?.id,
        isEmailConfirmed: true,
      },
      {
        email: 'steveStaff.wellness@itobuz.com',
        name: 'Steve Rogers',
        password: password,
        username: 'steveRogers',
        roleId: staffRole.id,
        organizationId: organizationTwo?.id,
        pharmacyId: pharmacyOneOrgTwo.id,
        isEmailConfirmed: true,
      },
      {
        email: 'natashaStaff.wellness@itobuz.com',
        name: 'Natasha Romanoff',
        password: password, // Replace with hashed password
        username: 'natashaRomanoff',
        roleId: staffRole.id,
        organizationId: organizationTwo?.id,
        pharmacyId: pharmacyTwoOrgTwo.id,
        isEmailConfirmed: true,
      },
      // Organization Three Users
      {
        email: 'tonyAdmin.Global@itobuz.com',
        name: 'Tony Stark',
        password: password,
        username: 'tonyStark',
        roleId: adminRole.id,
        organizationId: organizationThree?.id,
        isEmailConfirmed: true,
      },
      {
        email: 'bruceAdmin.Global@itobuz.com',
        name: 'Bruce Banner',
        password: password, // Replace with hashed password
        username: 'bruceBanner',
        roleId: adminRole.id,
        organizationId: organizationThree?.id,
        isEmailConfirmed: true,
      },
      {
        email: 'peterStaff.Global@itobuz.com',
        name: 'Peter Parker',
        password: password,
        username: 'peterParker',
        roleId: staffRole.id,
        organizationId: organizationThree?.id,
        pharmacyId: pharmacyOneOrgThree.id,
        isEmailConfirmed: true,
      },
      {
        email: 'wandaStaff.Global@itobuz.com',
        name: 'Wanda Maximoff',
        password: password, // Replace with hashed password
        username: 'wandaMaximoff',
        roleId: staffRole.id,
        organizationId: organizationThree?.id,
        pharmacyId: pharmacyTwoOrgThree.id,
        isEmailConfirmed: true,
      },
    ],
  });

  // Item Categories Creation
  const categoryOne = await prisma.itemCategory.create({
    data: {
      name: 'Medical Equipment',
      status: true,
    },
  });
  const categoryTwo = await prisma.itemCategory.create({
    data: {
      name: 'Pharmaceuticals',
      status: true,
    },
  });
  const categoryThree = await prisma.itemCategory.create({
    data: {
      name: 'Personal Care',
      status: true,
    },
  });

  const categoryFour = await prisma.itemCategory.create({
    data: {
      name: 'Medical Consumables',
      status: true,
      parentCategoryId: categoryOne.id, // Medical Equipment
    },
  });
  const categoryFive = await prisma.itemCategory.create({
    data: {
      name: 'Over-the-Counter Medicines',
      status: true,
      parentCategoryId: categoryTwo.id, // Pharmaceuticals
    },
  });
  const categorySix = await prisma.itemCategory.create({
    data: {
      name: 'First Aid',
      status: true,
      parentCategoryId: categoryThree.id, // Personal Care
    },
  });

  const itemOne = await prisma.item.create({
    data: {
      name: 'Blood Pressure Monitor',
      baseUnit: BaseUnit.Piece,
      instructions: 'Use on the wrist for accurate measurements.',
      mrp_base_unit: 1500,
      wholesale_price: 1200,
      hsn_code: '9018',
      status: true,
    },
  });
  const itemTwo = await prisma.item.create({
    data: {
      name: 'Paracetamol 500mg',
      baseUnit: BaseUnit.Tablet,
      instructions: 'Take 1 tablet every 4-6 hours as needed.',
      mrp_base_unit: 50,
      wholesale_price: 35,
      hsn_code: '3004',
      status: true,
    },
  });
  const itemThree = await prisma.item.create({
    data: {
      name: 'Bandages 5m',
      baseUnit: BaseUnit.Roll,
      instructions: 'Apply to wounds for protection.',
      mrp_base_unit: 80,
      wholesale_price: 60,
      hsn_code: '3005',
      status: true,
    },
  });
  const itemFour = await prisma.item.create({
    data: {
      name: 'Hand Sanitizer 200ml',
      baseUnit: BaseUnit.Bottle,
      instructions: 'Apply a small amount on hands and rub thoroughly.',
      mrp_base_unit: 120,
      wholesale_price: 90,
      hsn_code: '3808',
      status: true,
    },
  });
  const itemFive = await prisma.item.create({
    data: {
      name: 'Cough Syrup 100ml',
      baseUnit: BaseUnit.Bottle,
      instructions: 'Take 1 tablespoon every 4 hours.',
      mrp_base_unit: 150,
      wholesale_price: 100,
      hsn_code: '3004',
      status: true,
    },
  });
  const itemSix = await prisma.item.create({
    data: {
      name: 'Thermometer Digital',
      baseUnit: BaseUnit.Piece,
      instructions: 'Place under the tongue for 1 minute for accurate reading.',
      mrp_base_unit: 500,
      wholesale_price: 400,
      hsn_code: '9025',
      status: true,
    },
  });
  const itemSeven = await prisma.item.create({
    data: {
      name: 'Antiseptic Solution 100ml',
      baseUnit: BaseUnit.Bottle,
      instructions: 'Apply to the affected area twice daily.',
      mrp_base_unit: 120,
      wholesale_price: 90,
      hsn_code: '3002',
      status: true,
    },
  });
  const itemEight = await prisma.item.create({
    data: {
      name: 'Glucometer',
      baseUnit: BaseUnit.Piece,
      instructions: 'Use test strips to check blood sugar levels.',
      mrp_base_unit: 2000,
      wholesale_price: 1800,
      hsn_code: '9019',
      status: true,
    },
  });
  const itemNine = await prisma.item.create({
    data: {
      name: 'Cotton Swabs 100 pcs',
      baseUnit: BaseUnit.Piece,
      instructions: 'Use for cleaning wounds or applying ointments.',
      mrp_base_unit: 150,
      wholesale_price: 100,
      hsn_code: '3003',
      status: true,
    },
  });
  const itemTen = await prisma.item.create({
    data: {
      name: 'Vitamin C 1000mg',
      baseUnit: BaseUnit.Tablet,
      instructions: 'Take 1 tablet daily after a meal.',
      mrp_base_unit: 350,
      wholesale_price: 250,
      hsn_code: '3001',
      status: true,
    },
  });
  const itemEleven = await prisma.item.create({
    data: {
      name: 'Hand Gloves Pack (10 pairs)',
      baseUnit: BaseUnit.Pack,
      instructions: 'Wear gloves to protect hands from contaminants.',
      mrp_base_unit: 250,
      wholesale_price: 200,
      hsn_code: '4015',
      status: true,
    },
  });
  const itemTwelve = await prisma.item.create({
    data: {
      name: 'Surgical Mask (Box of 50)',
      baseUnit: BaseUnit.Box,
      instructions:
        'Wear mask to cover nose and mouth during medical procedures.',
      mrp_base_unit: 400,
      wholesale_price: 350,
      hsn_code: '3926',
      status: true,
    },
  });
  const itemThirteen = await prisma.item.create({
    data: {
      name: 'Pain Relief Spray 150ml',
      baseUnit: BaseUnit.Bottle,
      instructions: 'Spray on affected area and massage gently.',
      mrp_base_unit: 250,
      wholesale_price: 200,
      hsn_code: '3004',
      status: true,
    },
  });
  const itemFourteen = await prisma.item.create({
    data: {
      name: 'First Aid Kit',
      baseUnit: BaseUnit.Piece,
      instructions: 'Use for emergency treatment of minor injuries.',
      mrp_base_unit: 1500,
      wholesale_price: 1300,
      hsn_code: '3401',
      status: true,
    },
  });
  const itemFifteen = await prisma.item.create({
    data: {
      name: 'Face Shield',
      baseUnit: BaseUnit.Piece,
      instructions: 'Wear for protection against droplets and splashes.',
      mrp_base_unit: 350,
      wholesale_price: 300,
      hsn_code: '3926',
      status: true,
    },
  });

  // Establish relations between items and categories
  const itemCategoryRelations = await prisma.itemCategoryRelation.createMany({
    data: [
      // Medical Equipment
      {
        itemId: itemOne.id, // Blood Pressure Monitor
        itemCategoryId: categoryOne.id, // Medical Equipment
        status: true,
      },
      {
        itemId: itemSix.id, // Thermometer Digital
        itemCategoryId: categoryOne.id, // Medical Equipment
        status: true,
      },
      {
        itemId: itemEight.id, // Glucometer
        itemCategoryId: categoryOne.id, // Medical Equipment
        status: true,
      },

      // Pharmaceuticals
      {
        itemId: itemTwo.id, // Paracetamol 500mg
        itemCategoryId: categoryTwo.id, // Pharmaceuticals
        status: true,
      },
      {
        itemId: itemFive.id, // Cough Syrup 100ml
        itemCategoryId: categoryTwo.id, // Pharmaceuticals
        status: true,
      },
      {
        itemId: itemThirteen.id, // Pain Relief Spray 150ml
        itemCategoryId: categoryTwo.id, // Pharmaceuticals
        status: true,
      },
      {
        itemId: itemTen.id, // Vitamin C 1000mg
        itemCategoryId: categoryTwo.id, // Pharmaceuticals
        status: true,
      },

      // Personal Care
      {
        itemId: itemFour.id, // Hand Sanitizer 200ml
        itemCategoryId: categoryThree.id, // Personal Care
        status: true,
      },
      {
        itemId: itemNine.id, // Cotton Swabs 100 pcs
        itemCategoryId: categoryThree.id, // Personal Care
        status: true,
      },

      // Medical Consumables
      {
        itemId: itemThree.id, // Bandages 5m
        itemCategoryId: categoryFour.id, // Medical Consumables
        status: true,
      },
      {
        itemId: itemSeven.id, // Antiseptic Solution 100ml
        itemCategoryId: categoryFour.id, // Medical Consumables
        status: true,
      },
      {
        itemId: itemEleven.id, // Hand Gloves Pack (10 pairs)
        itemCategoryId: categoryFour.id, // Medical Consumables
        status: true,
      },
      {
        itemId: itemTwelve.id, // Surgical Mask (Box of 50)
        itemCategoryId: categoryFour.id, // Medical Consumables
        status: true,
      },

      // First Aid
      {
        itemId: itemFourteen.id, // First Aid Kit
        itemCategoryId: categorySix.id, // First Aid
        status: true,
      },
      {
        itemId: itemNine.id, // Cotton Swabs 100 pcs (also related to First Aid)
        itemCategoryId: categorySix.id, // First Aid
        status: true,
      },
    ],
  });

  // Create warehouse stock
  const warehouseStocksCreation =
    await prisma.warehouseStock.createManyAndReturn({
      data: [
        {
          itemId: itemOne?.id,
          warehouseId: warehouses[0]?.id,
          final_qty: 100,
        },
        {
          itemId: itemOne?.id,
          warehouseId: warehouses[1]?.id,
          final_qty: 50,
        },
        {
          itemId: itemThree?.id,
          warehouseId: warehouses[3]?.id,
          final_qty: 200,
        },
      ],
    });

  // Generate SKU Name And Creating It
  const skuNameItemOneWarehouseZero = `${itemOne.name} ${warehouses[0].name} ${organizationOne.name}`;
  const skuNameItemOneWarehouseOne = `${itemOne.name} ${warehouses[1].name} ${organizationOne.name}`;
  const skuNameItemThreeWarehouseThree = `${itemTwo.name} ${warehouses[3].name} ${organizationTwo.name}`;

  await prisma.sKU.createManyAndReturn({
    data: [
      {
        sku: skuNameItemOneWarehouseZero,
        stocklevel_min: null,
        stocklevel_max: null,
        stock_status: null,
        stockLevel: null,
        itemId: itemOne?.id,
        organizationId: organizationOne.id,
        warehouseStockId: warehouseStocksCreation[0]?.id,
        warehouseId: warehouses[0]?.id,
      },
      {
        sku: skuNameItemOneWarehouseOne,
        stocklevel_min: null,
        stocklevel_max: null,
        stock_status: null,
        stockLevel: null,
        itemId: itemOne?.id,
        organizationId: organizationOne.id,
        warehouseStockId: warehouseStocksCreation[1]?.id,
        warehouseId: warehouses[1]?.id,
      },
      {
        sku: skuNameItemThreeWarehouseThree,
        stocklevel_min: null,
        stocklevel_max: null,
        stock_status: null,
        stockLevel: null,
        itemId: itemOne?.id,
        organizationId: organizationTwo.id,
        warehouseStockId: warehouseStocksCreation[2]?.id,
        warehouseId: warehouses[3]?.id,
      },
    ],
  });

  const warehouseStocksCreationData = warehouseStocksCreation;
  const createWarehouseStockInput = ['2030-02-12', '2030-03-02', '2030-05-25'];
  console.log('warehouseStocksCreationData=', warehouseStocksCreationData);

  // // StockMovement for warehouse stock creation
  // warehouseStocksCreation.forEach(async (createdWarehouseStock, i) => {
  //   // Creation of Stock Movement data.STARTS
  //   async function generateRandomBatchText(
  //     length: number = 8,
  //   ): Promise<string> {
  //     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  //     let batchText = '';

  //     for (let i = 0; i < length; i++) {
  //       const randomIndex = Math.floor(Math.random() * characters.length);
  //       batchText += characters[randomIndex];
  //     }

  //     return batchText;
  //   }
  //   const randomBatchText = await generateRandomBatchText(8);

  //   const lotName = await generateLotName();

  //   const createStockMovement = {
  //     itemId: createdWarehouseStock?.itemId,
  //     qty: createdWarehouseStock.final_qty,
  //     batchName: randomBatchText,
  //     expiry: new Date(createWarehouseStockInput[i]),
  //     warehouseStockId: createdWarehouseStock.id,
  //     warehouseId: createdWarehouseStock.warehouseId,
  //     organizationId: organizationOne.id,
  //     lotName,
  //     transactionType: StockMovementsType.ENTRY,
  //   };
  //   // Creation of Stock Movement data.ENDS

  //   // CALLING THE STOCKMOVEMENT CREATE METHOD, PASSING "createStockMovement" AS THE ARGUMENT TO IT! STARTS
  //   await stockMovementService.create(createStockMovement);
  //   // CALLING THE STOCKMOVEMENT CREATE METHOD, PASSING "createStockMovement" AS THE ARGUMENT TO IT! ENDS
  // });
}

async function main() {
  await resetDatabase();
  await seedData();
  console.log('Database reset and seeded successfully!');
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
