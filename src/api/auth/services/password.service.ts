import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResetPasswordDTO } from '../dto/reset-password';
import { HelperProvider } from 'src/utils/helper.provider';
import { RedisProvider } from 'src/infrastructure/redis/redis';
import { ResetPasswordRedis } from '../types/reset-password';
import { envConfig } from 'src/environment/env';
import { NodemailerService } from 'src/infrastructure/nodemailer/shared/nodemailer.service';
import { ChangePasswordDTO } from '../dto/change-password';
import { PasswordHashProvider } from 'src/utils/password-hash.provider';
import { LoggedUserType } from 'src/middlewares/decorators/logged-user';
import { ChangePasswordRedis } from '../types/change-password';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthPassword {
	constructor(
		private readonly prisma: PrismaService,
		private readonly authService: AuthService,
		private readonly helperProvider: HelperProvider,
		private readonly redisProvider: RedisProvider,
		private readonly nodemailerService: NodemailerService,
		private readonly passwordHashProvider: PasswordHashProvider,
	) {}

	async requestCodeResetPassword(resetPasswordDTO: ResetPasswordDTO): Promise<{ userId: string; message: string }> {
		const user = await this.authService.getUserByEmail(resetPasswordDTO.email);

		const RESET_PASSWORD_KEY = `user:${user.id}:resetPassword`;
		const BLOCK_KEY = `user:${user.id}:resetPassword:block`;

		const ttlRemaining = await this.redisProvider.ttl(BLOCK_KEY);

		if (ttlRemaining > 0) {
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					error: `Aguarde ${ttlRemaining}s para solicitar novamente.`,
				},
				HttpStatus.BAD_REQUEST,
			);
		}

		const resetHash = this.helperProvider.randNumber(6);

		await this.redisProvider.set<ResetPasswordRedis>(
			RESET_PASSWORD_KEY,
			{
				token: resetHash,
				id: user.id,
				email: user.email,
				createdAt: String(this.helperProvider.dayjs().toDate()),
			},
			300,
		);

		await this.redisProvider.set(BLOCK_KEY, '', 30);

		this.nodemailerService.sendMailQueue({
			destination: user.email,
			fromName: envConfig.SITE_NAME,
			subject: `Crie uma nova senha em ${envConfig.SITE_NAME}`,
			message: `Olá, ${user.firstName}, utilize o código abaixo para criar uma nova senha:<br /><br /><b>${resetHash}</b><br /><a href="${envConfig.FRONTEND_URL}/login/account-recovery/${user.id}">Clique aqui para criar uma nova senha</a>`,
		});

		return {
			userId: user.id,
			message: `Enviamos um código de reset de senha para o e-mail cadastrado. Código válido por 3 minutos.`,
		};
	}

	async changeResetPassword(userId: string, changePassword: ChangePasswordDTO): Promise<{ message: string }> {
		const RESET_PASSWORD_KEY = `user:${userId}:resetPassword`;

		const getUserInRedis = await this.redisProvider.get<ResetPasswordRedis>(RESET_PASSWORD_KEY);

		if (!getUserInRedis) {
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					error: 'Código inválido ou expirado.',
				},
				HttpStatus.BAD_REQUEST,
			);
		}

		if (getUserInRedis.token !== this.helperProvider.clearSpecial(changePassword.code)) {
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					error: 'Código inválido ou expirado.',
				},
				HttpStatus.BAD_REQUEST,
			);
		}

		const newPasswordHash = await this.passwordHashProvider.hash(changePassword.newPassword);

		await this.redisProvider.del(RESET_PASSWORD_KEY);

		await this.prisma.user.update({
			where: {
				id: getUserInRedis.id,
			},
			data: {
				password: newPasswordHash,
			},
		});

		return {
			message: 'A senha do usuário foi atualizada',
		};
	}

	async requestCodeChangePassword(loggedUser: LoggedUserType) {
		const user = await this.prisma.user.findFirst({
			where: {
				id: loggedUser.userId,
			},
			select: {
				id: true,
				firstName: true,
				lastName: true,
				email: true,
			},
		});

		const RESET_PASSWORD_KEY = `user:${loggedUser.userId}:changePassword`;
		const resetHash = this.helperProvider.randAuthHash();

		await this.redisProvider.set<ChangePasswordRedis>(
			RESET_PASSWORD_KEY,
			{
				token: resetHash,
				id: user.id,
				createdAt: String(this.helperProvider.dayjs().toDate()),
			},
			300,
		);

		this.nodemailerService.sendMailQueue({
			destination: user.email,
			fromName: envConfig.SITE_NAME,
			subject: `Altere sua senha em ${envConfig.SITE_NAME}`,
			message: `Olá, ${user.firstName}, utilize o código abaixo para alterar sua senha:<br /><br /><b>${resetHash}</b>`,
		});

		return {
			userId: user.id,
			message: 'Enviamos um código para validar sua alteração de senha.',
		};
	}

	async changePassword(changePassword: ChangePasswordDTO, loggedUser: LoggedUserType) {
		const RESET_PASSWORD_KEY = `user:${loggedUser.userId}:changePassword`;
		const getUserInRedis = await this.redisProvider.get<ResetPasswordRedis>(RESET_PASSWORD_KEY);

		if (!getUserInRedis) {
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					error: 'Código inválido ou expirado.',
				},
				HttpStatus.BAD_REQUEST,
			);
		}

		if (getUserInRedis.token !== this.helperProvider.clearSpecial(changePassword.code)) {
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					error: 'Código inválido ou expirado.',
				},
				HttpStatus.BAD_REQUEST,
			);
		}

		const newPasswordHash = await this.passwordHashProvider.hash(changePassword.newPassword);

		await this.prisma.user.update({
			where: {
				id: getUserInRedis.id,
			},
			data: {
				password: newPasswordHash,
			},
		});

		await this.redisProvider.del(RESET_PASSWORD_KEY);

		return {
			message: 'A sua senha foi atualizada',
		};
	}
}
