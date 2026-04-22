/**
 * Base class for domain entities. Equality is based on identity (id),
 * never on attribute values — that's what distinguishes an Entity from a Value Object.
 */
export declare abstract class Entity<TId extends {
    value: string;
}> {
    readonly id: TId;
    protected constructor(id: TId);
    equals(other?: Entity<TId>): boolean;
}
//# sourceMappingURL=entity.base.d.ts.map