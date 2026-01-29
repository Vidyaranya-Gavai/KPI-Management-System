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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KPI = void 0;
const typeorm_1 = require("typeorm");
const role_entity_1 = require("./role.entity");
const kpi_score_entity_1 = require("./kpi-score.entity");
let KPI = class KPI {
    id;
    name;
    description;
    type;
    score_type;
    parent;
    children;
    role;
    contribute_to_parent;
    kpiScores;
    created_at;
    updated_at;
};
exports.KPI = KPI;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KPI.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], KPI.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], KPI.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], KPI.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], KPI.prototype, "score_type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => KPI, kpi => kpi.children, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id' }),
    __metadata("design:type", KPI)
], KPI.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => KPI, kpi => kpi.parent),
    __metadata("design:type", Array)
], KPI.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_entity_1.Role, role => role.kpis),
    (0, typeorm_1.JoinColumn)({ name: 'role_id' }),
    __metadata("design:type", role_entity_1.Role)
], KPI.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], KPI.prototype, "contribute_to_parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => kpi_score_entity_1.KPIScore, score => score.kpi),
    __metadata("design:type", Array)
], KPI.prototype, "kpiScores", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], KPI.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], KPI.prototype, "updated_at", void 0);
exports.KPI = KPI = __decorate([
    (0, typeorm_1.Entity)('kpi')
], KPI);
//# sourceMappingURL=kpi.entity.js.map