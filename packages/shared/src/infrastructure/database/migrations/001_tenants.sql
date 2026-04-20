-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- TENANTS: administrative-level table (no RLS).
-- Every other tenant-scoped table references this one.
CREATE TABLE tenants (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(255) NOT NULL,
  slug       VARCHAR(100) NOT NULL UNIQUE,
  active     BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tenants_slug ON tenants(slug);
