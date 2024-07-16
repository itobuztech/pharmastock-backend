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

  @Field({ nullable: true })
  mrpBaseUnit?: number;

  @Field({ nullable: true })
  wholesalePrice?: number;

  @Field({ nullable: true })
  hsnCode?: string;

  @Field((type) => [String], { nullable: true })
  category?: string[];
}
