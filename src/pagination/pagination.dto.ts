import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  skip: number;

  @Field(() => Int, { nullable: true })
  take: number;
}
