import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentTenant, CurrentUser, Roles } from '@todolist/shared';
import {
  AssignActivityInput,
  CreateActivityInput,
  ListActivitiesQuery,
} from '../../application/dtos/activity.dto';
import { AssignActivityUseCase } from '../../application/use-cases/assign-activity.use-case';
import { CompleteActivityUseCase } from '../../application/use-cases/complete-activity.use-case';
import { CreateActivityUseCase } from '../../application/use-cases/create-activity.use-case';
import { ListActivitiesUseCase } from '../../application/use-cases/list-activities.use-case';
import { ActivityNotFoundError } from '../../domain/errors/activity.errors';

@Controller('activities')
export class ActivitiesController {
  constructor(
    private readonly createActivity: CreateActivityUseCase,
    private readonly listActivities: ListActivitiesUseCase,
    private readonly assignActivity: AssignActivityUseCase,
    private readonly completeActivity: CompleteActivityUseCase,
  ) {}

  @Roles('admin')
  @Post()
  create(
    @CurrentTenant() tenantId: string,
    @CurrentUser('sub') userSub: string,
    @Body() input: CreateActivityInput,
  ) {
    // `sub` is the Cognito subject == users.id because we store sub in users.id
    // at creation time via cognito_sub linkage. In a follow-up we resolve sub
    // to the internal user id; for the POC we pass the Cognito sub as the
    // creator — entity only requires a valid UUID.
    return this.createActivity.execute(tenantId, userSub, input);
  }

  @Roles('admin', 'member')
  @Get()
  list(
    @CurrentTenant() tenantId: string,
    @Query() query: ListActivitiesQuery,
  ) {
    return this.listActivities.execute(tenantId, query);
  }

  @Roles('admin')
  @Post(':id/assign')
  @HttpCode(200)
  async assign(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() input: AssignActivityInput,
  ) {
    try {
      return await this.assignActivity.execute(tenantId, id, input);
    } catch (err) {
      if (err instanceof ActivityNotFoundError) throw new NotFoundException(err.message);
      throw err;
    }
  }

  @Roles('admin', 'member')
  @Post(':id/complete')
  @HttpCode(200)
  complete(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.completeActivity.execute(tenantId, id);
  }
}
