export enum UserCapabilities {
  VIEW = 'VIEW',
  EDIT = 'EDIT',
  CREATE = 'CREATE',
  EXECUTE = 'EXECUTE',
  DELETE = 'DELETE',
  DETAILS = 'DETAILS',
}

export enum UserPermissionNames {
  PROFILE = 'PROFILE',
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  USER_PERMISSION = 'USER_PERMISSION',
  ORGANIZATION_MANAGEMENT = 'ORGANIZATION_MANAGEMENT',
  WAREHOUSE_MANAGEMENT = 'WAREHOUSE_MANAGEMENT',
  ITEM_CATEGORIES_MANAGEMENT = 'ITEM_CATEGORIES_MANAGEMENT',
  ITEM_MANAGEMENT = 'ITEM_MANAGEMENT',
  PHARMACY_MANAGEMENT = 'PHARMACY_MANAGEMENT',
  STOCK_MANAGEMENT_ADMIN = 'STOCK_MANAGEMENT_ADMIN',
  STOCK_MANAGEMENT_STAFF = 'STOCK_MANAGEMENT_STAFF',
  STAFF_MANAGEMENT = 'STAFF_MANAGEMENT',
}

export type PrivilegesListType = {
  [key in UserPermissionNames]: {
    LABEL: string;
    ORDER: number;
    CAPABILITIES: Partial<{
      [key2 in UserCapabilities]: number;
    }>;
  };
};

const PrivilegesList: PrivilegesListType = {
  PROFILE: {
    LABEL: 'Profile',
    ORDER: 1,
    CAPABILITIES: {
      VIEW: 101,
      EDIT: 102,
    },
  },
  USER_MANAGEMENT: {
    LABEL: 'User Management',
    ORDER: 2,
    CAPABILITIES: {
      VIEW: 111,
      CREATE: 112,
      EDIT: 113,
      DELETE: 114,
    },
  },
  USER_PERMISSION: {
    LABEL: 'User Permissions',
    ORDER: 3,
    CAPABILITIES: {
      VIEW: 121,
      CREATE: 122,
      EDIT: 123,
      DELETE: 124,
    },
  },
  ORGANIZATION_MANAGEMENT: {
    LABEL: 'Organization Management',
    ORDER: 4,
    CAPABILITIES: {
      VIEW: 141,
      CREATE: 142,
      EDIT: 143,
      DELETE: 144,
    },
  },
  WAREHOUSE_MANAGEMENT: {
    LABEL: 'Warehouse Management',
    ORDER: 5,
    CAPABILITIES: {
      VIEW: 151,
      CREATE: 152,
      EDIT: 153,
      DELETE: 154,
    },
  },
  ITEM_CATEGORIES_MANAGEMENT: {
    LABEL: 'Item Categories Management',
    ORDER: 6,
    CAPABILITIES: {
      VIEW: 161,
      CREATE: 162,
      EDIT: 163,
      DELETE: 164,
    },
  },
  ITEM_MANAGEMENT: {
    LABEL: 'Item Management',
    ORDER: 7,
    CAPABILITIES: {
      VIEW: 171,
      CREATE: 172,
      EDIT: 173,
      DELETE: 174,
    },
  },
  STOCK_MANAGEMENT_ADMIN: {
    LABEL: 'Stock Management Admin',
    ORDER: 8,
    CAPABILITIES: {
      VIEW: 181,
      CREATE: 182,
      EDIT: 183,
      DELETE: 184,
    },
  },
  PHARMACY_MANAGEMENT: {
    LABEL: 'Pharmacy Management',
    ORDER: 9,
    CAPABILITIES: {
      VIEW: 191,
      CREATE: 192,
      EDIT: 193,
      DELETE: 194,
    },
  },
  STAFF_MANAGEMENT: {
    LABEL: 'Staff Management',
    ORDER: 10,
    CAPABILITIES: {
      VIEW: 201,
      CREATE: 202,
      EDIT: 203,
      DELETE: 204,
    },
  },
  STOCK_MANAGEMENT_STAFF: {
    LABEL: 'Stock Management Staff',
    ORDER: 11,
    CAPABILITIES: {
      VIEW: 211,
      CREATE: 212,
      EDIT: 213,
      DELETE: 214,
    },
  },
};

export { PrivilegesList };
