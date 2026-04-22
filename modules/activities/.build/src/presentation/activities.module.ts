import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, KyselyModule, RoleGuard } from '@todolist/shared';
import { AssignActivityUseCase } from '../application/use-cases/assign-activity.use-case';
import { CompleteActivityUseCase } from '../application/use-cases/complete-activity.use-case';
import { CreateActivityUseCase } from '../application/use-cases/create-activity.use-case';
import { ListActivitiesUseCase } from '../application/use-cases/list-activities.use-case';
import { ACTIVITY_REPOSITORY } from '../domain/repositories/activity.repository';
import { USER_LOOKUP } from '../domain/services/user-lookup';
import { ActivityKyselyRepository } from '../infrastructure/repositories/activity.kysely.repository';
import { KyselyUserLookup } from '../infrastructure/services/kysely-user-lookup';
import { ActivitiesController } from './controllers/activities.controller';

@Module({
  imports: [KyselyModule],
  controllers: [ActivitiesController],
  providers: [
    CreateActivityUseCase,
    ListActivitiesUseCase,
    AssignActivityUseCase,
    CompleteActivityUseCase,
    { provide: ACTIVITY_REPOSITORY, useClass: ActivityKyselyRepository },
    { provide: USER_LOOKUP, useClass: KyselyUserLookup },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class ActivitiesModule {}
