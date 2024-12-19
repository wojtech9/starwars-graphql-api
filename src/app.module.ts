import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import { APP_FILTER } from '@nestjs/core';

// Middlewares
import { RedisCacheMiddleware } from './common/middlewares/redis-cache.middleware';

// Features
import { FilmsModule } from './features/films/films.module';
import { SpeciesModule } from './features/species/species.module';
import { VehiclesModule } from './features/vehicles/vehicles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile: 'schema.gql',
    playground: true,
  }),
    HttpModule,
    FilmsModule,
    SpeciesModule,
    VehiclesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RedisCacheMiddleware).forRoutes('*');
  }
}
