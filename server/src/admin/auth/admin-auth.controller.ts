import { Body, Controller, Post } from '@nestjs/common';

import { AdminAuthService } from './admin-auth.service';
import { RegisterAdminDto } from './dtos/register-admin.dto';
import { LoginAdminDto } from './dtos/login-admin.dto';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AdminAuthService) {}

  @Post('register')
  register(@Body() dto: RegisterAdminDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginAdminDto) {
    return this.authService.login(dto);
  }
}
