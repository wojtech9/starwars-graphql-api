import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FilmProperties {
  @Field(() => [String])
  characters: string[];

  @Field(() => [String])
  planets: string[];

  @Field(() => [String])
  starships: string[];

  @Field(() => [String])
  vehicles: string[];

  @Field(() => [String])
  species: string[];

  @Field()
  created: string;

  @Field()
  edited: string;

  @Field()
  producer: string;

  @Field()
  title: string;

  @Field()
  episode_id: number;

  @Field()
  director: string;

  @Field()
  release_date: string;

  @Field()
  opening_crawl: string;

  @Field()
  url: string;
}

@ObjectType()
export class Film {
  @Field(() => FilmProperties)
  properties: FilmProperties;

  @Field()
  description: string;

  @Field()
  uid: string;
}