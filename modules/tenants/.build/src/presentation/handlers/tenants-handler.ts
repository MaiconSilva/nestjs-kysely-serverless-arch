import { createLambdaHandler } from '@todolist/shared';
import { TenantsModule } from '../tenants.module';

export const handler = createLambdaHandler(TenantsModule);
