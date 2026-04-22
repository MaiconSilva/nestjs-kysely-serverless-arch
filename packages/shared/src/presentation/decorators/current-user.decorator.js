"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentUser = (0, common_1.createParamDecorator)((field, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    if (!req.user)
        return undefined;
    return field ? req.user[field] : req.user;
});
//# sourceMappingURL=current-user.decorator.js.map