import { registerEnumType } from '@nestjs/graphql';

export enum BaseUnit {
  kg = 'kg',
  nos = 'nos',
  strip = 'strip',
  vial = 'vial',
}

registerEnumType(BaseUnit, {
  name: 'BaseUnit', // This name will be used in the GraphQL schema
});
