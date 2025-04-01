import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LoggedUserType } from './logged-user';
import { UserType } from '@prisma/client';

export const LoggedUser = createParamDecorator((data, ctx: ExecutionContext): LoggedUserType => {
	const request = ctx.switchToHttp().getRequest();
	const loggedUser = request.user as LoggedUserType;

	loggedUser.conditionStoreId = {
		...(loggedUser.type !== UserType.ADMIN && { storeId: loggedUser.storeId }),
	};

	return loggedUser;
});
