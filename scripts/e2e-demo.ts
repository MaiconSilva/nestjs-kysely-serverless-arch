/**
 * End-to-end demo script — exercises the full backend flow against the three
 * local `serverless offline` instances:
 *   tenants  → http://localhost:3001
 *   users    → http://localhost:3002
 *   activities → http://localhost:3003
 *
 * Run:
 *   docker-compose up -d
 *   AUTH_MODE=local npm run dev:tenants     (terminal 1)
 *   AUTH_MODE=local npm run dev:users       (terminal 2)
 *   AUTH_MODE=local npm run dev:activities  (terminal 3)
 *   npm run demo                            (terminal 4)
 */
const TENANTS = process.env.TENANTS_URL ?? 'http://localhost:3001';
const USERS = process.env.USERS_URL ?? 'http://localhost:3002';
const ACTIVITIES = process.env.ACTIVITIES_URL ?? 'http://localhost:3003';

interface TenantOut {
  id: string;
  slug: string;
}
interface UserOut {
  id: string;
  email: string;
  tenantId: string;
  role: 'admin' | 'member';
}
interface LoginOut {
  accessToken: string;
  user: UserOut;
}
interface ActivityOut {
  id: string;
  status: 'pending' | 'assigned' | 'completed';
  assigneeId: string | null;
}

async function call<T>(
  url: string,
  method: 'GET' | 'POST',
  body?: unknown,
  token?: string,
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${method} ${url} → ${res.status}: ${text}`);
  }
  return text ? JSON.parse(text) : (undefined as T);
}

async function main(): Promise<void> {
  const stamp = Date.now().toString(36);

  console.log('[demo] Creating tenant...');
  const tenant = await call<TenantOut>(`${TENANTS}/tenants`, 'POST', {
    name: 'OpemCode Demo',
    slug: `opemcode-${stamp}`,
  });
  console.log(`  tenant.id = ${tenant.id}`);

  console.log('[demo] Creating admin user...');
  // We need an auth token to create users. In local mode we can sign our own;
  // in cloud mode we go through `POST /auth/login`. Easiest: first create the
  // admin directly in the DB using the Tenants module, BUT the POC calls
  // `POST /users` which already requires admin auth. To unblock the demo
  // bootstrap flow we use AUTH_MODE=local and mint a temporary admin token.
  const { sign } = await import('jsonwebtoken');
  const secret = process.env.JWT_LOCAL_SECRET ?? 'local-dev-secret';
  const bootstrapToken = sign(
    {
      sub: `bootstrap-${stamp}`,
      'custom:tenant_id': tenant.id,
      'custom:role': 'admin',
      email: `bootstrap-${stamp}@demo`,
    },
    secret,
    { expiresIn: '10m' },
  );

  const admin = await call<UserOut>(
    `${USERS}/users`,
    'POST',
    {
      name: 'Admin Demo',
      email: `admin-${stamp}@demo.test`,
      role: 'admin',
      temporaryPassword: 'DemoPass!23',
    },
    bootstrapToken,
  );
  console.log(`  admin.id = ${admin.id}`);

  console.log('[demo] Creating member user...');
  const member = await call<UserOut>(
    `${USERS}/users`,
    'POST',
    {
      name: 'Member Demo',
      email: `member-${stamp}@demo.test`,
      role: 'member',
      temporaryPassword: 'DemoPass!23',
    },
    bootstrapToken,
  );
  console.log(`  member.id = ${member.id}`);

  console.log('[demo] Logging in as admin...');
  const adminLogin = await call<LoginOut>(`${USERS}/auth/login`, 'POST', {
    email: `admin-${stamp}@demo.test`,
    password: 'DemoPass!23',
  });
  console.log(`  admin token = ${adminLogin.accessToken.slice(0, 20)}...`);

  console.log('[demo] Creating 3 activities...');
  const activities: ActivityOut[] = [];
  for (let i = 1; i <= 3; i++) {
    const a = await call<ActivityOut>(
      `${ACTIVITIES}/activities`,
      'POST',
      { title: `Activity ${i}`, description: `Demo activity #${i}` },
      adminLogin.accessToken,
    );
    activities.push(a);
  }
  console.log(`  created ${activities.length} activities`);

  console.log('[demo] Assigning activity #1 to member...');
  const assigned = await call<ActivityOut>(
    `${ACTIVITIES}/activities/${activities[0].id}/assign`,
    'POST',
    { userId: member.id },
    adminLogin.accessToken,
  );
  console.log(`  status = ${assigned.status}, assigneeId = ${assigned.assigneeId}`);

  console.log('[demo] Logging in as member and completing activity...');
  const memberLogin = await call<LoginOut>(`${USERS}/auth/login`, 'POST', {
    email: `member-${stamp}@demo.test`,
    password: 'DemoPass!23',
  });
  const completed = await call<ActivityOut>(
    `${ACTIVITIES}/activities/${activities[0].id}/complete`,
    'POST',
    undefined,
    memberLogin.accessToken,
  );
  console.log(`  status = ${completed.status}`);

  console.log('[demo] Attempting to complete another activity without assignee (expect 422)...');
  try {
    await call(
      `${ACTIVITIES}/activities/${activities[1].id}/complete`,
      'POST',
      undefined,
      adminLogin.accessToken,
    );
    console.error('  ERROR: expected 422 but request succeeded');
    process.exit(1);
  } catch (err) {
    console.log(`  got expected failure: ${(err as Error).message.split(':')[1]?.trim()}`);
  }

  console.log('[demo] Listing activities...');
  const list = await call<ActivityOut[]>(
    `${ACTIVITIES}/activities`,
    'GET',
    undefined,
    adminLogin.accessToken,
  );
  console.log(`  total = ${list.length}`);

  console.log('[demo] Success. All critical paths exercised.');
}

main().catch((err) => {
  console.error('[demo] failed', err);
  process.exit(1);
});
