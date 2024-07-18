import { registerEnumType } from '@nestjs/graphql';

export enum BaseUnit {
  KG = 'kg',
  NUMBER = 'nos',
  STRIP = 'strip',
  VIAL = 'vial',
}

registerEnumType(BaseUnit, {
  name: 'BaseUnit', // This name will be used in the GraphQL schema
});
