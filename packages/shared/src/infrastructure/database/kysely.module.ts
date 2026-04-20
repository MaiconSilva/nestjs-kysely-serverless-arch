import { Global, Module } from '@nestjs/common';
import { createKysely } from './kysely.config';

export const KYSELY = Symbol('KYSELY');

@Global()
@Module({
  providers: [
    {
      provide: KYSELY,
      useFactory: () => createKysely(),
    },
  ],
  exports: [KYSELY],
})
export class KyselyModule {}
