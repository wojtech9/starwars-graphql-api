import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Film } from './film.type';

@Injectable()
export class FilmsService {
  private readonly swapiBaseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.swapiBaseUrl = this.configService.get<string>('SWAPI_API_BASE_URL') || 'https://swapi.tech/api';
  }

  async getFilms(page: number, filter: string): Promise<Film[]> {
    let url = `${this.swapiBaseUrl}/films/?page=${page}`;

    if (filter) url += `&${filter}`;

    const response = await firstValueFrom(this.httpService.get(url));

    return response.data.result;
  }

  async getFilm(id: string): Promise<Film> {
    const url = `${this.swapiBaseUrl}/films/${id}/`;
    const response = await firstValueFrom(this.httpService.get(url));

    return response.data.result;
  }
}