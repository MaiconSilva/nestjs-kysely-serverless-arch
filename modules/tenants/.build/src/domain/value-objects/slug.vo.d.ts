import { DomainError, ValueObject } from '@todolist/shared';
export declare class InvalidSlugError extends DomainError {
    readonly code = "INVALID_SLUG";
    readonly httpStatus = 400;
}
interface SlugProps {
    value: string;
}
export declare class Slug extends ValueObject<SlugProps> {
    get value(): string;
    static from(raw: string): Slug;
}
export {};
//# sourceMappingURL=slug.vo.d.ts.map