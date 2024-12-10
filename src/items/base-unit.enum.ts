import { registerEnumType } from '@nestjs/graphql';

export enum BaseUnit {
  Piece = 'Piece',
  Tablet = 'Tablet',
  Roll = 'Roll',
  Bottle = 'Bottle',
  Pack = 'Pack',
  Box = 'Box',
}

registerEnumType(BaseUnit, {
  name: 'BaseUnit', // This name will be used in the GraphQL schema
});
