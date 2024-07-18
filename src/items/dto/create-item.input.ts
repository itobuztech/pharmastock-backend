import { InputType, Field } from '@nestjs/graphql';
import { BaseUnit } from '../base-unit.enum';

@InputType()
export class CreateItemInput {
  @Field(() => BaseUnit)
  baseUnit: BaseUnit;

  @Field()
  instructions: string;

  @Field()
  name: string;

  @Field()
  mrpBaseUnit: number;

  @Field()
  wholesalePrice: number;

  @Field()
  hsnCode: string;

  @Field((type) => [String], { nullable: true })
  category?: string[];
}
