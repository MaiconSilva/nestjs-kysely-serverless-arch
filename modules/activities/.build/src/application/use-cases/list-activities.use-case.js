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
exports.ListActivitiesUseCase = void 0;
const common_1 = require("@nestjs/common");
const activity_repository_1 = require("../../domain/repositories/activity.repository");
const to_output_1 = require("./to-output");
let ListActivitiesUseCase = class ListActivitiesUseCase {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async execute(tenantId, query = {}) {
        const list = await this.repo.listByTenant(tenantId, {
            status: query.status,
            assigneeId: query.assigneeId,
        });
        return list.map(to_output_1.toOutput);
    }
};
exports.ListActivitiesUseCase = ListActivitiesUseCase;
exports.ListActivitiesUseCase = ListActivitiesUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(activity_repository_1.ACTIVITY_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ListActivitiesUseCase);
//# sourceMappingURL=list-activities.use-case.js.map