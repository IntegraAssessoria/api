import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserCreateDto } from '../dtos/create.dto';
import { UserUpdateDto } from '../dtos/update.dto';
import { HelperProvider } from 'src/utils/helper.provider';
import { UserNotificationService } from './notification.service';
import { UserValidationService } from './user-validation.service';
import { LoggedUserType } from 'src/middlewares/decorators/logged-user';
import { UserType } from '@prisma/client';

@Injectable()
export class UserService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly helperProvider: HelperProvider,
		private readonly userNotificationService: UserNotificationService,
		private readonly userValidationService: UserValidationService,
	) {}

	async getAll(loggedUser: LoggedUserType) {
		const users = await this.prisma.user.findMany({
			where: {
				...loggedUser.conditionStoreId,
			},
			select: {
				id: true,
				type: true,
				email: true,
				firstName: true,
				lastName: true,
				storeId: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return users;
	}

	async getUniq(id: string, loggedUser: LoggedUserType) {
		const getUser = await this.prisma.user.findUnique({
			where: {
				id,
				...loggedUser.conditionStoreId,
			},
			select: {
				id: true,
				type: true,
				email: true,
				firstName: true,
				lastName: true,
			},
		});

		if (!getUser) {
			throw new NotFoundException();
		}

		return getUser;
	}

	async findByEmail(email: string) {
		return await this.prisma.user.findUnique({
			where: {
				email: email,
			},
		});
	}

	async create(user: UserCreateDto, loggedUser: LoggedUserType) {
		if (loggedUser.type !== UserType.admin && user.type === UserType.admin) {
			throw new BadRequestException('Você não pode criar esse tipo de usuário');
		}

		try {
			await this.userValidationService.verifyEmailExists(user.email, loggedUser);

			const firstAccessToken = this.helperProvider.randAuthHash();

			const newUserId = this.helperProvider.generateDbId();
			const newUser = await this.prisma.user.create({
				data: {
					id: newUserId,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					type: user.type,
					firstAccessToken: firstAccessToken,
					firstAccessTokenExpiration: this.helperProvider.dayjs().add(24, 'hours').toDate(),
					storeId: loggedUser.storeId ? loggedUser.storeId : user.storeId,
				},
			});

			await this.userNotificationService.sendCodeFirstAccess(newUser, firstAccessToken);

			return {
				id: newUser.id,
			};
		} catch (e) {
			if (e.response.status === 202) {
				return e.response;
			}

			throw new BadRequestException('Erro ao criar o usuário');
		}
	}

	async update(id: string, user: UserUpdateDto, loggedUser: LoggedUserType) {
		const getUser = await this.prisma.user.findUnique({
			where: {
				id: id,
				...loggedUser.conditionStoreId,
			},
		});

		if (!getUser) {
			throw new NotFoundException();
		}

		try {
			const updatedUser = await this.prisma.user.update({
				where: {
					id: id,
					...loggedUser.conditionStoreId,
				},
				data: {
					firstName: user.firstName,
					lastName: user.lastName,
				},
				select: {
					id: true,
					email: true,
				},
			});

			return updatedUser;
		} catch (e) {
			if (e.response.status === 202) {
				return e.response;
			}

			throw new BadRequestException('Erro ao editar o usuário');
		}
	}

	async remove(id: string, loggedUser: LoggedUserType) {
		try {
			return await this.prisma.user.delete({
				where: {
					id,
					...loggedUser.conditionStoreId,
				},
			});
		} catch {
			throw new BadRequestException('Erro ao remover o usuário.');
		}
	}
}
