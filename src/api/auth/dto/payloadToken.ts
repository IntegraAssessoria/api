import { UserType } from '@prisma/client';

export class PayloadToken {
	storeId: string;
	userId: string;
	type: UserType;
	userName: string;
}
