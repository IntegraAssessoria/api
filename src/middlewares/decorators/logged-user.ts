import { UserType } from '@prisma/client';

export type StoreCondition = {
	storeId: string;
};

export type LoggedUserType = {
	storeId: string;
	userId: string;
	userName: string;
	type: UserType;
	conditionStoreId?: StoreCondition;
};
