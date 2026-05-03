import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(`HTTP`);
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, params, body } = req;
    let bodyToShow = { ...body };
    if ('password' in body) {
      bodyToShow = {
        ...bodyToShow,
        password: '[REDACTED]',
      };
    }
    if ('refreshToken' in body) {
      bodyToShow = {
        ...bodyToShow,
        refreshToken: '[REDACTED]',
      };
    }
    this.logger.log(
      `Log HTTP request: ${method} ${originalUrl} ${JSON.stringify(params)} ${JSON.stringify(bodyToShow)}`,
    );
    res.on('finish', () => {
      this.logger.log(
        `Log HTTP response: ${res.statusCode} ${Date.now() - startTime}ms`,
      );
    });

    next();
  }
}
