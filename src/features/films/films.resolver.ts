import { Resolver, Query, Args } from '@nestjs/graphql';
import { FilmsService } from './films.service';
import { Film } from './film.type';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@Resolver(() => Film)
export class FilmsResolver {
  constructor(private readonly filmsService: FilmsService) {}

  @Query(() => [Film])
  async films(@Args('filter', { nullable: true }) filter?: string): Promise<Film[]> {
    if (filter && filter.trim() === '') {
      throw new BadRequestException('Invalid filter.');
    }

    try {
      const films = await this.filmsService.getFilms(filter);


      if (!films || films.length === 0) {
        throw new NotFoundException('No films found.');
      }

      return films;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException('Fetching films failed.');
    }
  }

  @Query(() => Film)
  async film(@Args('id') id: string): Promise<Film> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('Invalid ID');
    }

    try {
      const film = await this.filmsService.getFilm(id);


      if (!film) {
        throw new NotFoundException('Film not found.');
      }

      return film;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException('Fetching error');
    }
  }
}