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
exports.AssignActivityUseCase = void 0;
const common_1 = require("@nestjs/common");
const activity_errors_1 = require("../../domain/errors/activity.errors");
const activity_repository_1 = require("../../domain/repositories/activity.repository");
const user_lookup_1 = require("../../domain/services/user-lookup");
const to_output_1 = require("./to-output");
let AssignActivityUseCase = class AssignActivityUseCase {
    repo;
    userLookup;
    constructor(repo, userLookup) {
        this.repo = repo;
        this.userLookup = userLookup;
    }
    async execute(tenantId, activityId, input) {
        const activity = await this.repo.findById(tenantId, activityId);
        if (!activity)
            throw new activity_errors_1.ActivityNotFoundError(activityId);
        const userTenant = await this.userLookup.findTenantOfUser(tenantId, input.userId);
        if (!userTenant)
            throw new activity_errors_1.UserNotBelongsToTenantError();
        // Enforce at the application layer: one active activity per user.
        // The DB also has a partial unique index as a last-mile guarantee.
        const existing = await this.repo.findActiveByAssignee(tenantId, input.userId);
        if (existing)
            throw new activity_errors_1.UserAlreadyHasActivityError(input.userId);
        activity.assign(input.userId, userTenant);
        await this.repo.save(activity);
        return (0, to_output_1.toOutput)(activity);
    }
};
exports.AssignActivityUseCase = AssignActivityUseCase;
exports.AssignActivityUseCase = AssignActivityUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(activity_repository_1.ACTIVITY_REPOSITORY)),
    __param(1, (0, common_1.Inject)(user_lookup_1.USER_LOOKUP)),
    __metadata("design:paramtypes", [Object, Object])
], AssignActivityUseCase);
//# sourceMappingURL=assign-activity.use-case.js.map