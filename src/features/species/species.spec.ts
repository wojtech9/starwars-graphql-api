import { Test, TestingModule } from '@nestjs/testing';
import { SpeciesResolver } from './species.resolver';
import { SpeciesService } from './species.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaginatedSpecies, Species } from './species.type';

describe('SpeciesResolver', () => {
  let resolver: SpeciesResolver;
  let speciesService: SpeciesService;

  const mockSpeciesService = {
    getSpecies: jest.fn(),
    getSpeciesByFilter: jest.fn(),
    getSpeciesById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpeciesResolver,
        {
          provide: SpeciesService,
          useValue: mockSpeciesService,
        },
      ],
    }).compile();

    resolver = module.get<SpeciesResolver>(SpeciesResolver);
    speciesService = module.get<SpeciesService>(SpeciesService);
  });

  describe('species', () => {
    it('should throw BadRequestException for invalid page number', async () => {
      await expect(resolver.species(-1)).rejects.toThrowError(BadRequestException);
    });

    it('should throw NotFoundException if no species found', async () => {
      mockSpeciesService.getSpecies.mockResolvedValue([]);
      await expect(resolver.species(1)).rejects.toThrowError(NotFoundException);
    });

    it('should return paginated species when valid page number is provided', async () => {
      const mockPaginatedSpecies: PaginatedSpecies[] = [
        {
          uid: '1',
          name: 'Human',
          url: 'http://example.com/species/1',
        },
      ];

      mockSpeciesService.getSpecies.mockResolvedValue(mockPaginatedSpecies);
      const result = await resolver.species(1);
      expect(result).toEqual(mockPaginatedSpecies);
    });
  });

  describe('speciesByFilter', () => {
    it('should throw BadRequestException for invalid filter', async () => {
      await expect(resolver.speciesByFilter('')).rejects.toThrowError(BadRequestException);
    });

    it('should throw NotFoundException if no species found for filter', async () => {
      mockSpeciesService.getSpeciesByFilter.mockResolvedValue(null);
      await expect(resolver.speciesByFilter('name=Human')).rejects.toThrowError(
        new NotFoundException('No species found for filter: name=Human'),
      );
    });

    it('should return species when valid filter is provided', async () => {
      const mockSpecies: Species = {
        uid: '1',
        description: 'A human species',
        properties: {
          classification: 'Mammal',
          designation: 'Sentient',
          average_height: '180',
          average_lifespan: '100',
          hair_colors: 'Black',
          skin_colors: 'Fair',
          eye_colors: 'Brown',
          homeworld: 'Earth',
          language: 'English',
          people: ['Human'],
          created: '2022-01-01',
          edited: '2022-01-02',
          name: 'Human',
          url: 'http://example.com/species/1',
        },
      };

      mockSpeciesService.getSpeciesByFilter.mockResolvedValue([mockSpecies]);
      const result = await resolver.speciesByFilter('name=Human');
      expect(result).toEqual(mockSpecies);
    });
  });

  describe('speciesById', () => {
    it('should throw BadRequestException for invalid ID', async () => {
      await expect(resolver.speciesById('')).rejects.toThrowError(BadRequestException);
    });

    it('should throw NotFoundException if no species found for given ID', async () => {
      mockSpeciesService.getSpeciesById.mockResolvedValue(null);
      await expect(resolver.speciesById('invalid-id')).rejects.toThrowError(
        new NotFoundException('No species found by id: invalid-id'),
      );
    });

    it('should return species when valid ID is provided', async () => {
      const mockSpecies: Species = {
        uid: '1',
        description: 'A human species',
        properties: {
          classification: 'Mammal',
          designation: 'Sentient',
          average_height: '180',
          average_lifespan: '100',
          hair_colors: 'Black',
          skin_colors: 'Fair',
          eye_colors: 'Brown',
          homeworld: 'Earth',
          language: 'English',
          people: ['Human'],
          created: '2022-01-01',
          edited: '2022-01-02',
          name: 'Human',
          url: 'http://example.com/species/1',
        },
      };

      mockSpeciesService.getSpeciesById.mockResolvedValue(mockSpecies);
      const result = await resolver.speciesById('1');
      expect(result).toEqual(mockSpecies);
    });
  });
});