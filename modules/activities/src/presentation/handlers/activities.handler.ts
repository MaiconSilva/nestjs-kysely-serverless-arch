import { createLambdaHandler } from '@todolist/shared';
import { ActivitiesModule } from '../activities.module';

export const handler = createLambdaHandler(ActivitiesModule);
