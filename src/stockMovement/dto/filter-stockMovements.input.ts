import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { StockMovementsType } from '../../types/enums/stock-movements-type.enum';

@InputType()
export class FilterStockMovementsInputs {
  @Field(() => Date, { nullable: true })
  startDate?: Date; // Field for filtering records from this date

  @Field(() => Date, { nullable: true })
  endDate?: Date; // Field for filtering records up to this date

  @Field(() => ID, { nullable: true })
  warehouseId?: string; // Field for filtering records for warehouse!

  @Field(() => StockMovementsType, { nullable: true })
  transactionType?: StockMovementsType; // Field for filtering records for warehouse!
}
