import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {ISession} from "../model/ISession";
import {Request} from "express";

@Injectable()
export class UserIdGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const http = context.switchToHttp();
        const request = http.getRequest<Request>();
        const session = request.session as ISession;


        if (session.user != undefined && session.user.user_id == +request.params.user_id) {
            return true;
        } else {
            return false;
        }
    }
}

