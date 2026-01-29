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
exports.CalculatedScore = void 0;
const typeorm_1 = require("typeorm");
const employee_entity_1 = require("./employee.entity");
const month_enum_1 = require("./month.enum");
let CalculatedScore = class CalculatedScore {
    id;
    employee;
    final_score;
    month;
    year;
    created_at;
    updated_at;
};
exports.CalculatedScore = CalculatedScore;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CalculatedScore.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, emp => emp.calculatedScores),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], CalculatedScore.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], CalculatedScore.prototype, "final_score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: month_enum_1.MonthEnum }),
    __metadata("design:type", String)
], CalculatedScore.prototype, "month", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CalculatedScore.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], CalculatedScore.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], CalculatedScore.prototype, "updated_at", void 0);
exports.CalculatedScore = CalculatedScore = __decorate([
    (0, typeorm_1.Entity)('calculated_scores')
], CalculatedScore);
//# sourceMappingURL=calculated-score.entity.js.map