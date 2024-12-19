import { Resolver, Query, Args } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { VehiclesService } from './vehicles.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Vehicle, PaginatedVehicle } from './vehicles.type';

@Resolver(() => Vehicle)
export class VehiclesResolver {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Query(() => [PaginatedVehicle])
  async vehicles(@Args('page', { type: () => Int, nullable: true }) page?: number): Promise<PaginatedVehicle[]> {
    if (page && page < 1) {
      throw new BadRequestException('Page number must be greater than 0');
    }

    try {
      const vehicles = await this.vehiclesService.getVehicles(page);

      if (!vehicles || vehicles.length === 0) {
        throw new NotFoundException('No vehicles found');
      }

      return vehicles;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException('Failed to fetch vehicles');
    }
  }

  @Query(() => Vehicle)
  async vehicleByFilter(@Args('filter') filter: string): Promise<Vehicle> {
    if (!filter || filter.trim() === '') {
      throw new BadRequestException('Invalid filter format');
    }

    try {
      const vehicle = await this.vehiclesService.getVehicleByFilter(filter);

      if (!vehicle) {
        throw new NotFoundException(`No vehicle found for filter: ${filter}`);
      }

      return vehicle[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(`Failed to fetch vehicle by filter: ${filter}`);
    }
  }

  @Query(() => Vehicle)
  async vehicleById(@Args('id') id: string): Promise<Vehicle> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('Invalid ID format');
    }

    try {
      const vehicle = await this.vehiclesService.getVehicleById(id);

      if (!vehicle) {
        throw new NotFoundException(`No vehicle found by id: ${id}`);
      }

      return vehicle;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(`Failed to fetch vehicle by ID: ${id}`);
    }
  }
}
