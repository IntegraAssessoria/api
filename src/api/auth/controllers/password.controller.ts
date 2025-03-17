import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ChangePasswordDTO } from '../dto/change-password';
import { ResetPasswordDTO } from '../dto/reset-password';
import { DbIdValidationPipe } from 'src/middlewares/pipes/cuid2-validation.pipe';
import { Throttle } from '@nestjs/throttler';
import { AuthPassword } from '../services/password.service';
import { LoggedUserType } from 'src/middlewares/decorators/logged-user';
import { LoggedUser } from 'src/middlewares/decorators/logged-user.decorator';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User change password')
@Throttle({ default: { limit: 3, ttl: 1000 } })
@Controller('auth/password')
export class AuthPasswordController {
	constructor(private readonly authPassword: AuthPassword) {}

	// Para solicitação de recuperação de senha no login
	@Post('request-reset')
	async requestResetPassword(@Body() resetPassword: ResetPasswordDTO): Promise<{ message: string }> {
		return await this.authPassword.requestCodeResetPassword(resetPassword);
	}

	// Para alteração de senha no login
	@Post('change/:userId')
	async resetChangePassword(
		@Param('userId', DbIdValidationPipe) userId: string,
		@Body() changePassword: ChangePasswordDTO,
	) {
		return await this.authPassword.changeResetPassword(userId, changePassword);
	}

	// Para solicitação de alteração de senha logado
	@UseGuards(new JwtAuthGuard(['admin']))
	@Post('request-change')
	async requestChangePassword(@LoggedUser() loggedUser: LoggedUserType) {
		return await this.authPassword.requestCodeChangePassword(loggedUser);
	}

	// Para alteração de senha logado
	@UseGuards(new JwtAuthGuard(['admin']))
	@Post('change')
	async changePassword(@Body() changePassword: ChangePasswordDTO, @LoggedUser() loggedUser: LoggedUserType) {
		return await this.authPassword.changePassword(changePassword, loggedUser);
	}
}
