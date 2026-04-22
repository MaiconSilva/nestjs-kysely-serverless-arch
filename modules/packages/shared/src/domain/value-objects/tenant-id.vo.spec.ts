import { InvalidTenantIdError, TenantId } from './tenant-id.vo';

describe('TenantId', () => {
  it('generates a valid uuid', () => {
    const id = TenantId.generate();
    expect(id.value).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('parses a canonical uuid', () => {
    const id = TenantId.from('9e8f5a0e-1d1b-4f3b-91a3-8c1c2b2a0f01');
    expect(id.value).toBe('9e8f5a0e-1d1b-4f3b-91a3-8c1c2b2a0f01');
  });

  it('rejects non-uuid strings', () => {
    expect(() => TenantId.from('not-a-uuid')).toThrow(InvalidTenantIdError);
  });
});
