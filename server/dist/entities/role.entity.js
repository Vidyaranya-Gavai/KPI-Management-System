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
exports.Role = void 0;
const typeorm_1 = require("typeorm");
const dept_entity_1 = require("./dept.entity");
const kpi_entity_1 = require("./kpi.entity");
const employee_entity_1 = require("./employee.entity");
let Role = class Role {
    id;
    name;
    type;
    dept;
    kpis;
    employees;
    created_at;
    updated_at;
};
exports.Role = Role;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Role.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Role.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dept_entity_1.Dept, dept => dept.roles),
    (0, typeorm_1.JoinColumn)({ name: 'dept_id' }),
    __metadata("design:type", dept_entity_1.Dept)
], Role.prototype, "dept", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => kpi_entity_1.KPI, kpi => kpi.role),
    __metadata("design:type", Array)
], Role.prototype, "kpis", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => employee_entity_1.Employee, emp => emp.role),
    __metadata("design:type", Array)
], Role.prototype, "employees", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Role.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Role.prototype, "updated_at", void 0);
exports.Role = Role = __decorate([
    (0, typeorm_1.Entity)('role')
], Role);
//# sourceMappingURL=role.entity.js.map