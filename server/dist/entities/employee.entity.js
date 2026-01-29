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
exports.Employee = void 0;
const typeorm_1 = require("typeorm");
const role_entity_1 = require("./role.entity");
const dept_entity_1 = require("./dept.entity");
const kpi_score_entity_1 = require("./kpi-score.entity");
const calculated_score_entity_1 = require("./calculated-score.entity");
let Employee = class Employee {
    id;
    emp_id;
    first_name;
    last_name;
    email;
    contact_no;
    type;
    role;
    dept;
    kpiApprover;
    approvees;
    kpiScores;
    calculatedScores;
    created_at;
    updated_at;
};
exports.Employee = Employee;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Employee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "emp_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Employee.prototype, "first_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Employee.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', unique: true, nullable: true }),
    __metadata("design:type", Number)
], Employee.prototype, "contact_no", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Employee.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_entity_1.Role, role => role.employees),
    (0, typeorm_1.JoinColumn)({ name: 'role_id' }),
    __metadata("design:type", role_entity_1.Role)
], Employee.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dept_entity_1.Dept),
    (0, typeorm_1.JoinColumn)({ name: 'dept_id' }),
    __metadata("design:type", dept_entity_1.Dept)
], Employee.prototype, "dept", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employee, emp => emp.approvees, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'kpi_approver_id' }),
    __metadata("design:type", Employee)
], Employee.prototype, "kpiApprover", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Employee, emp => emp.kpiApprover),
    __metadata("design:type", Array)
], Employee.prototype, "approvees", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => kpi_score_entity_1.KPIScore, score => score.employee),
    __metadata("design:type", Array)
], Employee.prototype, "kpiScores", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => calculated_score_entity_1.CalculatedScore, score => score.employee),
    __metadata("design:type", Array)
], Employee.prototype, "calculatedScores", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Employee.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Employee.prototype, "updated_at", void 0);
exports.Employee = Employee = __decorate([
    (0, typeorm_1.Entity)('employee')
], Employee);
//# sourceMappingURL=employee.entity.js.map