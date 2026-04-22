import 'reflect-metadata';
import { type NestFastifyApplication } from '@nestjs/platform-fastify';
import type { Type, INestApplication, ValidationPipeOptions } from '@nestjs/common';
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda';
export type LambdaHandler = (event: APIGatewayProxyEventV2, context: Context) => Promise<APIGatewayProxyResultV2>;
interface BootstrapOptions {
    validation?: ValidationPipeOptions;
    globalPrefix?: string;
}
export declare function getOrBootstrap(rootModule: Type<unknown>, opts?: BootstrapOptions): Promise<NestFastifyApplication>;
/**
 * Wraps a NestJS module into an API Gateway v2 Lambda handler. The Fastify
 * instance dispatches events directly via `inject()` — no Express bridge needed.
 */
export declare function createLambdaHandler(rootModule: Type<unknown>, opts?: BootstrapOptions): LambdaHandler;
/**
 * Convenience helper used by integration tests to get a plain NestJS app
 * bound to a real HTTP listener (port 0).
 */
export declare function bootstrapForHttp(rootModule: Type<unknown>, port?: number, opts?: BootstrapOptions): Promise<INestApplication>;
export {};
//# sourceMappingURL=nest-bootstrap.d.ts.map