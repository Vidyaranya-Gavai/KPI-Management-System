import { Body, Controller, Post, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';

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
  login(@Res({ passthrough: true }) res: Response, @Body() dto: LoginAdminDto) {
    return this.authService.login(dto, res);
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshToken(req, res);
  }
}
