export enum UserCapabilities {
    VIEW = "VIEW",
    EDIT = "EDIT",
    CREATE = "CREATE",
    EXECUTE = "EXECUTE",
    DELETE = "DELETE",
    DETAILS = "DETAILS",
}

export enum UserPermissionNames {
    NOTES = "PROFILE",
    USER = "USER_MANAGEMENT",
}

const PrivilegesList: {
    [key in UserPermissionNames]: {
        LABEL: string;
        ORDER: number;
        CAPABILITIES: Partial<
            {
                [key2 in UserCapabilities]: number;
            }
        >;
    };
} = {
    PROFILE: {
        LABEL: "Profile",
        ORDER: 1,
        CAPABILITIES: {
            VIEW: 101,
            EDIT: 102
        }
    },
    USER_MANAGEMENT: {
        LABEL: "User Management",
        ORDER: 2,
        CAPABILITIES: {
            VIEW: 201,
            CREATE: 202,
            EDIT: 203,
            DELETE: 204,
        },
    },
}

export { PrivilegesList };