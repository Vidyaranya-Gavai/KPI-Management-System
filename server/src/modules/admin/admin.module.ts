import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import { AdminAuthModule } from './auth/admin-auth.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [AdminAuthModule, CompanyModule],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
