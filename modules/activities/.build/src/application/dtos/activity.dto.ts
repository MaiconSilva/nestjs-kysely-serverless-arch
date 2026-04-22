import { IsIn, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateActivityInput {
  @IsString()
  @Length(1, 500)
  title!: string;

  @IsOptional()
  @IsString()
  @Length(0, 4000)
  description?: string;
}

export class AssignActivityInput {
  @IsUUID()
  userId!: string;
}

export class ListActivitiesQuery {
  @IsOptional()
  @IsIn(['pending', 'assigned', 'completed'])
  status?: 'pending' | 'assigned' | 'completed';

  @IsOptional()
  @IsUUID()
  assigneeId?: string;
}

export interface ActivityOutput {
  id: string;
  tenantId: string;
  title: string;
  description: string | null;
  status: 'pending' | 'assigned' | 'completed';
  assigneeId: string | null;
  assignedAt: string | null;
  completedAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
