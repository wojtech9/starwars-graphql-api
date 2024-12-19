import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PaginatedSpecies, Species } from './species.type';

@Injectable()
export class SpeciesService {
  private readonly swapiBaseUrl: string;
  private readonly pageSize = 10;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.swapiBaseUrl = this.configService.get<string>('SWAPI_API_BASE_URL') || 'https://swapi.tech/api';
  }

  async getSpecies(page: number): Promise<PaginatedSpecies[]> {
    let url = `${this.swapiBaseUrl}/species`;

    if (page) {
      url += `?page=${page}&limit=${this.pageSize}`;
    }
    
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      console.log(response.data)
      return response.data.results;
    } catch (error) {
      throw new Error('Service unavailable');
    }
  }

  async getSpeciesByFilter(filter: string): Promise<Species> {
    let url = `${this.swapiBaseUrl}/species?${filter}`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));

      return response.data.result;
    } catch (error) {
      throw new Error('Service unavailable');
    }
  }

  async getSpeciesById(id: string): Promise<Species> {
    let url = `${this.swapiBaseUrl}/species/${id}`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));

      return response.data.result;
    } catch (error) {
      throw new Error('Service unavailable');
    }
  }
}
