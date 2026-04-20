import { Injectable } from '@nestjs/common';
import { createHash, randomUUID } from 'crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import jwt from 'jsonwebtoken';
import type {
  AuthenticateParams,
  AuthenticateResult,
  CreateIdentityParams,
  CreateIdentityResult,
  IdentityProvider,
} from '../../domain/services/identity-provider';

interface LocalUserRecord {
  sub: string;
  email: string;
  passwordHash: string;
  tenantId: string;
  role: 'admin' | 'member';
  name: string;
}

/**
 * Development-only identity provider. Persists a JSON file so that
 * `serverless offline` restarts and separate module processes share the same
 * identity database. Enable by setting AUTH_MODE=local.
 *
 * NEVER ship to production. The token is signed with an HS256 shared secret.
 */
@Injectable()
export class LocalIdentityService implements IdentityProvider {
  private readonly filePath =
    process.env.LOCAL_IDENTITY_FILE ??
    join(process.cwd(), '.localstack', 'local-identity.json');
  private readonly secret = process.env.JWT_LOCAL_SECRET ?? 'local-dev-secret';

  async createUser(params: CreateIdentityParams): Promise<CreateIdentityResult> {
    const db = this.load();
    const key = params.email.toLowerCase();
    const sub = db[key]?.sub ?? randomUUID();
    db[key] = {
      sub,
      email: key,
      passwordHash: hash(params.temporaryPassword),
      tenantId: params.tenantId,
      role: params.role,
      name: params.name,
    };
    this.save(db);
    return { sub };
  }

  async authenticate(params: AuthenticateParams): Promise<AuthenticateResult> {
    const db = this.load();
    const record = db[params.email.toLowerCase()];
    if (!record || record.passwordHash !== hash(params.password)) {
      throw new Error('Invalid credentials');
    }
    const expiresIn = 3600;
    const token = jwt.sign(
      {
        sub: record.sub,
        email: record.email,
        'custom:tenant_id': record.tenantId,
        'custom:role': record.role,
      },
      this.secret,
      { expiresIn },
    );
    return {
      accessToken: token,
      idToken: token,
      refreshToken: undefined,
      sub: record.sub,
      tenantId: record.tenantId,
      role: record.role,
      expiresIn,
    };
  }

  private load(): Record<string, LocalUserRecord> {
    if (!existsSync(this.filePath)) return {};
    try {
      return JSON.parse(readFileSync(this.filePath, 'utf8'));
    } catch {
      return {};
    }
  }

  private save(db: Record<string, LocalUserRecord>): void {
    mkdirSync(dirname(this.filePath), { recursive: true });
    writeFileSync(this.filePath, JSON.stringify(db, null, 2));
  }
}

function hash(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}
