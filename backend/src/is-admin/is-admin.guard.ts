import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {ISession} from "../model/ISession";

@Injectable()
export class IsAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const session: ISession = request.session;

        if (session.isAdmin) {
            return true;
        }
        return false;
    }
}