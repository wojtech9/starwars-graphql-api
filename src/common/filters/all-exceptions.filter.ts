import { ExceptionFilter, Catch } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { NotFoundException } from '../exceptions/not-found.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any) {
    let message = 'Internal Server Error';
    let status = 500;

    if (exception instanceof NotFoundException) {
      message = exception.message || 'Element not found';
      status = 404;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    throw new GraphQLError(message, {
      extensions: {
        statusCode: status,
      },
    });
  }
}