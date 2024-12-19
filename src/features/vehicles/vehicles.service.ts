import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PaginatedVehicle, Vehicle } from './vehicles.type';

@Injectable()
export class VehiclesService {
  private readonly swapiBaseUrl: string;
  private readonly pageSize = 10;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.swapiBaseUrl = this.configService.get<string>('SWAPI_API_BASE_URL') || 'https://swapi.tech/api';
  }

  async getVehicles(page: number): Promise<PaginatedVehicle[]> {
    let url = `${this.swapiBaseUrl}/vehicles`;

    if (page) {
      url += `?page=${page}&limit=${this.pageSize}`;
    }

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      console.log(response.data);
      return response.data.results;
    } catch (error) {
      throw new Error('Service unavailable');
    }
  }

  async getVehicleByFilter(filter: string): Promise<Vehicle> {
    let url = `${this.swapiBaseUrl}/vehicles?${filter}`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));

      return response.data.result;
    } catch (error) {
      throw new Error('Service unavailable');
    }
  }

  async getVehicleById(id: string): Promise<Vehicle> {
    let url = `${this.swapiBaseUrl}/vehicles/${id}`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));

      return response.data.result;
    } catch (error) {
      throw new Error('Service unavailable');
    }
  }
}
