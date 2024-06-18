import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateWarehouseInput {
  @Field()
  location: string;

  @Field()
  area: string;

  @Field({ nullable: true })
  organizationId?: string;

  @Field({ nullable: true })
  adminId?: string;
}
