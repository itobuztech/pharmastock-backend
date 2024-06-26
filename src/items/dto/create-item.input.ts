import { InputType, Field } from '@nestjs/graphql';
import { BaseUnit } from '../base-unit.enum';

@InputType()
export class CreateItemInput {
  @Field()
  baseUnit: BaseUnit;

  @Field()
  instructions: string;

  @Field({ nullable: true })
  sku?: string;

  @Field({ nullable: true })
  mrp_base_unit?: number;

  @Field({ nullable: true })
  wholesale_price?: number;

  @Field({ nullable: true })
  hsn_code?: string;

  @Field((type) => [String], { nullable: true })
  category?: string[];
}
