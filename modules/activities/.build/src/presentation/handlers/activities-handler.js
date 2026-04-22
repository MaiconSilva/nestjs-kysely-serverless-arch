"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const shared_1 = require("@todolist/shared");
const activities_module_1 = require("../activities.module");
exports.handler = (0, shared_1.createLambdaHandler)(activities_module_1.ActivitiesModule);
//# sourceMappingURL=activities-handler.js.map