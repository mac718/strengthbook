import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from '../users/user.schema';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): IUser => {
    const req = ctx.switchToHttp().getRequest();
    return req.user.user;
  },
);
