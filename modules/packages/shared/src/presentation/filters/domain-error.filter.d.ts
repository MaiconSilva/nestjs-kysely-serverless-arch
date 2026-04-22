import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
/**
 * Maps any thrown `DomainError` subclass to HTTP using its declared `httpStatus`
 * and `code`. Also lets NestJS `HttpException`s pass through cleanly.
 */
export declare class DomainErrorFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: unknown, host: ArgumentsHost): void;
}
//# sourceMappingURL=domain-error.filter.d.ts.map