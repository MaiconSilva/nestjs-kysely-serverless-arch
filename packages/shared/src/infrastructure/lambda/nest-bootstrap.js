"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrBootstrap = getOrBootstrap;
exports.createLambdaHandler = createLambdaHandler;
exports.bootstrapForHttp = bootstrapForHttp;
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const common_1 = require("@nestjs/common");
const domain_error_filter_1 = require("../../presentation/filters/domain-error.filter");
/**
 * Cache the Nest app between warm Lambda invocations so bootstrap runs only
 * once per container. The Promise shape also protects against two concurrent
 * initial requests triggering double bootstrap.
 */
let cachedApp = null;
async function buildApp(rootModule, opts) {
    const adapter = new platform_fastify_1.FastifyAdapter({ logger: false, disableRequestLogging: true });
    const app = await core_1.NestFactory.create(rootModule, adapter, {
        logger: ['error', 'warn', 'log'],
    });
    if (opts.globalPrefix)
        app.setGlobalPrefix(opts.globalPrefix);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        ...(opts.validation ?? {}),
    }));
    app.useGlobalFilters(new domain_error_filter_1.DomainErrorFilter());
    await app.init();
    // Ensure the underlying Fastify instance is ready so we can dispatch to it.
    await app.getHttpAdapter().getInstance().ready();
    return app;
}
function getOrBootstrap(rootModule, opts = {}) {
    if (!cachedApp) {
        cachedApp = buildApp(rootModule, opts);
    }
    return cachedApp;
}
/**
 * Wraps a NestJS module into an API Gateway v2 Lambda handler. The Fastify
 * instance dispatches events directly via `inject()` — no Express bridge needed.
 */
function createLambdaHandler(rootModule, opts = {}) {
    return async (event) => {
        const app = await getOrBootstrap(rootModule, opts);
        const fastify = app.getHttpAdapter().getInstance();
        const method = event.requestContext?.http?.method ?? 'GET';
        const path = event.rawPath ?? '/';
        const query = event.rawQueryString ? `?${event.rawQueryString}` : '';
        const url = `${path}${query}`;
        const headers = {};
        for (const [k, v] of Object.entries(event.headers ?? {})) {
            if (v != null)
                headers[k.toLowerCase()] = String(v);
        }
        const payload = event.body
            ? event.isBase64Encoded
                ? Buffer.from(event.body, 'base64').toString('utf8')
                : event.body
            : undefined;
        const response = await fastify.inject({ method: method, url, headers, payload });
        return {
            statusCode: response.statusCode,
            headers: response.headers,
            body: response.payload,
            isBase64Encoded: false,
        };
    };
}
/**
 * Convenience helper used by integration tests to get a plain NestJS app
 * bound to a real HTTP listener (port 0).
 */
async function bootstrapForHttp(rootModule, port = 0, opts = {}) {
    const app = await buildApp(rootModule, opts);
    await app.listen(port, '0.0.0.0');
    return app;
}
//# sourceMappingURL=nest-bootstrap.js.map