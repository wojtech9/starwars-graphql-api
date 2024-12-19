import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesResolver } from './vehicles.resolver';
import { VehiclesService } from './vehicles.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaginatedVehicle, Vehicle } from './vehicles.type';

describe('VehiclesResolver', () => {
  let resolver: VehiclesResolver;
  let vehiclesService: VehiclesService;

  const mockVehiclesService = {
    getVehicles: jest.fn(),
    getVehicleByFilter: jest.fn(),
    getVehicleById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesResolver,
        {
          provide: VehiclesService,
          useValue: mockVehiclesService,
        },
      ],
    }).compile();

    resolver = module.get<VehiclesResolver>(VehiclesResolver);
    vehiclesService = module.get<VehiclesService>(VehiclesService);
  });

  describe('vehicles', () => {
    it('should throw BadRequestException for invalid page number', async () => {
      await expect(resolver.vehicles(-1)).rejects.toThrowError(BadRequestException);
    });

    it('should throw NotFoundException if no vehicles found', async () => {
      mockVehiclesService.getVehicles.mockResolvedValue([]);
      await expect(resolver.vehicles(1)).rejects.toThrowError(NotFoundException);
    });

    it('should return paginated vehicles when valid page number is provided', async () => {
      const mockPaginatedVehicles: PaginatedVehicle[] = [
        {
          uid: '33',
          name: 'Vulture Droid',
          url: 'https://www.swapi.tech/api/vehicles/33',
        },
      ];

      mockVehiclesService.getVehicles.mockResolvedValue(mockPaginatedVehicles);
      const result = await resolver.vehicles(1);
      expect(result).toEqual(mockPaginatedVehicles);
    });
  });

  describe('vehicleByFilter', () => {
    it('should throw BadRequestException for invalid filter', async () => {
      await expect(resolver.vehicleByFilter('')).rejects.toThrowError(BadRequestException);
    });

    it('should throw NotFoundException if no vehicle found for filter', async () => {
      mockVehiclesService.getVehicleByFilter.mockResolvedValue(null);
      await expect(resolver.vehicleByFilter('name=Vulture Droid')).rejects.toThrowError(
        new NotFoundException('No vehicle found for filter: name=Vulture Droid'),
      );
    });

    it('should return vehicle when valid filter is provided', async () => {
      const mockVehicle: Vehicle = {
        uid: '33',
        description: 'A vehicle',
        properties: {
          model: 'Vulture-class droid starfighter',
          vehicle_class: 'starfighter',
          manufacturer: 'Haor Chall Engineering, Baktoid Armor Workshop',
          cost_in_credits: 'unknown',
          length: '3.5',
          crew: '0',
          passengers: '0',
          max_atmosphering_speed: '1200',
          cargo_capacity: '0',
          consumables: 'none',
          films: [],
          pilots: [],
          created: '2020-09-17T17:46:31.415Z',
          edited: '2020-09-17T17:46:31.415Z',
          name: 'Vulture Droid',
          url: 'https://www.swapi.tech/api/vehicles/33',
        },
      };

      mockVehiclesService.getVehicleByFilter.mockResolvedValue([mockVehicle]);
      const result = await resolver.vehicleByFilter('name=Vulture Droid');
      expect(result).toEqual(mockVehicle);
    });
  });

  describe('vehicleById', () => {
    it('should throw BadRequestException for invalid ID', async () => {
      await expect(resolver.vehicleById('')).rejects.toThrowError(BadRequestException);
    });

    it('should throw NotFoundException if no vehicle found for given ID', async () => {
      mockVehiclesService.getVehicleById.mockResolvedValue(null);
      await expect(resolver.vehicleById('invalid-id')).rejects.toThrowError(
        new NotFoundException('No vehicle found by id: invalid-id'),
      );
    });

    it('should return vehicle when valid ID is provided', async () => {
      const mockVehicle: Vehicle = {
        uid: '33',
        description: 'A vehicle',
        properties: {
          model: 'Vulture-class droid starfighter',
          vehicle_class: 'starfighter',
          manufacturer: 'Haor Chall Engineering, Baktoid Armor Workshop',
          cost_in_credits: 'unknown',
          length: '3.5',
          crew: '0',
          passengers: '0',
          max_atmosphering_speed: '1200',
          cargo_capacity: '0',
          consumables: 'none',
          films: [],
          pilots: [],
          created: '2020-09-17T17:46:31.415Z',
          edited: '2020-09-17T17:46:31.415Z',
          name: 'Vulture Droid',
          url: 'https://www.swapi.tech/api/vehicles/33',
        },
      };

      mockVehiclesService.getVehicleById.mockResolvedValue(mockVehicle);
      const result = await resolver.vehicleById('33');
      expect(result).toEqual(mockVehicle);
    });
  });
});
