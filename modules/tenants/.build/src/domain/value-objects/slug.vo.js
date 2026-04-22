"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slug = exports.InvalidSlugError = void 0;
const shared_1 = require("@todolist/shared");
class InvalidSlugError extends shared_1.DomainError {
    code = 'INVALID_SLUG';
    httpStatus = 400;
}
exports.InvalidSlugError = InvalidSlugError;
const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,98}[a-z0-9])?$/;
class Slug extends shared_1.ValueObject {
    get value() {
        return this.props.value;
    }
    static from(raw) {
        const normalized = raw.trim().toLowerCase();
        if (!SLUG_RE.test(normalized)) {
            throw new InvalidSlugError(`Invalid slug '${raw}' — must be lowercase alphanumeric with optional dashes, 1-100 chars`);
        }
        return new Slug({ value: normalized });
    }
}
exports.Slug = Slug;
//# sourceMappingURL=slug.vo.js.map