/**
 * Base class for domain entities. Equality is based on identity (id),
 * never on attribute values — that's what distinguishes an Entity from a Value Object.
 */
export abstract class Entity<TId extends { value: string }> {
  protected constructor(public readonly id: TId) {}

  equals(other?: Entity<TId>): boolean {
    if (!other) return false;
    if (this === other) return true;
    return this.id.value === other.id.value;
  }
}
