import { Body, Controller, Post } from '@nestjs/common';
import { Login } from '../dto/login';
import { AuthService } from '../services/auth.service';
import { Throttle } from '@nestjs/throttler';
import { ApiTags } from '@nestjs/swagger';
import { FirstAccessDTO } from '../dto/first-access';

@ApiTags('Auth')
@Throttle({ default: { limit: 3, ttl: 1000 } })
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	async login(@Body() login: Login): Promise<{
		accessToken: string;
		expiresIn: string;
	}> {
		return await this.authService.login(login);
	}

	@Post('first-access')
	async firstAccess(@Body() firstAccess: FirstAccessDTO): Promise<{
		message: string;
	}> {
		return await this.authService.firstAccess(firstAccess);
	}
}
