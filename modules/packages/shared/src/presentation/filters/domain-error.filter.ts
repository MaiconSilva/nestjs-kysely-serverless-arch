import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { DomainError } from '../../domain/domain-error.base';

/**
 * Maps any thrown `DomainError` subclass to HTTP using its declared `httpStatus`
 * and `code`. Also lets NestJS `HttpException`s pass through cleanly.
 */
@Catch()
export class DomainErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainErrorFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const reply = host.switchToHttp().getResponse<FastifyReply>();

    if (exception instanceof DomainError) {
      reply.status(exception.httpStatus).send({
        error: exception.code,
        message: exception.message,
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      const payload = typeof res === 'string' ? { message: res } : res;
      reply.status(status).send(payload);
      return;
    }

    // Also log to stdout so errors are visible when Nest's log buffer is enabled.
    // eslint-disable-next-line no-console
    console.error('[DomainErrorFilter] Unhandled exception:', exception);
    this.logger.error(
      'Unhandled exception',
      exception instanceof Error ? exception.stack : String(exception),
    );
    const isDev = process.env.NODE_ENV !== 'production';
    reply.status(500).send({
      error: 'INTERNAL_ERROR',
      message: isDev
        ? exception instanceof Error
          ? exception.message
          : String(exception)
        : 'Internal server error',
    });
  }
}
