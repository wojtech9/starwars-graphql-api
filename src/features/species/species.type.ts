import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class PaginatedSpecies {
  @Field()
  uid: string;

  @Field()
  name: string;

  @Field()
  url: string;
}

@ObjectType()
class SpeciesProperties {
  @Field()
  classification: string;

  @Field()
  designation: string;

  @Field()
  average_height: string;

  @Field()
  average_lifespan: string;

  @Field()
  hair_colors: string;

  @Field()
  skin_colors: string;

  @Field()
  eye_colors: string;

  @Field()
  homeworld: string;

  @Field()
  language: string;

  @Field(() => [String])
  people: string[];

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
export class Species {
  @Field()
  description: string;

  @Field()
  uid: string;

  @Field()
  properties: SpeciesProperties;
}