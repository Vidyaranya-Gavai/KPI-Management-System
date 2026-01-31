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
exports.AdminRefreshToken = void 0;
const typeorm_1 = require("typeorm");
const admin_user_entity_1 = require("./admin-user.entity");
let AdminRefreshToken = class AdminRefreshToken {
    id;
    adminId;
    admin;
    tokenHash;
    isValid;
    expiresAt;
    createdAt;
    updatedAt;
};
exports.AdminRefreshToken = AdminRefreshToken;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], AdminRefreshToken.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'admin_id', type: 'bigint' }),
    __metadata("design:type", Number)
], AdminRefreshToken.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => admin_user_entity_1.AdminUser, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'admin_id' }),
    __metadata("design:type", admin_user_entity_1.AdminUser)
], AdminRefreshToken.prototype, "admin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'token_hash', type: 'text' }),
    __metadata("design:type", String)
], AdminRefreshToken.prototype, "tokenHash", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_valid',
        type: 'boolean',
        default: true,
    }),
    __metadata("design:type", Boolean)
], AdminRefreshToken.prototype, "isValid", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'expires_at',
        type: 'timestamptz',
    }),
    __metadata("design:type", Date)
], AdminRefreshToken.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamptz',
    }),
    __metadata("design:type", Date)
], AdminRefreshToken.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamptz',
    }),
    __metadata("design:type", Date)
], AdminRefreshToken.prototype, "updatedAt", void 0);
exports.AdminRefreshToken = AdminRefreshToken = __decorate([
    (0, typeorm_1.Entity)('admin_refresh_token'),
    (0, typeorm_1.Index)(['tokenHash']),
    (0, typeorm_1.Index)(['adminId'])
], AdminRefreshToken);
//# sourceMappingURL=admin-refresh-token.entity.js.map