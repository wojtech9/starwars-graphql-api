import { Resolver, Query, Args } from '@nestjs/graphql';
import { FilmsService } from './films.service';
import { Film } from './film.type';
import { NotFoundException } from '../../common/exceptions/not-found.exception';

@Resolver(() => Film)
export class FilmsResolver {
  constructor(private readonly filmsService: FilmsService) {}

  @Query(() => [Film])
  async films(
    @Args('page') page: number,
    @Args('filter', { nullable: true }) filter: string,
  ): Promise<Film[]> {
    const films = await this.filmsService.getFilms(page, filter);

    if (!films) {
      throw new NotFoundException('No films found');
    }

    return films;
  }

  @Query(() => Film)
  async film(@Args('id') id: string): Promise<Film> {
    const film = await this.filmsService.getFilm(id);;

    if (!film) {
      throw new NotFoundException('No film found');
    }

    return film;
  }
}