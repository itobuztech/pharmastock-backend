import * as bcrypt from 'bcrypt';
import { PrismaClient, UserRole } from '@prisma/client';

import { BaseUnit } from '../src/items/base-unit.enum';

const prisma = new PrismaClient();

export async function resetDatabase() {
  await prisma.role.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.organization.deleteMany({});
  await prisma.itemCategory.deleteMany({});
  await prisma.item.deleteMany({});
  await prisma.itemCategoryRelation.deleteMany({});
  await prisma.warehouse.deleteMany({});
  await prisma.pharmacy.deleteMany({});
  await prisma.warehouseStock.deleteMany({});
  await prisma.pharmacyStock.deleteMany({});
  await prisma.pharmacyStockClearance.deleteMany({});
  await prisma.stockMovement.deleteMany({});
  await prisma.sKU.deleteMany({});
  console.clear();
}

export async function seedData() {
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

  const organizationsData = [
    {
      id: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
      name: 'HealthFirst Supplies',
      description: 'A reliable supplier of premium healthcare products.',
      active: true,
      address: '20 MG Road',
      city: 'Bangalore',
      country: 'India',
      contact: '+919876543210',
    },
    {
      id: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
      name: 'Wellness Medical Distribution',
      description:
        'Focused on delivering top-quality medical supplies worldwide.',
      active: true,
      address: '88 Park Street',
      city: 'Kolkata',
      country: 'India',
      contact: '+919845678910',
    },
    {
      id: 'c4ae4411-eb80-4244-8d12-10d4f8ad17cd',
      name: 'Global MedTech Solutions',
      description:
        'Innovating the healthcare industry with cutting-edge technology.',
      active: true,
      address: '15 Connaught Place',
      city: 'New Delhi',
      country: 'India',
      contact: '+919812345678',
    },
    {
      id: 'eff40114-11e0-4daf-97c1-df3d4f0bc829',
      name: 'LifeCare Equipment Co.',
      description: 'Your trusted partner in hospital and clinic equipment.',
      active: true,
      address: '4 Anna Salai',
      city: 'Chennai',
      country: 'India',
      contact: '+919987654321',
    },
    {
      id: '294b03d4-d95a-42b1-86b0-66629ff68cd4',
      name: 'MediCare Supplies',
      description:
        'A leading distributor of medical equipment and health supplies, specializing in hospitals and clinics.',
      active: true,
      address: '50 Marine Drive',
      city: 'Mumbai',
      country: 'India',
      contact: '+919865432109',
    },
  ];
  await prisma.organization.createMany({
    data: organizationsData,
  });

  const warehousesData = [
    {
      id: '1c254c41-318f-4bc8-a215-242e89476b79',
      name: 'Central Distribution Hub',
      location: 'Mumbai, Maharashtra',
      area: 'Andheri East',
      organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd', // Link to HealthFirst Supplies
      status: true,
    },
    {
      id: 'b718e366-2699-4258-a218-f9f3021bf6e4',
      name: 'Northwest Storage Facility',
      location: 'Ahmedabad, Gujarat',
      area: 'Vatva Industrial Area',
      organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd', // Link to HealthFirst Supplies
      status: true,
    },
    {
      id: '481ff14e-0b72-4a5c-84d1-c602ec5f65c9',
      name: 'Southern Supplies Depot',
      location: 'Bangalore, Karnataka',
      area: 'Whitefield',
      organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3', // Link to Wellness Medical Distribution
      status: true,
    },
    {
      id: '6a2aa9c6-6686-43d2-a13e-2a9b9da832b4',
      name: 'West Coast Warehouse',
      location: 'Kochi, Kerala',
      area: 'Kalamassery',
      organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3', // Link to Wellness Medical Distribution
      status: true,
    },
    {
      id: '6f34f45f-46a7-4b1d-9417-6cf37d469f7b',
      name: 'Midwest Logistics Center',
      location: 'Delhi, Delhi',
      area: 'Okhla Industrial Area',
      organizationId: 'c4ae4411-eb80-4244-8d12-10d4f8ad17cd', // Link to Global MedTech Solutions
      status: true,
    },
    {
      id: 'a31e67ba-acaf-4730-88a7-39241d855727',
      name: 'Eastern Fulfillment Center',
      location: 'Kolkata, West Bengal',
      area: 'Salt Lake',
      organizationId: 'c4ae4411-eb80-4244-8d12-10d4f8ad17cd', // Link to Global MedTech Solutions
      status: true,
    },
  ];
  await prisma.warehouse.createMany({
    data: warehousesData,
  });

  const pharmaciesData = [
    {
      id: '4375cda2-a239-4207-a1ac-b449afba5e64',
      name: 'Central City Pharmacy',
      location: 'Andheri East, Mumbai, Maharashtra',
      organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd', // Link to HealthFirst Supplies
      contact_info: '+912225550101', // Valid phone number format
      status: true,
    },
    {
      id: 'fe16edec-f7c3-4196-a8ff-703781612585',
      name: 'HealthPlus Pharmacy',
      location: 'Vatva Industrial Area, Ahmedabad, Gujarat',
      organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd', // Link to HealthFirst Supplies
      contact_info: '+912065550402', // Valid phone number format
      status: true,
    },
    {
      id: 'ad284d82-ca36-4b5f-8c4e-0d8833676346',
      name: 'CareFirst Pharmacy',
      location: 'Whitefield, Bangalore, Karnataka',
      organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3', // Link to Wellness Medical Distribution
      contact_info: '+914155550404', // Valid phone number format
      status: true,
    },
    {
      id: 'bedb883d-1cea-4796-8e87-e10464c30347',
      name: 'Wellness Pharmacy',
      location: 'Kalamassery, Kochi, Kerala',
      organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3', // Link to Wellness Medical Distribution
      contact_info: '+915125550303', // Valid phone number format
      status: true,
    },
    {
      id: 'b9233778-212a-4996-9c3e-71bf721f4f35',
      name: 'MedTrust Pharmacy',
      location: 'Okhla Industrial Area, Delhi',
      organizationId: 'c4ae4411-eb80-4244-8d12-10d4f8ad17cd', // Link to Global MedTech Solutions
      contact_info: '+91110305550606', // Valid phone number format
      status: true,
    },
    {
      id: '36aaed2d-3ffb-4cd2-82e5-33302624296e',
      name: 'EuroCare Pharmacy',
      location: 'Salt Lake, Kolkata, West Bengal',
      organizationId: 'c4ae4411-eb80-4244-8d12-10d4f8ad17cd', // Link to Global MedTech Solutions
      contact_info: '+91331225550707', // Valid phone number format
      status: true,
    },
  ];

  await prisma.pharmacy.createMany({
    data: pharmaciesData,
  });

  const users = [
    {
      id: '46cb96b0-f1dd-433d-b47b-5fe1ab0f7f68',
      email: 'palashSuperAdmin@itobuz.com',
      password,
      name: 'Palash Chanda',
      username: 'palashChanda',
      isEmailConfirmed: true,
      emailConfirmationToken: null,
      roleId: superAdminRole.id,
      organizationId: null,
      status: true,
      pharmacyId: null,
    },
    {
      id: '7f9abaf5-5f7a-4609-8d1a-69f577d271c0',
      email: 'sudeepAdmin.healthfirst@itobuz.com',
      password,
      name: 'Sudeep Chowdhury',
      username: 'sudeepChowdhury',
      isEmailConfirmed: true,
      emailConfirmationToken: null,
      roleId: adminRole.id,
      organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
      status: true,
      pharmacyId: null,
    },
    {
      id: '88df6a3d-e347-4a59-a6f0-0e93a19e0f31',
      email: 'robertAdmin.healthfirst@itobuz.com',
      password,
      name: 'Robert Brown',
      username: 'robertBrown',
      isEmailConfirmed: true,
      emailConfirmationToken: null,
      roleId: adminRole.id,
      organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
      status: true,
      pharmacyId: null,
    },
    {
      id: '6e663e00-c065-4c1d-8a59-42603bcd7f57',
      email: 'aliceStaff.healthfirst@itobuz.com',
      password,
      name: 'Alice Johnson',
      username: 'aliceJohnson',
      isEmailConfirmed: true,
      emailConfirmationToken: null,
      roleId: staffRole.id,
      organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
      status: true,
      pharmacyId: '4375cda2-a239-4207-a1ac-b449afba5e64',
    },
    {
      id: 'ea2c26a6-bc7d-485c-9f8d-25b05005fe32',
      email: 'clarkStaff.healthfirst@itobuz.com',
      password,
      name: 'Clark Kent',
      username: 'clarkKent',
      isEmailConfirmed: true,
      emailConfirmationToken: null,
      roleId: staffRole.id,
      organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
      status: true,
      pharmacyId: 'fe16edec-f7c3-4196-a8ff-703781612585',
    },
    {
      id: '45bacd3b-0051-41ab-9bd7-56864113d1bd',
      email: 'dianaAdmin.wellness@itobuz.com',
      password,
      name: 'Diana Prince',
      username: 'dianaPrince',
      isEmailConfirmed: true,
      emailConfirmationToken: null,
      roleId: adminRole.id,
      organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
      status: true,
      pharmacyId: null,
    },
    {
      id: '2a41a12c-097e-46f5-827b-00eef021b857',
      email: 'bruceAdmin.wellness@itobuz.com',
      password,
      name: 'Bruce Wayne',
      username: 'bruceManager',
      isEmailConfirmed: true,
      emailConfirmationToken: null,
      roleId: adminRole.id,
      organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
      status: true,
      pharmacyId: null,
    },
    {
      id: 'd56565f5-9ddc-4995-a112-2b22b337b955',
      email: 'steveStaff.wellness@itobuz.com',
      password,
      name: 'Steve Rogers',
      username: 'steveRogers',
      isEmailConfirmed: true,
      emailConfirmationToken: null,
      roleId: staffRole.id,
      organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
      status: true,
      pharmacyId: 'ad284d82-ca36-4b5f-8c4e-0d8833676346',
    },
    {
      id: '3cca709e-c1e4-4185-bd0f-086f138d275f',
      email: 'natashaStaff.wellness@itobuz.com',
      password,
      name: 'Natasha Romanoff',
      username: 'natashaRomanoff',
      isEmailConfirmed: true,
      emailConfirmationToken: null,
      roleId: staffRole.id,
      organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
      status: true,
      pharmacyId: 'bedb883d-1cea-4796-8e87-e10464c30347',
    },
    {
      id: '0ff39ac1-3ebc-49ce-b5c9-320a6c539463',
      email: 'tonyAdmin.Global@itobuz.com',
      password,
      name: 'Tony Stark',
      username: 'tonyStark',
      isEmailConfirmed: true,
      emailConfirmationToken: null,
      roleId: adminRole.id,
      organizationId: 'c4ae4411-eb80-4244-8d12-10d4f8ad17cd',
      status: true,
      pharmacyId: null,
    },
    {
      id: '50634aa9-77f8-4b6d-987d-f008446b7c93',
      email: 'bruceAdmin.Global@itobuz.com',
      password,
      name: 'Bruce Banner',
      username: 'bruceBanner',
      isEmailConfirmed: true,
      emailConfirmationToken: null,
      roleId: adminRole.id,
      organizationId: 'c4ae4411-eb80-4244-8d12-10d4f8ad17cd',
      status: true,
      pharmacyId: null,
    },
    {
      id: '47ea95b2-46cd-4061-9092-bed5909cbaba',
      email: 'peterStaff.Global@itobuz.com',
      password,
      name: 'Peter Parker',
      username: 'peterParker',
      isEmailConfirmed: true,
      emailConfirmationToken: null,
      roleId: staffRole.id,
      organizationId: 'c4ae4411-eb80-4244-8d12-10d4f8ad17cd',
      status: true,
      pharmacyId: 'b9233778-212a-4996-9c3e-71bf721f4f35',
    },
    {
      id: '63c46aff-f4a0-4731-81a7-f60e2dd873a2',
      email: 'wandaStaff.Global@itobuz.com',
      password,
      name: 'Wanda Maximoff',
      username: 'wandaMaximoff',
      isEmailConfirmed: true,
      emailConfirmationToken: null,
      roleId: staffRole.id,
      organizationId: 'c4ae4411-eb80-4244-8d12-10d4f8ad17cd',
      status: true,
      pharmacyId: null,
    },
  ];

  // Users Creation
  await prisma.user.createMany({
    data: users,
  });

  const itemsData = [
    {
      id: 'b543906d-f426-4445-a6de-a8000d605664',
      name: 'Blood Pressure Monitor',
      baseUnit: BaseUnit.Piece,
      instructions: 'Use on the wrist for accurate measurements.',
      mrp_base_unit: 1500,
      wholesale_price: 1200,
      hsn_code: '9018',
      status: true,
    },
    {
      id: '0a366779-d8ad-4852-81b6-3d8744181b36',
      name: 'Paracetamol 500mg',
      baseUnit: BaseUnit.Tablet,
      instructions: 'Take 1 tablet every 4-6 hours as needed.',
      mrp_base_unit: 50,
      wholesale_price: 35,
      hsn_code: '3004',
      status: true,
    },
    {
      id: '7e7b5c8b-4563-435a-a227-bc9173c025fe',
      name: 'Bandages 5m',
      baseUnit: BaseUnit.Roll,
      instructions: 'Apply to wounds for protection.',
      mrp_base_unit: 80,
      wholesale_price: 60,
      hsn_code: '3005',
      status: true,
    },
    {
      id: 'eb3f4845-5901-4000-b5a4-5763f103df21',
      name: 'Hand Sanitizer 200ml',
      baseUnit: BaseUnit.Bottle,
      instructions: 'Apply a small amount on hands and rub thoroughly.',
      mrp_base_unit: 120,
      wholesale_price: 90,
      hsn_code: '3808',
      status: true,
    },
    {
      id: '64884fb3-c9bc-41ff-87ba-64c01af61962',
      name: 'Cough Syrup 100ml',
      baseUnit: BaseUnit.Bottle,
      instructions: 'Take 1 tablespoon every 4 hours.',
      mrp_base_unit: 150,
      wholesale_price: 100,
      hsn_code: '3004',
      status: true,
    },
    {
      id: '4e28d97d-10cb-4513-abe8-ff30653ecacf',
      name: 'Thermometer Digital',
      baseUnit: BaseUnit.Piece,
      instructions: 'Place under the tongue for 1 minute for accurate reading.',
      mrp_base_unit: 500,
      wholesale_price: 400,
      hsn_code: '9025',
      status: true,
    },
    {
      id: '754a063a-f6f0-4c79-8adc-40e33e6ade8e',
      name: 'Antiseptic Solution 100ml',
      baseUnit: BaseUnit.Bottle,
      instructions: 'Apply to the affected area twice daily.',
      mrp_base_unit: 120,
      wholesale_price: 90,
      hsn_code: '3002',
      status: true,
    },
    {
      id: '7a7a942a-77cb-44ae-aae2-4d99131191eb',
      name: 'Glucometer',
      baseUnit: BaseUnit.Piece,
      instructions: 'Use test strips to check blood sugar levels.',
      mrp_base_unit: 2000,
      wholesale_price: 1800,
      hsn_code: '9019',
      status: true,
    },
    {
      id: '69634b01-972e-4b60-b7bc-96a63db463fe',
      name: 'Cotton Swabs 100 pcs',
      baseUnit: BaseUnit.Piece,
      instructions: 'Use for cleaning wounds or applying ointments.',
      mrp_base_unit: 150,
      wholesale_price: 100,
      hsn_code: '3003',
      status: true,
    },
    {
      id: 'c77e37dd-7fea-4ae6-a221-f4cb823b58e7',
      name: 'Vitamin C 1000mg',
      baseUnit: BaseUnit.Tablet,
      instructions: 'Take 1 tablet daily after a meal.',
      mrp_base_unit: 350,
      wholesale_price: 250,
      hsn_code: '3001',
      status: true,
    },
    {
      id: '0c179c05-b835-42cc-887f-6991d77a660b',
      name: 'Hand Gloves Pack (10 pairs)',
      baseUnit: BaseUnit.Pack,
      instructions: 'Wear gloves to protect hands from contaminants.',
      mrp_base_unit: 250,
      wholesale_price: 200,
      hsn_code: '4015',
      status: true,
    },
    {
      id: '7836e1c5-ffa0-4be1-beb0-e014882e97bb',
      name: 'Surgical Mask (Box of 50)',
      baseUnit: BaseUnit.Box,
      instructions:
        'Wear mask to cover nose and mouth during medical procedures.',
      mrp_base_unit: 400,
      wholesale_price: 350,
      hsn_code: '3926',
      status: true,
    },
    {
      id: 'e450cbfd-034f-4077-8c3f-3be971e03c31',
      name: 'Pain Relief Spray 150ml',
      baseUnit: BaseUnit.Bottle,
      instructions: 'Spray on affected area and massage gently.',
      mrp_base_unit: 250,
      wholesale_price: 200,
      hsn_code: '3004',
      status: true,
    },
    {
      id: 'c64d365b-821e-47aa-97fa-76a7e852f538',
      name: 'First Aid Kit',
      baseUnit: BaseUnit.Piece,
      instructions: 'Use for emergency treatment of minor injuries.',
      mrp_base_unit: 1500,
      wholesale_price: 1300,
      hsn_code: '3401',
      status: true,
    },
    {
      id: '72b6f081-4d9e-437c-9d44-757417b48df7',
      name: 'Face Shield',
      baseUnit: BaseUnit.Piece,
      instructions: 'Wear for protection against droplets and splashes.',
      mrp_base_unit: 350,
      wholesale_price: 300,
      hsn_code: '3926',
      status: true,
    },
  ];

  // Items Creation
  await prisma.item.createMany({
    data: itemsData,
  });

  const itemCategoriesData = [
    {
      id: 'ee0c521b-e9e4-46c0-ae70-33239a450eff',
      name: 'Medical Equipment',
      parentCategoryId: null,
      status: true,
    },
    {
      id: '1c204a06-ebe5-4451-a384-886603911e12',
      name: 'Pharmaceuticals',
      parentCategoryId: null,
      status: true,
    },
    {
      id: 'a22e9532-4b43-43d7-91ff-2d3f6ca9558e',
      name: 'Personal Care',
      parentCategoryId: null,
      status: true,
    },
    {
      id: 'a0a3e9e7-1946-4736-a9ca-c3c8d2943acc',
      name: 'Medical Consumables',
      parentCategoryId: 'ee0c521b-e9e4-46c0-ae70-33239a450eff',
      status: true,
    },
    {
      id: 'd89c3626-b817-4b97-ba89-027cb17f1f8b',
      name: 'Over-the-Counter Medicines',
      parentCategoryId: '1c204a06-ebe5-4451-a384-886603911e12',
      status: true,
    },
    {
      id: 'a1d6dcc9-a898-4a60-bf39-fe74545f237a',
      name: 'First Aid',
      parentCategoryId: 'a22e9532-4b43-43d7-91ff-2d3f6ca9558e',
      status: true,
    },
  ];

  // Items Category Creation
  await prisma.itemCategory.createMany({
    data: itemCategoriesData,
  });

  // Establish relations between items and categories
  await prisma.itemCategoryRelation.createMany({
    data: [
      // Medical Equipment
      {
        itemId: 'b543906d-f426-4445-a6de-a8000d605664', // Blood Pressure Monitor
        itemCategoryId: 'ee0c521b-e9e4-46c0-ae70-33239a450eff', // Medical Equipment
        status: true,
      },
      {
        itemId: '4e28d97d-10cb-4513-abe8-ff30653ecacf', // Thermometer Digital
        itemCategoryId: 'ee0c521b-e9e4-46c0-ae70-33239a450eff', // Medical Equipment
        status: true,
      },
      {
        itemId: '7a7a942a-77cb-44ae-aae2-4d99131191eb', // Glucometer
        itemCategoryId: 'ee0c521b-e9e4-46c0-ae70-33239a450eff', // Medical Equipment
        status: true,
      },

      // Pharmaceuticals
      {
        itemId: '0a366779-d8ad-4852-81b6-3d8744181b36', // Paracetamol 500mg
        itemCategoryId: '1c204a06-ebe5-4451-a384-886603911e12', // Pharmaceuticals
        status: true,
      },
      {
        itemId: '64884fb3-c9bc-41ff-87ba-64c01af61962', // Cough Syrup 100ml
        itemCategoryId: '1c204a06-ebe5-4451-a384-886603911e12', // Pharmaceuticals
        status: true,
      },
      {
        itemId: 'e450cbfd-034f-4077-8c3f-3be971e03c31', // Pain Relief Spray 150ml
        itemCategoryId: '1c204a06-ebe5-4451-a384-886603911e12', // Pharmaceuticals
        status: true,
      },
      {
        itemId: 'c77e37dd-7fea-4ae6-a221-f4cb823b58e7', // Vitamin C 1000mg
        itemCategoryId: '1c204a06-ebe5-4451-a384-886603911e12', // Pharmaceuticals
        status: true,
      },

      // Personal Care
      {
        itemId: 'eb3f4845-5901-4000-b5a4-5763f103df21', // Hand Sanitizer 200ml
        itemCategoryId: 'a22e9532-4b43-43d7-91ff-2d3f6ca9558e', // Personal Care
        status: true,
      },
      {
        itemId: '69634b01-972e-4b60-b7bc-96a63db463fe', // Cotton Swabs 100 pcs
        itemCategoryId: 'a22e9532-4b43-43d7-91ff-2d3f6ca9558e', // Personal Care
        status: true,
      },

      // Medical Consumables
      {
        itemId: '7e7b5c8b-4563-435a-a227-bc9173c025fe', // Bandages 5m
        itemCategoryId: 'a0a3e9e7-1946-4736-a9ca-c3c8d2943acc', // Medical Consumables
        status: true,
      },
      {
        itemId: '754a063a-f6f0-4c79-8adc-40e33e6ade8e', // Antiseptic Solution 100ml
        itemCategoryId: 'a0a3e9e7-1946-4736-a9ca-c3c8d2943acc', // Medical Consumables
        status: true,
      },
      {
        itemId: '0c179c05-b835-42cc-887f-6991d77a660b', // Hand Gloves Pack (10 pairs)
        itemCategoryId: 'a0a3e9e7-1946-4736-a9ca-c3c8d2943acc', // Medical Consumables
        status: true,
      },
      {
        itemId: '7836e1c5-ffa0-4be1-beb0-e014882e97bb', // Surgical Mask (Box of 50)
        itemCategoryId: 'a0a3e9e7-1946-4736-a9ca-c3c8d2943acc', // Medical Consumables
        status: true,
      },

      // First Aid
      {
        itemId: 'c64d365b-821e-47aa-97fa-76a7e852f538', // First Aid Kit
        itemCategoryId: 'a1d6dcc9-a898-4a60-bf39-fe74545f237a', // First Aid
        status: true,
      },
      {
        itemId: '69634b01-972e-4b60-b7bc-96a63db463fe', // Cotton Swabs 100 pcs (also related to First Aid)
        itemCategoryId: 'a1d6dcc9-a898-4a60-bf39-fe74545f237a', // First Aid
        status: true,
      },
    ],
  });

  // Warehouse Stock Creation
  await prisma.warehouseStock.createMany({
    data: [
      {
        id: '8a849531-e895-477e-8e85-a8f20bfbe368',
        itemId: 'b543906d-f426-4445-a6de-a8000d605664',
        final_qty: 250,
        warehouseId: '1c254c41-318f-4bc8-a215-242e89476b79',
        status: true,
      },
      {
        id: '15a4588d-e12f-4570-b7ad-2439c25541cc',
        itemId: '0a366779-d8ad-4852-81b6-3d8744181b36',
        final_qty: 190,
        warehouseId: '1c254c41-318f-4bc8-a215-242e89476b79',
        status: true,
      },
      {
        id: 'b26ec01e-8c13-46a3-8b3a-163116ba2d79',
        itemId: '7e7b5c8b-4563-435a-a227-bc9173c025fe',
        final_qty: 240,
        warehouseId: 'b718e366-2699-4258-a218-f9f3021bf6e4',
        status: true,
      },
      {
        id: 'ec15e76a-b231-42dc-b028-fb5a6aba018a',
        itemId: 'eb3f4845-5901-4000-b5a4-5763f103df21',
        final_qty: 130,
        warehouseId: 'b718e366-2699-4258-a218-f9f3021bf6e4',
        status: true,
      },
      {
        id: 'a02bee5e-b706-4bab-b375-fa7e729442a8',
        itemId: '754a063a-f6f0-4c79-8adc-40e33e6ade8e',
        final_qty: 260,
        warehouseId: '6a2aa9c6-6686-43d2-a13e-2a9b9da832b4',
        status: true,
      },
      {
        id: '55659bc0-890a-4601-81ee-0bfa76f401cd',
        itemId: '7a7a942a-77cb-44ae-aae2-4d99131191eb',
        final_qty: 150,
        warehouseId: '6a2aa9c6-6686-43d2-a13e-2a9b9da832b4',
        status: true,
      },
      {
        id: 'b1bec0b4-2344-435e-a2b6-b778ddf80b79',
        itemId: '4e28d97d-10cb-4513-abe8-ff30653ecacf',
        final_qty: 211,
        warehouseId: '481ff14e-0b72-4a5c-84d1-c602ec5f65c9',
        status: true,
      },
      {
        id: '9ce84786-3537-44f2-8e58-46a9d052d115',
        itemId: '64884fb3-c9bc-41ff-87ba-64c01af61962',
        final_qty: 235,
        warehouseId: '481ff14e-0b72-4a5c-84d1-c602ec5f65c9',
        status: true,
      },
    ],
  });

  // SKU Creation
  await prisma.sKU.createMany({
    data: [
      {
        id: '5b9229bc-1c3d-4c7e-a165-d785533b712c',
        sku: 'Blood Pressure Monitor Central Distribution Hub HealthFirst Supplies',
        itemId: 'b543906d-f426-4445-a6de-a8000d605664',
        organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
        warehouseId: '1c254c41-318f-4bc8-a215-242e89476b79',
        warehouseStockId: '8a849531-e895-477e-8e85-a8f20bfbe368',
        status: true,
      },
      {
        id: '52b114dc-ac05-4383-b5e9-9e3131f3ed29',
        sku: 'Paracetamol 500mg Central Distribution Hub HealthFirst Supplies',
        itemId: '0a366779-d8ad-4852-81b6-3d8744181b36',
        organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
        warehouseId: '1c254c41-318f-4bc8-a215-242e89476b79',
        warehouseStockId: '15a4588d-e12f-4570-b7ad-2439c25541cc',
        status: true,
      },
      {
        id: '6d3277ff-531e-4acd-86bd-be219566d4d0',
        sku: 'Bandages 5m Northwest Storage Facility HealthFirst Supplies',
        itemId: '7e7b5c8b-4563-435a-a227-bc9173c025fe',
        organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
        warehouseId: 'b718e366-2699-4258-a218-f9f3021bf6e4',
        warehouseStockId: 'b26ec01e-8c13-46a3-8b3a-163116ba2d79',
        status: true,
      },
      {
        id: '9f00cd03-2e66-472d-be48-854225b9fdf7',
        sku: 'Hand Sanitizer 200ml Northwest Storage Facility HealthFirst Supplies',
        itemId: 'eb3f4845-5901-4000-b5a4-5763f103df21',
        organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
        warehouseId: 'b718e366-2699-4258-a218-f9f3021bf6e4',
        warehouseStockId: 'ec15e76a-b231-42dc-b028-fb5a6aba018a',
        status: true,
      },
      {
        id: '2888f79a-16db-424e-a6d0-8ce1ca58152d',
        sku: 'Cough Syrup 100ml Southern Supplies Depot Wellness Medical Distribution',
        itemId: '64884fb3-c9bc-41ff-87ba-64c01af61962',
        organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
        warehouseId: '481ff14e-0b72-4a5c-84d1-c602ec5f65c9',
        warehouseStockId: '9ce84786-3537-44f2-8e58-46a9d052d115',
        status: true,
      },
      {
        id: '61bae51c-4657-4ce3-9279-7631424fce34',
        sku: 'Thermometer Digital Southern Supplies Depot Wellness Medical Distribution',
        itemId: '4e28d97d-10cb-4513-abe8-ff30653ecacf',
        organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
        warehouseId: '481ff14e-0b72-4a5c-84d1-c602ec5f65c9',
        warehouseStockId: 'b1bec0b4-2344-435e-a2b6-b778ddf80b79',
        status: true,
      },
      {
        id: '2f87be94-f0a4-4d53-9b6d-a0edd74eb320',
        sku: 'Antiseptic Solution 100ml West Coast Warehouse Wellness Medical Distribution',
        itemId: '754a063a-f6f0-4c79-8adc-40e33e6ade8e',
        organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
        warehouseId: '6a2aa9c6-6686-43d2-a13e-2a9b9da832b4',
        warehouseStockId: 'a02bee5e-b706-4bab-b375-fa7e729442a8',
        status: true,
      },
      {
        id: '3b06565d-f054-4003-aa0a-a2bab3ce425b',
        sku: 'Glucometer West Coast Warehouse Wellness Medical Distribution',
        itemId: '7a7a942a-77cb-44ae-aae2-4d99131191eb',
        organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
        warehouseId: '6a2aa9c6-6686-43d2-a13e-2a9b9da832b4',
        warehouseStockId: '55659bc0-890a-4601-81ee-0bfa76f401cd',
        status: true,
      },
    ],
  });

  // Pharmacy Stock Creation
  await prisma.pharmacyStock.createMany({
    data: [
      {
        id: 'd343b907-0af0-4659-ab73-e892f4d1ff35',
        itemId: '0a366779-d8ad-4852-81b6-3d8744181b36',
        pharmacyId: '4375cda2-a239-4207-a1ac-b449afba5e64',
        final_qty: 45,
        status: true,
      },
      {
        id: '4fd34d3e-9c85-4871-9613-7286818c0789',
        itemId: 'b543906d-f426-4445-a6de-a8000d605664',
        pharmacyId: '4375cda2-a239-4207-a1ac-b449afba5e64',
        final_qty: 35,
        status: true,
      },
      {
        id: 'a3c18627-a004-42b8-9646-db3eb98b7586',
        itemId: '7e7b5c8b-4563-435a-a227-bc9173c025fe',
        pharmacyId: 'fe16edec-f7c3-4196-a8ff-703781612585',
        final_qty: 40,
        status: true,
      },
      {
        id: 'fe08d37d-f3e2-42c4-bf20-da8dd379be4e',
        itemId: 'eb3f4845-5901-4000-b5a4-5763f103df21',
        pharmacyId: 'fe16edec-f7c3-4196-a8ff-703781612585',
        final_qty: 50,
        status: true,
      },
      {
        id: '9496f5b9-e287-4997-a3d6-2cda157f5c6f',
        itemId: '4e28d97d-10cb-4513-abe8-ff30653ecacf',
        pharmacyId: 'ad284d82-ca36-4b5f-8c4e-0d8833676346',
        final_qty: 25,
        status: true,
      },
      {
        id: 'fbbf8eab-979a-4315-a0ce-aef179d97cd3',
        itemId: '64884fb3-c9bc-41ff-87ba-64c01af61962',
        pharmacyId: 'ad284d82-ca36-4b5f-8c4e-0d8833676346',
        final_qty: 40,
        status: true,
      },
      {
        id: '831d00ef-c296-4fbb-b496-b530c56daffe',
        itemId: '7a7a942a-77cb-44ae-aae2-4d99131191eb',
        pharmacyId: 'bedb883d-1cea-4796-8e87-e10464c30347',
        final_qty: 40,
        status: true,
      },
      {
        id: '4ba4f38b-9059-414c-bb0a-83287cf7b60e',
        itemId: '754a063a-f6f0-4c79-8adc-40e33e6ade8e',
        pharmacyId: 'bedb883d-1cea-4796-8e87-e10464c30347',
        final_qty: 25,
        status: true,
      },
    ],
  });

  // Pharmacy Stock Clearance
  await prisma.pharmacyStockClearance.createMany({
    data: [
      {
        id: '70cd135a-5a04-4894-9d08-834aab406dda',
        itemId: '0a366779-d8ad-4852-81b6-3d8744181b36',
        pharmacyStockId: 'd343b907-0af0-4659-ab73-e892f4d1ff35',
        qty: 5,
        status: true,
      },
      {
        id: 'daa64d64-defd-4b14-8855-a3ad011788cf',
        itemId: 'b543906d-f426-4445-a6de-a8000d605664',
        pharmacyStockId: '4fd34d3e-9c85-4871-9613-7286818c0789',
        qty: 10,
        status: true,
      },
      {
        id: '57bf6162-e405-45ab-bbf5-20230d1e50b1',
        itemId: '0a366779-d8ad-4852-81b6-3d8744181b36',
        pharmacyStockId: 'd343b907-0af0-4659-ab73-e892f4d1ff35',
        qty: 10,
        status: true,
      },
      {
        id: 'aa754e67-f3c6-44d1-b004-6c12d314f125',
        itemId: 'b543906d-f426-4445-a6de-a8000d605664',
        pharmacyStockId: '4fd34d3e-9c85-4871-9613-7286818c0789',
        qty: 5,
        status: true,
      },
      {
        id: 'cab28703-4617-4111-b873-e7cbc145829a',
        itemId: 'eb3f4845-5901-4000-b5a4-5763f103df21',
        pharmacyStockId: 'fe08d37d-f3e2-42c4-bf20-da8dd379be4e',
        qty: 15,
        status: true,
      },
      {
        id: '49e59760-9a13-46e0-baae-860b0df297ed',
        itemId: '7e7b5c8b-4563-435a-a227-bc9173c025fe',
        pharmacyStockId: 'a3c18627-a004-42b8-9646-db3eb98b7586',
        qty: 10,
        status: true,
      },
      {
        id: 'bae4a029-e9e8-46cb-af9e-a12b4310b6fc',
        itemId: '7e7b5c8b-4563-435a-a227-bc9173c025fe',
        pharmacyStockId: 'a3c18627-a004-42b8-9646-db3eb98b7586',
        qty: 10,
        status: true,
      },
      {
        id: '52336242-b69d-4b3e-9ccf-5911ab3905ad',
        itemId: 'eb3f4845-5901-4000-b5a4-5763f103df21',
        pharmacyStockId: 'fe08d37d-f3e2-42c4-bf20-da8dd379be4e',
        qty: 5,
        status: true,
      },
      {
        id: 'a5f4976e-c020-40ca-bb07-8b96c5c12cb9',
        itemId: '64884fb3-c9bc-41ff-87ba-64c01af61962',
        pharmacyStockId: 'fbbf8eab-979a-4315-a0ce-aef179d97cd3',
        qty: 15,
        status: true,
      },
      {
        id: 'c6eaf1f6-6b9e-4caf-a540-d4dfc8884f07',
        itemId: '4e28d97d-10cb-4513-abe8-ff30653ecacf',
        pharmacyStockId: '9496f5b9-e287-4997-a3d6-2cda157f5c6f',
        qty: 10,
        status: true,
      },
      {
        id: 'bf8b222d-623f-448e-b81f-ef0da8f49c0a',
        itemId: '4e28d97d-10cb-4513-abe8-ff30653ecacf',
        pharmacyStockId: '9496f5b9-e287-4997-a3d6-2cda157f5c6f',
        qty: 5,
        status: true,
      },
      {
        id: 'cec34889-ac37-4d88-890c-0e1fb0599ff8',
        itemId: '64884fb3-c9bc-41ff-87ba-64c01af61962',
        pharmacyStockId: 'fbbf8eab-979a-4315-a0ce-aef179d97cd3',
        qty: 10,
        status: true,
      },
      {
        id: '95c4cbad-6a27-4548-8496-49d22ac43164',
        itemId: '7a7a942a-77cb-44ae-aae2-4d99131191eb',
        pharmacyStockId: '831d00ef-c296-4fbb-b496-b530c56daffe',
        qty: 10,
        status: true,
      },
      {
        id: '8dffc5ce-b5f5-449b-8b0f-8a3578c19752',
        itemId: '754a063a-f6f0-4c79-8adc-40e33e6ade8e',
        pharmacyStockId: '4ba4f38b-9059-414c-bb0a-83287cf7b60e',
        qty: 15,
        status: true,
      },
    ],
  });

  // Stock Movements
  await prisma.stockMovement.createMany({
    data: [
      {
        id: '916c00fa-1ab8-4c9a-8891-8c7d6be2c482',
        warehouseStockId: '8a849531-e895-477e-8e85-a8f20bfbe368',
        qty: 300,
        itemId: 'b543906d-f426-4445-a6de-a8000d605664',
        batch_name: 'Batch 1',
        expiry: new Date('2025-01-10 13:28:56'),
        status: true,
        pharmacyStockClearanceId: null,
        pharmacyStockId: null,
        organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
        lot_name: 'cb1c53cb4819bc9b70',
        pharmacyId: null,
        warehouseId: '1c254c41-318f-4bc8-a215-242e89476b79',
        transactionType: 'ENTRY',
      },
      {
        id: '6ff9dbf8-d4db-4995-ab22-ec413aaa6cb2',
        warehouseStockId: '15a4588d-e12f-4570-b7ad-2439c25541cc',
        qty: 250,
        itemId: '0a366779-d8ad-4852-81b6-3d8744181b36',
        batch_name: 'Batch 2',
        expiry: new Date('2025-02-21 13:29:12'),
        status: true,
        pharmacyStockClearanceId: null,
        pharmacyStockId: null,
        organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
        lot_name: 'cb1c53cb4819bc9b70',
        pharmacyId: null,
        warehouseId: '1c254c41-318f-4bc8-a215-242e89476b79',
        transactionType: 'ENTRY',
      },
      {
        id: '60244e3f-2080-4a54-ac31-da41bc689c1d',
        warehouseStockId: 'b26ec01e-8c13-46a3-8b3a-163116ba2d79',
        qty: 300,
        itemId: '7e7b5c8b-4563-435a-a227-bc9173c025fe',
        batch_name: 'Batch 3',
        expiry: new Date('2025-05-23 13:29:57'),
        status: true,
        pharmacyStockClearanceId: null,
        pharmacyStockId: null,
        organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
        lot_name: 'd3ea87283fddf4e934',
        pharmacyId: null,
        warehouseId: 'b718e366-2699-4258-a218-f9f3021bf6e4',
        transactionType: 'ENTRY',
      },
      {
        id: 'da86558d-5527-46c9-8dc4-0fd9835f7ce5',
        warehouseStockId: 'ec15e76a-b231-42dc-b028-fb5a6aba018a',
        qty: 200,
        itemId: 'eb3f4845-5901-4000-b5a4-5763f103df21',
        batch_name: 'Batch 4',
        expiry: new Date('2025-03-14 13:30:08'),
        status: true,
        pharmacyStockClearanceId: null,
        pharmacyStockId: null,
        organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
        lot_name: 'd3ea87283fddf4e934',
        pharmacyId: null,
        warehouseId: 'b718e366-2699-4258-a218-f9f3021bf6e4',
        transactionType: 'ENTRY',
      },
      {
        id: '36cce2ae-75da-4235-a8d8-26528622756d',
        warehouseStockId: null,
        qty: 50,
        itemId: 'b543906d-f426-4445-a6de-a8000d605664',
        batch_name: 'Batch 1',
        expiry: new Date('2025-01-10 13:28:56'),
        status: true,
        pharmacyStockClearanceId: null,
        pharmacyStockId: '4fd34d3e-9c85-4871-9613-7286818c0789',
        organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
        lot_name: '6a9c90fd676029bd27',
        pharmacyId: '4375cda2-a239-4207-a1ac-b449afba5e64',
        warehouseId: '1c254c41-318f-4bc8-a215-242e89476b79',
        transactionType: 'MOVEMENT',
      },
      {
        id: '59f53624-8d52-4741-be95-4556edfa0d4f',
        warehouseStockId: null,
        qty: 60,
        itemId: '0a366779-d8ad-4852-81b6-3d8744181b36',
        batch_name: 'Batch 2',
        expiry: new Date('2025-02-21 13:29:12'),
        status: true,
        pharmacyStockClearanceId: null,
        pharmacyStockId: 'd343b907-0af0-4659-ab73-e892f4d1ff35',
        organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
        lot_name: '6a9c90fd676029bd27',
        pharmacyId: '4375cda2-a239-4207-a1ac-b449afba5e64',
        warehouseId: '1c254c41-318f-4bc8-a215-242e89476b79',
        transactionType: 'MOVEMENT',
      },
      {
        id: '7c53d9ba-2777-4974-9e3a-985a757ed3c8',
        warehouseStockId: null,
        qty: 60,
        itemId: '7e7b5c8b-4563-435a-a227-bc9173c025fe',
        batch_name: 'Batch 3',
        expiry: new Date('2025-05-23 13:29:57'),
        status: true,
        pharmacyStockClearanceId: null,
        pharmacyStockId: 'a3c18627-a004-42b8-9646-db3eb98b7586',
        organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
        lot_name: '2b415a76451c9256d3',
        pharmacyId: 'fe16edec-f7c3-4196-a8ff-703781612585',
        warehouseId: 'b718e366-2699-4258-a218-f9f3021bf6e4',
        transactionType: 'MOVEMENT',
      },
      {
        id: '36e1ac53-16f9-4b35-8752-ad67b383d982',
        warehouseStockId: null,
        qty: 70,
        itemId: 'eb3f4845-5901-4000-b5a4-5763f103df21',
        batch_name: 'Batch 4',
        expiry: new Date('2025-03-14 13:30:08'),
        status: true,
        pharmacyStockClearanceId: null,
        pharmacyStockId: 'fe08d37d-f3e2-42c4-bf20-da8dd379be4e',
        organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
        lot_name: '2b415a76451c9256d3',
        pharmacyId: 'fe16edec-f7c3-4196-a8ff-703781612585',
        warehouseId: 'b718e366-2699-4258-a218-f9f3021bf6e4',
        transactionType: 'MOVEMENT',
      },

      {
        id: 'c7e0a779-5692-4112-ae9b-e57df3268856',
        warehouseStockId: null,
        qty: 5,
        itemId: '0a366779-d8ad-4852-81b6-3d8744181b36',
        batch_name: 'Batch 2',
        expiry: null,
        status: true,
        pharmacyStockClearanceId: '70cd135a-5a04-4894-9d08-834aab406dda',
        pharmacyStockId: null,
        organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
        lot_name: '55c8d1af914ea2be79',
        pharmacyId: '4375cda2-a239-4207-a1ac-b449afba5e64',
        warehouseId: null,
        transactionType: 'EXIT',
      },
      {
        id: '0b173a9c-18cc-4dea-8063-ab9f935b2246',
        warehouseStockId: null,
        qty: 10,
        itemId: 'b543906d-f426-4445-a6de-a8000d605664',
        batch_name: 'Batch 1',
        expiry: null,
        status: true,
        pharmacyStockClearanceId: 'daa64d64-defd-4b14-8855-a3ad011788cf',
        pharmacyStockId: null,
        organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
        lot_name: '55c8d1af914ea2be79',
        pharmacyId: '4375cda2-a239-4207-a1ac-b449afba5e64',
        warehouseId: null,
        transactionType: 'EXIT',
      },
      {
        id: 'e925b210-6bf3-4999-9e5a-2a642eb16986',
        warehouseStockId: null,
        qty: 10,
        itemId: '0a366779-d8ad-4852-81b6-3d8744181b36',
        batch_name: 'Batch 2',
        expiry: null,
        status: true,
        pharmacyStockClearanceId: '57bf6162-e405-45ab-bbf5-20230d1e50b1',
        pharmacyStockId: null,
        organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
        lot_name: '2ff493edb8b5465e12',
        pharmacyId: '4375cda2-a239-4207-a1ac-b449afba5e64',
        warehouseId: null,
        transactionType: 'EXIT',
      },
      {
        id: 'cd83450c-b8ed-4b09-bb5f-568c589e0c89',
        warehouseStockId: null,
        qty: 5,
        itemId: 'b543906d-f426-4445-a6de-a8000d605664',
        batch_name: 'Batch 1',
        expiry: null,
        status: true,
        pharmacyStockClearanceId: 'aa754e67-f3c6-44d1-b004-6c12d314f125',
        pharmacyStockId: null,
        organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
        lot_name: '8e593288b293ba6907',
        pharmacyId: '4375cda2-a239-4207-a1ac-b449afba5e64',
        warehouseId: null,
        transactionType: 'EXIT',
      },
      {
        id: 'c3522502-5fc0-4974-ae41-9fa349842e8f',
        warehouseStockId: null,
        qty: 15,
        itemId: 'eb3f4845-5901-4000-b5a4-5763f103df21',
        batch_name: 'Batch 4',
        expiry: null,
        status: true,
        pharmacyStockClearanceId: 'cab28703-4617-4111-b873-e7cbc145829a',
        pharmacyStockId: null,
        organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
        lot_name: '4110fb00176db72837',
        pharmacyId: 'fe16edec-f7c3-4196-a8ff-703781612585',
        warehouseId: null,
        transactionType: 'EXIT',
      },
      {
        id: '1b44e37b-5ab3-4a58-8962-6e769994cfd5',
        warehouseStockId: null,
        qty: 10,
        itemId: '7e7b5c8b-4563-435a-a227-bc9173c025fe',
        batch_name: 'Batch 3',
        expiry: null,
        status: true,
        pharmacyStockClearanceId: '49e59760-9a13-46e0-baae-860b0df297ed',
        pharmacyStockId: null,
        organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
        lot_name: '4110fb00176db72837',
        pharmacyId: 'fe16edec-f7c3-4196-a8ff-703781612585',
        warehouseId: null,
        transactionType: 'EXIT',
      },
      {
        id: '2e31818c-92c1-4dfc-a518-4862304f0bb8',
        warehouseStockId: null,
        qty: 10,
        itemId: '7e7b5c8b-4563-435a-a227-bc9173c025fe',
        batch_name: 'Batch 3',
        expiry: null,
        status: true,
        pharmacyStockClearanceId: 'bae4a029-e9e8-46cb-af9e-a12b4310b6fc',
        pharmacyStockId: null,
        organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
        lot_name: 'dab23160ae9d1cf3b2',
        pharmacyId: 'fe16edec-f7c3-4196-a8ff-703781612585',
        warehouseId: null,
        transactionType: 'EXIT',
      },
      {
        id: '6e5053d6-c7f0-4ce2-a8c0-2aa79ce9900e',
        warehouseStockId: null,
        qty: 5,
        itemId: 'eb3f4845-5901-4000-b5a4-5763f103df21',
        batch_name: 'Batch 4',
        expiry: null,
        status: true,
        pharmacyStockClearanceId: '52336242-b69d-4b3e-9ccf-5911ab3905ad',
        pharmacyStockId: null,
        organizationId: 'b01cd4ba-592b-439b-83d3-59d57629a3fd',
        lot_name: '7998a2c0855e393900',
        pharmacyId: 'fe16edec-f7c3-4196-a8ff-703781612585',
        warehouseId: null,
        transactionType: 'EXIT',
      },

      {
        id: '44d8567b-8ff1-4029-b3b9-ee6e6392b303',
        warehouseStockId: '9ce84786-3537-44f2-8e58-46a9d052d115',
        qty: 300,
        itemId: '64884fb3-c9bc-41ff-87ba-64c01af61962',
        batch_name: 'Batch 5',
        expiry: new Date('2025-07-23 13:35:15'),
        status: true,
        pharmacyStockClearanceId: null,
        pharmacyStockId: null,
        organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
        lot_name: '3d2959c4ab0fae8f60',
        pharmacyId: null,
        warehouseId: '481ff14e-0b72-4a5c-84d1-c602ec5f65c9',
        transactionType: 'ENTRY',
      },
      {
        id: 'd2bbbfdd-83e8-4e16-9445-60d3aa9383ae',
        warehouseStockId: 'b1bec0b4-2344-435e-a2b6-b778ddf80b79',
        qty: 251,
        itemId: '4e28d97d-10cb-4513-abe8-ff30653ecacf',
        batch_name: 'Batch 6',
        expiry: new Date('2025-05-08 13:35:34'),
        status: true,
        pharmacyStockClearanceId: null,
        pharmacyStockId: null,
        organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
        lot_name: '3d2959c4ab0fae8f60',
        pharmacyId: null,
        warehouseId: '481ff14e-0b72-4a5c-84d1-c602ec5f65c9',
        transactionType: 'ENTRY',
      },
      {
        id: 'd169d04e-90f1-4707-a8b9-1271f56aec5d',
        warehouseStockId: 'a02bee5e-b706-4bab-b375-fa7e729442a8',
        qty: 300,
        itemId: '754a063a-f6f0-4c79-8adc-40e33e6ade8e',
        batch_name: 'Batch 7',
        expiry: new Date('2026-01-20 13:36:23'),
        status: true,
        pharmacyStockClearanceId: null,
        pharmacyStockId: null,
        organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
        lot_name: '154672209e6903cbb7',
        pharmacyId: null,
        warehouseId: '6a2aa9c6-6686-43d2-a13e-2a9b9da832b4',
        transactionType: 'ENTRY',
      },
      {
        id: '8e928f73-03d5-4d9a-982b-12a45fabf193',
        warehouseStockId: '55659bc0-890a-4601-81ee-0bfa76f401cd',
        qty: 200,
        itemId: '7a7a942a-77cb-44ae-aae2-4d99131191eb',
        batch_name: 'Batch 8',
        expiry: new Date('2025-07-09 13:36:42'),
        status: true,
        pharmacyStockClearanceId: null,
        pharmacyStockId: null,
        organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
        lot_name: '154672209e6903cbb7',
        pharmacyId: null,
        warehouseId: '6a2aa9c6-6686-43d2-a13e-2a9b9da832b4',
        transactionType: 'ENTRY',
      },

      {
        id: 'fe802170-a1e1-41eb-b32e-3055c0244d27',
        warehouseStockId: null,
        qty: 15,
        itemId: '64884fb3-c9bc-41ff-87ba-64c01af61962',
        batch_name: 'Batch 5',
        expiry: new Date('2025-07-23 13:35:15'),
        status: true,
        pharmacyStockClearanceId: null,
        pharmacyStockId: 'fbbf8eab-979a-4315-a0ce-aef179d97cd3',
        organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
        lot_name: '0684b37d849b8a728c',
        pharmacyId: 'ad284d82-ca36-4b5f-8c4e-0d8833676346',
        warehouseId: '481ff14e-0b72-4a5c-84d1-c602ec5f65c9',
        transactionType: 'MOVEMENT',
      },
      {
        id: 'ddfedd1a-90d4-461a-a435-ab6e43eb5812',
        warehouseStockId: null,
        qty: 10,
        itemId: '4e28d97d-10cb-4513-abe8-ff30653ecacf',
        batch_name: 'Batch 6',
        expiry: new Date('2025-05-08 13:35:34'),
        status: true,
        pharmacyStockClearanceId: null,
        pharmacyStockId: '9496f5b9-e287-4997-a3d6-2cda157f5c6f',
        organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
        lot_name: '0684b37d849b8a728c',
        pharmacyId: 'ad284d82-ca36-4b5f-8c4e-0d8833676346',
        warehouseId: '481ff14e-0b72-4a5c-84d1-c602ec5f65c9',
        transactionType: 'MOVEMENT',
      },
      {
        id: '5974315e-5bcd-4ed1-b40e-24af5d9e74ce',
        warehouseStockId: null,
        qty: 40,
        itemId: '754a063a-f6f0-4c79-8adc-40e33e6ade8e',
        batch_name: 'Batch 7',
        expiry: new Date('2026-01-20 13:36:23'),
        status: true,
        pharmacyStockClearanceId: null,
        pharmacyStockId: '4ba4f38b-9059-414c-bb0a-83287cf7b60e',
        organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
        lot_name: '691428643dcdcc4c21',
        pharmacyId: 'bedb883d-1cea-4796-8e87-e10464c30347',
        warehouseId: '6a2aa9c6-6686-43d2-a13e-2a9b9da832b4',
        transactionType: 'MOVEMENT',
      },
      {
        id: '781be883-7086-4336-8a46-77e9b88e7767',
        warehouseStockId: null,
        qty: 50,
        itemId: '7a7a942a-77cb-44ae-aae2-4d99131191eb',
        batch_name: 'Batch 8',
        expiry: new Date('2025-07-09 13:36:42'),
        status: true,
        pharmacyStockClearanceId: null,
        pharmacyStockId: '831d00ef-c296-4fbb-b496-b530c56daffe',
        organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
        lot_name: '691428643dcdcc4c21',
        pharmacyId: 'bedb883d-1cea-4796-8e87-e10464c30347',
        warehouseId: '6a2aa9c6-6686-43d2-a13e-2a9b9da832b4',
        transactionType: 'MOVEMENT',
      },
      {
        id: '3e208e03-107a-4675-b065-eb499ae96f07',
        warehouseStockId: null,
        qty: 30,
        itemId: '4e28d97d-10cb-4513-abe8-ff30653ecacf',
        batch_name: 'Batch 6',
        expiry: new Date('2025-05-08 13:35:34'),
        status: true,
        pharmacyStockClearanceId: null,
        pharmacyStockId: '9496f5b9-e287-4997-a3d6-2cda157f5c6f',
        organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
        lot_name: 'cc43bcbb9f8f0a960a',
        pharmacyId: 'ad284d82-ca36-4b5f-8c4e-0d8833676346',
        warehouseId: '481ff14e-0b72-4a5c-84d1-c602ec5f65c9',
        transactionType: 'MOVEMENT',
      },
      {
        id: '7269d1de-963e-476c-878d-9f5b1d07a744',
        warehouseStockId: null,
        qty: 50,
        itemId: '64884fb3-c9bc-41ff-87ba-64c01af61962',
        batch_name: 'Batch 5',
        expiry: new Date('2025-07-23 13:35:15'),
        status: true,
        pharmacyStockClearanceId: null,
        pharmacyStockId: 'fbbf8eab-979a-4315-a0ce-aef179d97cd3',
        organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
        lot_name: '0f9542e08cf437c671',
        pharmacyId: 'ad284d82-ca36-4b5f-8c4e-0d8833676346',
        warehouseId: '481ff14e-0b72-4a5c-84d1-c602ec5f65c9',
        transactionType: 'MOVEMENT',
      },

      {
        id: 'c0411069-6840-4095-9782-56427637520b',
        warehouseStockId: null,
        qty: 15,
        itemId: '64884fb3-c9bc-41ff-87ba-64c01af61962',
        batch_name: 'Batch 5',
        expiry: null,
        status: true,
        pharmacyStockClearanceId: 'a5f4976e-c020-40ca-bb07-8b96c5c12cb9',
        pharmacyStockId: null,
        organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
        lot_name: 'b221a78569612bd48a',
        pharmacyId: 'ad284d82-ca36-4b5f-8c4e-0d8833676346',
        warehouseId: null,
        transactionType: 'EXIT',
      },
      {
        id: '51b9056b-c9c5-40e2-b6fd-67c9eeade8cf',
        warehouseStockId: null,
        qty: 10,
        itemId: '4e28d97d-10cb-4513-abe8-ff30653ecacf',
        batch_name: 'Batch 6',
        expiry: null,
        status: true,
        pharmacyStockClearanceId: 'c6eaf1f6-6b9e-4caf-a540-d4dfc8884f07',
        pharmacyStockId: null,
        organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
        lot_name: 'b221a78569612bd48a',
        pharmacyId: 'ad284d82-ca36-4b5f-8c4e-0d8833676346',
        warehouseId: null,
        transactionType: 'EXIT',
      },
      {
        id: 'd2a43614-8fd7-4b1f-8773-f6182e989717',
        warehouseStockId: null,
        qty: 5,
        itemId: '4e28d97d-10cb-4513-abe8-ff30653ecacf',
        batch_name: 'Batch 6',
        expiry: null,
        status: true,
        pharmacyStockClearanceId: 'bf8b222d-623f-448e-b81f-ef0da8f49c0a',
        pharmacyStockId: null,
        organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
        lot_name: 'dadbdff537fd4d574c',
        pharmacyId: 'ad284d82-ca36-4b5f-8c4e-0d8833676346',
        warehouseId: null,
        transactionType: 'EXIT',
      },
      {
        id: '5a5e60ac-0e2d-4068-826c-9a80e9d54804',
        warehouseStockId: null,
        qty: 10,
        itemId: '64884fb3-c9bc-41ff-87ba-64c01af61962',
        batch_name: 'Batch 5',
        expiry: null,
        status: true,
        pharmacyStockClearanceId: 'cec34889-ac37-4d88-890c-0e1fb0599ff8',
        pharmacyStockId: null,
        organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
        lot_name: 'ec1f551d19f8772cf0',
        pharmacyId: 'ad284d82-ca36-4b5f-8c4e-0d8833676346',
        warehouseId: null,
        transactionType: 'EXIT',
      },
      {
        id: '49f60218-b4fe-4b44-85b8-7854241e05f8',
        warehouseStockId: null,
        qty: 10,
        itemId: '7a7a942a-77cb-44ae-aae2-4d99131191eb',
        batch_name: 'Batch 8',
        expiry: null,
        status: true,
        pharmacyStockClearanceId: '95c4cbad-6a27-4548-8496-49d22ac43164',
        pharmacyStockId: null,
        organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
        lot_name: '78aa822577231b59f6',
        pharmacyId: 'bedb883d-1cea-4796-8e87-e10464c30347',
        warehouseId: null,
        transactionType: 'EXIT',
      },
      {
        id: 'b4e9a14f-8f2e-4928-86ee-116470a64a4c',
        warehouseStockId: null,
        qty: 15,
        itemId: '754a063a-f6f0-4c79-8adc-40e33e6ade8e',
        batch_name: 'Batch 7',
        expiry: null,
        status: true,
        pharmacyStockClearanceId: '8dffc5ce-b5f5-449b-8b0f-8a3578c19752',
        pharmacyStockId: null,
        organizationId: '88a6e3c6-60dd-4edd-a817-0aad743f75b3',
        lot_name: '78aa822577231b59f6',
        pharmacyId: 'bedb883d-1cea-4796-8e87-e10464c30347',
        warehouseId: null,
        transactionType: 'EXIT',
      },
    ],
  });
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
