import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SpeciesService } from './species.service';
import { SpeciesResolver } from './species.resolver';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [HttpModule],
  providers: [SpeciesService, SpeciesResolver, ConfigService],
  exports: [SpeciesService],
})
export class SpeciesModule {}