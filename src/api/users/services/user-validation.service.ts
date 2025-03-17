import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoggedUserType } from 'src/middlewares/decorators/logged-user';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserValidationService {
	constructor(private readonly prisma: PrismaService) {}

	async verifyEmailExists(email: string, loggedUser: LoggedUserType, id?: string) {
		const whereCondition = {
			...(id ? { id: { not: id } } : {}),
			email: email,
			...loggedUser.conditionStoreId,
		};

		const existingUser = await this.prisma.user.findFirst({
			where: whereCondition,
		});

		if (existingUser) {
			throw new HttpException(
				{
					status: HttpStatus.ACCEPTED,
					error: 'Esse e-mail já está em uso por outro usuário.',
				},
				HttpStatus.ACCEPTED,
			);
		}
	}
}
