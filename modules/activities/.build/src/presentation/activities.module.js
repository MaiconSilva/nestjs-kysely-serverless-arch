"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitiesModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const shared_1 = require("@todolist/shared");
const assign_activity_use_case_1 = require("../application/use-cases/assign-activity.use-case");
const complete_activity_use_case_1 = require("../application/use-cases/complete-activity.use-case");
const create_activity_use_case_1 = require("../application/use-cases/create-activity.use-case");
const list_activities_use_case_1 = require("../application/use-cases/list-activities.use-case");
const activity_repository_1 = require("../domain/repositories/activity.repository");
const user_lookup_1 = require("../domain/services/user-lookup");
const activity_kysely_repository_1 = require("../infrastructure/repositories/activity.kysely.repository");
const kysely_user_lookup_1 = require("../infrastructure/services/kysely-user-lookup");
const activities_controller_1 = require("./controllers/activities.controller");
let ActivitiesModule = class ActivitiesModule {
};
exports.ActivitiesModule = ActivitiesModule;
exports.ActivitiesModule = ActivitiesModule = __decorate([
    (0, common_1.Module)({
        imports: [shared_1.KyselyModule],
        controllers: [activities_controller_1.ActivitiesController],
        providers: [
            create_activity_use_case_1.CreateActivityUseCase,
            list_activities_use_case_1.ListActivitiesUseCase,
            assign_activity_use_case_1.AssignActivityUseCase,
            complete_activity_use_case_1.CompleteActivityUseCase,
            { provide: activity_repository_1.ACTIVITY_REPOSITORY, useClass: activity_kysely_repository_1.ActivityKyselyRepository },
            { provide: user_lookup_1.USER_LOOKUP, useClass: kysely_user_lookup_1.KyselyUserLookup },
            { provide: core_1.APP_GUARD, useClass: shared_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: shared_1.RoleGuard },
        ],
    })
], ActivitiesModule);
//# sourceMappingURL=activities.module.js.map