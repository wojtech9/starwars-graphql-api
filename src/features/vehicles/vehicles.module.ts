import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { VehiclesService } from './vehicles.service';
import { VehiclesResolver } from './vehicles.resolver';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [HttpModule],
  providers: [VehiclesService, VehiclesResolver, ConfigService],
  exports: [VehiclesService],
})
export class VehiclesModule {}