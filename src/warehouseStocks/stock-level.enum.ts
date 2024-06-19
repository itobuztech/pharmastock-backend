import { registerEnumType } from '@nestjs/graphql';

export enum StockLevel {
  LOW = 'LOW',
  HIGH = 'HIGH',
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
}

registerEnumType(StockLevel, {
  name: 'StockLevel', // This name will be used in the GraphQL schema
});
