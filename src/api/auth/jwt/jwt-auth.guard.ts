import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserType } from '@prisma/client';
import { LoggedUserType } from 'src/middlewares/decorators/logged-user';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(private readonly userType: UserType[]) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			const isAuthorized = await super.canActivate(context);

			if (!isAuthorized) {
				throw new UnauthorizedException();
			}

			const request = context.switchToHttp().getRequest();
			const user = request.user as LoggedUserType;

			if (!this.userType.includes(user.type)) {
				throw new UnauthorizedException();
			}

			return true;
		} catch {
			throw new UnauthorizedException();
		}
	}
}
