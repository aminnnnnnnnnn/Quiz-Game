import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ISession } from '../model/ISession';
import { Request } from 'express';

@Injectable()
export class IsLoggedInGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const session = request.session as ISession;

    return session.user != undefined;
  }
}
