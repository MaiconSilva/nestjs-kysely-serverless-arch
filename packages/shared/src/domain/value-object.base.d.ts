/**
 * Base class for Value Objects: immutable and compared by value.
 * Subclasses must pass their payload in `props`; equality relies on JSON equality
 * which is enough for the small VOs in this POC (primitive-backed values).
 */
export declare abstract class ValueObject<TProps extends object = Record<string, unknown>> {
    protected readonly props: TProps;
    protected constructor(props: TProps);
    equals(other?: ValueObject<TProps>): boolean;
}
//# sourceMappingURL=value-object.base.d.ts.map