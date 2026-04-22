import { ValueObject } from '../value-object.base';
import { DomainError } from '../domain-error.base';
export declare class InvalidEmailError extends DomainError {
    readonly code = "INVALID_EMAIL";
    readonly httpStatus = 400;
}
interface EmailProps {
    value: string;
}
export declare class Email extends ValueObject<EmailProps> {
    get value(): string;
    static from(raw: string): Email;
}
export {};
//# sourceMappingURL=email.vo.d.ts.map