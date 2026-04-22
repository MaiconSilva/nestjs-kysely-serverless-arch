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
exports.CompleteActivityUseCase = void 0;
const common_1 = require("@nestjs/common");
const activity_errors_1 = require("../../domain/errors/activity.errors");
const activity_repository_1 = require("../../domain/repositories/activity.repository");
const to_output_1 = require("./to-output");
let CompleteActivityUseCase = class CompleteActivityUseCase {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async execute(tenantId, activityId) {
        const activity = await this.repo.findById(tenantId, activityId);
        if (!activity)
            throw new activity_errors_1.ActivityNotFoundError(activityId);
        activity.complete();
        await this.repo.save(activity);
        return (0, to_output_1.toOutput)(activity);
    }
};
exports.CompleteActivityUseCase = CompleteActivityUseCase;
exports.CompleteActivityUseCase = CompleteActivityUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(activity_repository_1.ACTIVITY_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CompleteActivityUseCase);
//# sourceMappingURL=complete-activity.use-case.js.map