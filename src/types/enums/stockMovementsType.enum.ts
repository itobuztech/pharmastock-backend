import { registerEnumType } from '@nestjs/graphql';

export enum StockMovementsType {
  ENTRY = 'ENTRY',
  MOVEMENT = 'MOVEMENT',
  EXIT = 'EXIT',
}

registerEnumType(StockMovementsType, {
  name: 'StockMovementsType', // This name will be used in the GraphQL schema
});
