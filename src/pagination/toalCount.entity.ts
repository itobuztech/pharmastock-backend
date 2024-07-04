import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TotalCount {
  @Field(() => Number)
  total: Number;
}
