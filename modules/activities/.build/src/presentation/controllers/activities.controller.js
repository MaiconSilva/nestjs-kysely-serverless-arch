"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitiesController = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@todolist/shared");
const activity_dto_1 = require("../../application/dtos/activity.dto");
const assign_activity_use_case_1 = require("../../application/use-cases/assign-activity.use-case");
const complete_activity_use_case_1 = require("../../application/use-cases/complete-activity.use-case");
const create_activity_use_case_1 = require("../../application/use-cases/create-activity.use-case");
const list_activities_use_case_1 = require("../../application/use-cases/list-activities.use-case");
const activity_errors_1 = require("../../domain/errors/activity.errors");
let ActivitiesController = class ActivitiesController {
    createActivity;
    listActivities;
    assignActivity;
    completeActivity;
    constructor(createActivity, listActivities, assignActivity, completeActivity) {
        this.createActivity = createActivity;
        this.listActivities = listActivities;
        this.assignActivity = assignActivity;
        this.completeActivity = completeActivity;
    }
    create(tenantId, userSub, input) {
        // `sub` is the Cognito subject == users.id because we store sub in users.id
        // at creation time via cognito_sub linkage. In a follow-up we resolve sub
        // to the internal user id; for the POC we pass the Cognito sub as the
        // creator — entity only requires a valid UUID.
        return this.createActivity.execute(tenantId, userSub, input);
    }
    list(tenantId, query) {
        return this.listActivities.execute(tenantId, query);
    }
    async assign(tenantId, id, input) {
        try {
            return await this.assignActivity.execute(tenantId, id, input);
        }
        catch (err) {
            if (err instanceof activity_errors_1.ActivityNotFoundError)
                throw new common_1.NotFoundException(err.message);
            throw err;
        }
    }
    complete(tenantId, id) {
        return this.completeActivity.execute(tenantId, id);
    }
};
exports.ActivitiesController = ActivitiesController;
__decorate([
    (0, shared_1.Roles)('admin'),
    (0, common_1.Post)(),
    __param(0, (0, shared_1.CurrentTenant)()),
    __param(1, (0, shared_1.CurrentUser)('sub')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, activity_dto_1.CreateActivityInput]),
    __metadata("design:returntype", void 0)
], ActivitiesController.prototype, "create", null);
__decorate([
    (0, shared_1.Roles)('admin', 'member'),
    (0, common_1.Get)(),
    __param(0, (0, shared_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, activity_dto_1.ListActivitiesQuery]),
    __metadata("design:returntype", void 0)
], ActivitiesController.prototype, "list", null);
__decorate([
    (0, shared_1.Roles)('admin'),
    (0, common_1.Post)(':id/assign'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, shared_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, activity_dto_1.AssignActivityInput]),
    __metadata("design:returntype", Promise)
], ActivitiesController.prototype, "assign", null);
__decorate([
    (0, shared_1.Roles)('admin', 'member'),
    (0, common_1.Post)(':id/complete'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, shared_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ActivitiesController.prototype, "complete", null);
exports.ActivitiesController = ActivitiesController = __decorate([
    (0, common_1.Controller)('activities'),
    __metadata("design:paramtypes", [create_activity_use_case_1.CreateActivityUseCase,
        list_activities_use_case_1.ListActivitiesUseCase,
        assign_activity_use_case_1.AssignActivityUseCase,
        complete_activity_use_case_1.CompleteActivityUseCase])
], ActivitiesController);
//# sourceMappingURL=activities.controller.js.map