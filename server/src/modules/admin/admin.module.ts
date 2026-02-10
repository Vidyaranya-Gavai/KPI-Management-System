import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import { AdminAuthModule } from './auth/admin-auth.module';
import { CompanyModule } from './company/company.module';
import { DeptModule } from './dept/dept.module';

@Module({
  imports: [AdminAuthModule, CompanyModule, DeptModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
