-- ACTIVITIES
CREATE TABLE activities (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  title        TEXT NOT NULL,
  description  TEXT,
  status       VARCHAR(20) NOT NULL DEFAULT 'pending',
  assignee_id  UUID REFERENCES users(id),
  assigned_at  TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by   UUID NOT NULL REFERENCES users(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (status IN ('pending', 'assigned', 'completed'))
);

CREATE INDEX idx_activities_tenant   ON activities(tenant_id);
CREATE INDEX idx_activities_assignee ON activities(assignee_id);
CREATE INDEX idx_activities_status   ON activities(tenant_id, status);

-- Partial unique index: at most ONE active (pending|assigned) activity per assignee.
-- Enforces the "each user has at most 1 activity assigned" rule at the DB level.
CREATE UNIQUE INDEX idx_activities_one_active_per_user
  ON activities(assignee_id)
  WHERE assignee_id IS NOT NULL AND status <> 'completed';

-- Row Level Security
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON activities
  USING (tenant_id = current_setting('app.current_tenant', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.current_tenant', true)::uuid);
