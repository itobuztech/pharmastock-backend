import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class BatchStockMovementsInput {
  @Field(() => String)
  batchName: String;
}
