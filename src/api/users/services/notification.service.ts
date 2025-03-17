import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { NodemailerService } from 'src/infrastructure/nodemailer/shared/nodemailer.service';
import { envConfig } from 'src/environment/env';

@Injectable()
export class UserNotificationService {
	constructor(private readonly nodemailerService: NodemailerService) {}

	async sendCodeFirstAccess(newUser: User, firstAccessToken: string) {
		const { firstName, lastName, email } = newUser;

		this.nodemailerService.sendMailQueue({
			fromName: `${firstName} ${lastName}`,
			destination: email,
			subject: `Olá ${firstName} ${lastName}, crie sua senha em ${envConfig.SITE_NAME}`,
			message: `
					Aqui está o código para você criar sua senha:<br />
					<b>${firstAccessToken}</b><br /><br />
					Clique no link abaixo para criar a senha:<br />
					<a href="${envConfig.FRONTEND_URL}/auth/password-create?email=${email}" target="_blank">Clique aqui para criar sua senha</a>
				`,
		});
	}
}
