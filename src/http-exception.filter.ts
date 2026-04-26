import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ForbiddenError } from './errors/ForbiddenError';
import { NotFoundError } from './errors/NotFoundError';
import { UnauthorizedError } from './errors/UnauthorizedError';
import { ValidationError } from './errors/ValidationError';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  logger = new Logger();
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    if (
      exception instanceof ForbiddenError ||
      exception instanceof NotFoundError ||
      exception instanceof UnauthorizedError ||
      exception instanceof ValidationError
    ) {
      const status = exception.statusCode;
      console.log('errorText', exception.errorText);
      this.logger.error(exception.message, exception.stack);
      response.status(status).json({
        statusCode: status,
        error: exception.errorText,
        message: exception.message,
      });
    } else if (exception instanceof HttpException) {
      const status = exception.getStatus();
      this.logger.error(exception.message, exception.stack);
      if (typeof exception.getResponse() === 'string') {
        response.status(status).json({
          statusCode: status,
          error: exception.message,
          message: exception.getResponse(),
        });
      }

      if (typeof exception.getResponse() === 'object') {
        response.status(status).json(exception.getResponse());
      }
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
      const status = 500;
      response.status(status).json({
        statusCode: status,
        error: 'Internal Server Error',
        message: exception.message,
      });
    } else {
      response.status(500).json({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Unknown error occurred',
      });
    }
  }
}
