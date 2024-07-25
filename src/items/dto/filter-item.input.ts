import { Field, InputType, Int } from '@nestjs/graphql';
import { BaseUnit } from '../base-unit.enum';

@InputType()
export class FilterItemInputs {
  @Field(() => BaseUnit, { nullable: true })
  baseUnit?: BaseUnit;

  @Field(() => Int, { nullable: true })
  wholeSalePrice?: number;

  @Field(() => Int, { nullable: true })
  mrpBaseUnit?: number;
}
