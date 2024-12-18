import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RedisCacheMiddleware } from './common/middlewares/redis-cache.middleware';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RedisCacheMiddleware).forRoutes('*');
  }
}
