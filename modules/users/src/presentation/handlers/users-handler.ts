import { createLambdaHandler } from '@todolist/shared';
import { UsersModule } from '../users.module';

export const handler = createLambdaHandler(UsersModule);
