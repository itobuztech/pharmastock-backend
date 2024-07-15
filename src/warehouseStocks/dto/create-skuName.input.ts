import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateSkuNameInput {
  @Field()
  itemId: string;

  @Field()
  warehouseId: string;

  @Field()
  organizationId: string;
}
