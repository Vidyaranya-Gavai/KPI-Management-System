import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AdminContext {
  id: number;
  type: string;
}

export const Admin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AdminContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
