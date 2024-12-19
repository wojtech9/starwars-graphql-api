import { Test, TestingModule } from '@nestjs/testing';
import { FilmsResolver } from './films.resolver';
import { FilmsService } from './films.service';
import { Film } from './film.type';
import { NotFoundException } from '../../common/exceptions/not-found.exception';

describe('FilmsResolver', () => {
  let resolver: FilmsResolver;
  let service: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsResolver,
        {
          provide: FilmsService,
          useValue: {
            getFilms: jest.fn(),
            getFilm: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<FilmsResolver>(FilmsResolver);
    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('films', () => {
    it('should return a list of films', async () => {
      const filmsMock: Film[] = [
        {
          properties: {
            title: 'A New Hope',
            episode_id: 4,
            director: 'George Lucas',
            release_date: '1977-05-25',
            opening_crawl: 'It is a period of civil war...',
            characters: [],
            planets: [],
            starships: [],
            vehicles: [],
            species: [],
            created: '1977-01-01',
            edited: '1977-01-01',
            producer: 'Gary Kurtz',
            url: 'https://swapi.tech/api/films/1',
          },
          description: 'A Star Wars Film',
          uid: '1',
        },
      ];

      jest.spyOn(service, 'getFilms').mockResolvedValue(filmsMock);

      const films = await resolver.films(1, 'filter=title:A New Hope');
      expect(films.length).toBeGreaterThan(0);
      expect(films[0].properties.title).toBe('A New Hope');
    });

    it('should throw an exception if no films are found', async () => {
      jest.spyOn(service, 'getFilms').mockResolvedValue([]);

      try {
        await resolver.films(1, 'filter=title:Nonexistent Film');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('No films found');
      }
    });
  });

  describe('film', () => {
    it('should return a single film', async () => {
      const filmMock: Film = {
        properties: {
          title: 'Return of the Jedi',
          episode_id: 6,
          director: 'Richard Marquand',
          release_date: '1983-05-25',
          opening_crawl: 'Luke Skywalker has returned...',
          characters: [],
          planets: [],
          starships: [],
          vehicles: [],
          species: [],
          created: '1983-01-01',
          edited: '1983-01-01',
          producer: 'Howard G. Kazanjian',
          url: 'https://swapi.tech/api/films/3',
        },
        description: 'A Star Wars Film',
        uid: '3',
      };

      jest.spyOn(service, 'getFilm').mockResolvedValue(filmMock);

      const film = await resolver.film('3');
      expect(film.properties.title).toBe('Return of the Jedi');
      expect(film.properties.episode_id).toBe(6);
      expect(film.properties.director).toBe('Richard Marquand');
    });

    it('should throw an exception if no film is found', async () => {
      jest.spyOn(service, 'getFilm').mockResolvedValue(null);

      try {
        await resolver.film('999');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('No film found');
      }
    });
  });
});