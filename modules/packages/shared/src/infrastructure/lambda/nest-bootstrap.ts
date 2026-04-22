import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import type { Type, INestApplication, ValidationPipeOptions } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
} from 'aws-lambda';
import { DomainErrorFilter } from '../../presentation/filters/domain-error.filter';

export type LambdaHandler = (
  event: APIGatewayProxyEventV2,
  context: Context,
) => Promise<APIGatewayProxyResultV2>;

interface BootstrapOptions {
  validation?: ValidationPipeOptions;
  globalPrefix?: string;
}

/**
 * Cache the Nest app between warm Lambda invocations so bootstrap runs only
 * once per container. The Promise shape also protects against two concurrent
 * initial requests triggering double bootstrap.
 */
let cachedApp: Promise<NestFastifyApplication> | null = null;

async function buildApp(
  rootModule: Type<unknown>,
  opts: BootstrapOptions,
): Promise<NestFastifyApplication> {
  const adapter = new FastifyAdapter({ logger: false, disableRequestLogging: true });
  const app = await NestFactory.create<NestFastifyApplication>(rootModule, adapter, {
    logger: ['error', 'warn', 'log'],
  });
  if (opts.globalPrefix) app.setGlobalPrefix(opts.globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      ...(opts.validation ?? {}),
    }),
  );
  app.useGlobalFilters(new DomainErrorFilter());
  await app.init();
  // Ensure the underlying Fastify instance is ready so we can dispatch to it.
  await app.getHttpAdapter().getInstance().ready();
  return app;
}

export function getOrBootstrap(
  rootModule: Type<unknown>,
  opts: BootstrapOptions = {},
): Promise<NestFastifyApplication> {
  if (!cachedApp) {
    cachedApp = buildApp(rootModule, opts);
  }
  return cachedApp;
}

/**
 * Wraps a NestJS module into an API Gateway v2 Lambda handler. The Fastify
 * instance dispatches events directly via `inject()` — no Express bridge needed.
 */
export function createLambdaHandler(
  rootModule: Type<unknown>,
  opts: BootstrapOptions = {},
): LambdaHandler {
  return async (event) => {
    const app = await getOrBootstrap(rootModule, opts);
    const fastify = app.getHttpAdapter().getInstance();

    const method = event.requestContext?.http?.method ?? 'GET';
    const path = event.rawPath ?? '/';
    const query = event.rawQueryString ? `?${event.rawQueryString}` : '';
    const url = `${path}${query}`;

    const headers: Record<string, string> = {};
    for (const [k, v] of Object.entries(event.headers ?? {})) {
      if (v != null) headers[k.toLowerCase()] = String(v);
    }

    const payload = event.body
      ? event.isBase64Encoded
        ? Buffer.from(event.body, 'base64').toString('utf8')
        : event.body
      : undefined;

    const response = await fastify.inject({ method: method as never, url, headers, payload });

    return {
      statusCode: response.statusCode,
      headers: response.headers as Record<string, string>,
      body: response.payload,
      isBase64Encoded: false,
    };
  };
}

/**
 * Convenience helper used by integration tests to get a plain NestJS app
 * bound to a real HTTP listener (port 0).
 */
export async function bootstrapForHttp(
  rootModule: Type<unknown>,
  port = 0,
  opts: BootstrapOptions = {},
): Promise<INestApplication> {
  const app = await buildApp(rootModule, opts);
  await app.listen(port, '0.0.0.0');
  return app;
}
