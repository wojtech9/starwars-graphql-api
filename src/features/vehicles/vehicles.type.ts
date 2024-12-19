import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class PaginatedVehicle {
  @Field()
  uid: string;

  @Field()
  name: string;

  @Field()
  url: string;
}

@ObjectType()
class VehicleProperties {
  @Field()
  model: string;

  @Field()
  vehicle_class: string;

  @Field()
  manufacturer: string;

  @Field()
  cost_in_credits: string;

  @Field()
  length: string;

  @Field()
  crew: string;

  @Field()
  passengers: string;

  @Field()
  max_atmosphering_speed: string;

  @Field()
  cargo_capacity: string;

  @Field()
  consumables: string;

  @Field(() => [String])
  films: string[];

  @Field(() => [String])
  pilots: string[];

  @Field()
  created: string;

  @Field()
  edited: string;

  @Field()
  name: string;

  @Field()
  url: string;
}

@ObjectType()
export class Vehicle {
  @Field()
  description: string;

  @Field()
  uid: string;

  @Field()
  properties: VehicleProperties;
}
