"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const shared_1 = require("@todolist/shared");
const users_module_1 = require("../users.module");
exports.handler = (0, shared_1.createLambdaHandler)(users_module_1.UsersModule);
//# sourceMappingURL=users-handler.js.map