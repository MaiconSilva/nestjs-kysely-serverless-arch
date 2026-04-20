import { Tenant } from './tenant.entity';
import { InvalidSlugError } from '../value-objects/slug.vo';

describe('Tenant', () => {
  it('creates active by default', () => {
    const t = Tenant.create({ name: 'ACME', slug: 'acme' });
    expect(t.active).toBe(true);
    expect(t.name).toBe('ACME');
    expect(t.slug.value).toBe('acme');
  });

  it('rejects invalid slugs', () => {
    expect(() => Tenant.create({ name: 'x', slug: 'BAD slug' })).toThrow(InvalidSlugError);
  });

  it('rejects empty names', () => {
    expect(() => Tenant.create({ name: '   ', slug: 'acme' })).toThrow();
  });

  it('supports deactivation and reactivation', () => {
    const t = Tenant.create({ name: 'ACME', slug: 'acme' });
    t.deactivate();
    expect(t.active).toBe(false);
    t.reactivate();
    expect(t.active).toBe(true);
  });

  it('round-trips through snapshot', () => {
    const t = Tenant.create({ name: 'ACME', slug: 'acme' });
    const restored = Tenant.restore(t.toSnapshot());
    expect(restored.toSnapshot()).toEqual(t.toSnapshot());
  });
});
