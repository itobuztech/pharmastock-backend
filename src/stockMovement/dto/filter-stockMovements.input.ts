import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FilterStockMovementsInputs {
  @Field(() => Date, { nullable: true })
  startDate?: Date; // Field for filtering records from this date

  @Field(() => Date, { nullable: true })
  endDate?: Date; // Field for filtering records up to this date
}
