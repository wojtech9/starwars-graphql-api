import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheMiddleware implements NestMiddleware {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    });
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const key = `${req.originalUrl}`;
    const cached = await this.redis.get(key);

    if (cached)  return res.json(JSON.parse(cached));

    let responseBody: any;

    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      responseBody = body;
      return originalJson(body);
    };

    res.on('finish', async () => {
      try {
        if (responseBody && res.statusCode === 200) {
          await this.redis.set(key, JSON.stringify(responseBody), 'EX', 86400);  // Cache for 24 hours
        }
      } catch (error) {
        console.error('Error caching data to Redis:', error);
      }
    });

    next();
  }
}