-- USERS
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  role        VARCHAR(20) NOT NULL DEFAULT 'member',
  cognito_sub VARCHAR(255),
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, email),
  CHECK (role IN ('admin', 'member'))
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_cognito_sub ON users(cognito_sub);

-- Row Level Security: every query must set app.current_tenant first.
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.current_tenant', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.current_tenant', true)::uuid);
