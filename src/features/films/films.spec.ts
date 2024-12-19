import { Test, TestingModule } from '@nestjs/testing';
import { FilmsResolver } from './films.resolver';
import { FilmsService } from './films.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Film } from './film.type';

describe('FilmsResolver', () => {
  let resolver: FilmsResolver;
  let filmsService: FilmsService;

  const mockFilmsService = {
    getFilms: jest.fn(),
    getFilm: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsResolver,
        FilmsService,
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    resolver = module.get<FilmsResolver>(FilmsResolver);
    filmsService = module.get<FilmsService>(FilmsService);
  });

  describe('films', () => {
    it('should throw BadRequestException for invalid filter (empty or only spaces)', async () => {
      await expect(resolver.films('  ')).rejects.toThrowError(BadRequestException);
    });

    it('should throw NotFoundException if no films found', async () => {
      mockFilmsService.getFilms.mockResolvedValue([]);

      await expect(resolver.films('title=A New Hope')).rejects.toThrowError(NotFoundException);
    });

    it('should return an array of films when valid filter is provided', async () => {
      const films: Film[] = [
        {
          properties: {
            title: 'A New Hope',
            release_date: '1977-05-25',
            producer: 'George Lucas',
            director: 'George Lucas',
            episode_id: 1,
            opening_crawl: 'A long time ago in a galaxy far, far away...',
            characters: ['Luke Skywalker', 'Han Solo'],
            planets: ['Tatooine'],
            starships: ['Millennium Falcon'],
            vehicles: ['Speeder'],
            species: ['Human'],
            created: '1977-01-01',
            edited: '1977-01-02',
            url: 'https://swapi.tech/api/films/1',
          },
          description: 'The first film of the Star Wars saga.',
          uid: '1',
        },
      ];

      mockFilmsService.getFilms.mockResolvedValue(films);

      const result = await resolver.films('title=A New Hope');
      expect(result).toEqual(films);
    });
  });

  describe('film', () => {
    it('should throw BadRequestException for invalid ID (empty or only spaces)', async () => {
      await expect(resolver.film('  ')).rejects.toThrowError(BadRequestException);
    });

    it('should throw NotFoundException if film not found', async () => {
      mockFilmsService.getFilm.mockResolvedValue(null);

      await expect(resolver.film('invalid-id')).rejects.toThrowError(NotFoundException);
    });

    it('should return film when a valid id is provided', async () => {
      const film: Film = {
        properties: {
          title: 'A New Hope',
          release_date: '1977-05-25',
          producer: 'George Lucas',
          director: 'George Lucas',
          episode_id: 1,
          opening_crawl: 'A long time ago in a galaxy far, far away...',
          characters: ['Luke Skywalker', 'Han Solo'],
          planets: ['Tatooine'],
          starships: ['Millennium Falcon'],
          vehicles: ['Speeder'],
          species: ['Human'],
          created: '1977-01-01',
          edited: '1977-01-02',
          url: 'https://swapi.tech/api/films/1',
        },
        description: 'The first film of the Star Wars saga.',
        uid: '1',
      };

      mockFilmsService.getFilm.mockResolvedValue(film);

      const result = await resolver.film('1');
      expect(result).toEqual(film);
    });
  });
});
