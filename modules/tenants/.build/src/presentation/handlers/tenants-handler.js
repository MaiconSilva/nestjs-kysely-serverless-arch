"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const shared_1 = require("@todolist/shared");
const tenants_module_1 = require("../tenants.module");
exports.handler = (0, shared_1.createLambdaHandler)(tenants_module_1.TenantsModule);
//# sourceMappingURL=tenants-handler.js.map