import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import { AdminAuthModule } from './auth/admin-auth.module';
import { CompanyModule } from './company/company.module';
import { DeptModule } from './dept/dept.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [AdminAuthModule, CompanyModule, DeptModule, RoleModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
