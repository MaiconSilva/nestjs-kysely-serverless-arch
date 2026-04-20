/**
 * Base class for Value Objects: immutable and compared by value.
 * Subclasses must pass their payload in `props`; equality relies on JSON equality
 * which is enough for the small VOs in this POC (primitive-backed values).
 */
export abstract class ValueObject<TProps extends Record<string, unknown>> {
  protected readonly props: TProps;

  protected constructor(props: TProps) {
    this.props = Object.freeze({ ...props });
  }

  equals(other?: ValueObject<TProps>): boolean {
    if (!other) return false;
    if (this === other) return true;
    if (other.constructor !== this.constructor) return false;
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }
}
