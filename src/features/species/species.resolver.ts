import { Resolver, Query, Args } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { SpeciesService } from './species.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Species, PaginatedSpecies } from './species.type';

@Resolver(() => Species)
export class SpeciesResolver {
  constructor(private readonly speciesService: SpeciesService) {}

  @Query(() => [PaginatedSpecies])
  async species(@Args('page', { type: () => Int, nullable: true }) page?: number): Promise<PaginatedSpecies[]> {
    if (page && page < 1) {
        throw new BadRequestException('Page number must be greater than 0');
    }

    try {
      const species = await this.speciesService.getSpecies(page);
      
      if (!species || species.length === 0) {
        throw new NotFoundException('No species found');
      }

      return species;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException('Failed to fetch species');
    }
  }

  @Query(() => Species)
  async speciesByFilter(@Args('filter') filter: string): Promise<Species> {
    if (!filter || filter.trim() === '') {
        throw new BadRequestException('Invalid filter format');
    }

    try {
      const species = await this.speciesService.getSpeciesByFilter(filter);
      
      if (!species) {
        throw new NotFoundException(`No species found for filter: ${filter}`);
      }

      return species[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(`Failed to fetch species by filter: ${filter}`);
    }
  }

  @Query(() => Species)
  async speciesById(@Args('id') id: string): Promise<Species> {
    if (!id || id.trim() === '') {
        throw new BadRequestException('Invalid ID format');
    }

    try {
      const species = await this.speciesService.getSpeciesById(id);

      if (!species) {
        throw new NotFoundException(`No species found by id: ${id}`);
      }

      return species;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(`Failed to fetch species by ID: ${id}`);
    }
  }
}