"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DomainErrorFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainErrorFilter = void 0;
const common_1 = require("@nestjs/common");
const domain_error_base_1 = require("../../domain/domain-error.base");
/**
 * Maps any thrown `DomainError` subclass to HTTP using its declared `httpStatus`
 * and `code`. Also lets NestJS `HttpException`s pass through cleanly.
 */
let DomainErrorFilter = DomainErrorFilter_1 = class DomainErrorFilter {
    logger = new common_1.Logger(DomainErrorFilter_1.name);
    catch(exception, host) {
        const reply = host.switchToHttp().getResponse();
        if (exception instanceof domain_error_base_1.DomainError) {
            reply.status(exception.httpStatus).send({
                error: exception.code,
                message: exception.message,
            });
            return;
        }
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            const res = exception.getResponse();
            const payload = typeof res === 'string' ? { message: res } : res;
            reply.status(status).send(payload);
            return;
        }
        // eslint-disable-next-line no-console
        console.error('[DomainErrorFilter] Unhandled exception:', exception);
        this.logger.error('Unhandled exception', exception instanceof Error ? exception.stack : String(exception));
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
};
exports.DomainErrorFilter = DomainErrorFilter;
exports.DomainErrorFilter = DomainErrorFilter = DomainErrorFilter_1 = __decorate([
    (0, common_1.Catch)()
], DomainErrorFilter);
//# sourceMappingURL=domain-error.filter.js.map