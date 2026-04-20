// Domain
export * from './domain/entity.base';
export * from './domain/value-object.base';
export * from './domain/domain-error.base';
export * from './domain/value-objects/tenant-id.vo';
export * from './domain/value-objects/user-id.vo';
export * from './domain/value-objects/email.vo';

// Infrastructure — database
export * from './infrastructure/database/kysely.config';
export * from './infrastructure/database/kysely.module';
export * from './infrastructure/database/tenant-context';
export type { DB, TenantsTable, UsersTable, ActivitiesTable } from './infrastructure/database/schema.types';

// Infrastructure — lambda
export * from './infrastructure/lambda/nest-bootstrap';

// Infrastructure — auth
export * from './infrastructure/auth/jwt-verifier';

// Presentation — guards
export * from './presentation/guards/jwt-auth.guard';
export * from './presentation/guards/role.guard';

// Presentation — decorators
export * from './presentation/decorators/current-user.decorator';
export * from './presentation/decorators/current-tenant.decorator';
export * from './presentation/decorators/roles.decorator';
export * from './presentation/decorators/public.decorator';

// Presentation — filters
export * from './presentation/filters/domain-error.filter';
