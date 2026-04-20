import { IsString, Length, Matches } from 'class-validator';

export class CreateTenantInput {
  @IsString()
  @Length(1, 255)
  name!: string;

  @IsString()
  @Matches(/^[a-z0-9](?:[a-z0-9-]{0,98}[a-z0-9])?$/, {
    message: 'slug must be lowercase alphanumeric with optional dashes, 1-100 chars',
  })
  slug!: string;
}

export interface TenantOutput {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  createdAt: string;
}
