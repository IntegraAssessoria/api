import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordHashProvider } from 'src/utils/password-hash.provider';
import { AuthResponse } from '../types/auth-response';
import { PayloadToken } from '../dto/payloadToken';
import { Login } from '../dto/login';
import { PrismaService } from 'src/prisma.service';
import { FirstAccessDTO } from '../dto/first-access';
import { HelperProvider } from 'src/utils/helper.provider';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly prisma: PrismaService,
		private readonly passwordHashProvider: PasswordHashProvider,
		private readonly helperProvider: HelperProvider,
	) {}

	async login(login: Login): Promise<AuthResponse> {
		const { email, password } = login;

		const user = await this.getUserByEmail(email);

		if (!user.password) {
			throw new HttpException(
				{
					status: HttpStatus.UNAUTHORIZED,
					error: 'Usuário não possui senha cadastrada.',
				},
				HttpStatus.UNAUTHORIZED,
			);
		}

		const verifyHash = await this.passwordHashProvider.comparer(password, user.password);

		if (!verifyHash) {
			throw new HttpException(
				{
					status: HttpStatus.UNAUTHORIZED,
					error: 'E-mail e/ou senha incorretos.',
				},
				HttpStatus.UNAUTHORIZED,
			);
		}

		const token = await this.generateJwtToken({
			userId: user.id,
			type: user.type,
			userName: `${user.firstName} ${user.lastName}`,
			storeId: user.storeId,
		});

		return {
			accessToken: token,
			expiresIn: `${process.env.JWT_EXPIRES}s`,
			email: user.email,
			id: user.id,
			name: user.firstName,
			type: user.type,
		};
	}

	async getUserByEmail(email: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				email: email,
			},
			select: {
				id: true,
				firstName: true,
				lastName: true,
				email: true,
				password: true,
				firstAccessToken: true,
				firstAccessTokenExpiration: true,
				createdAt: true,
				type: true,
				storeId: true,
			},
		});

		if (!user) {
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					error: 'Usuário não cadastrado.',
				},
				HttpStatus.BAD_REQUEST,
			);
		}

		return user;
	}

	async firstAccess(firstAccess: FirstAccessDTO): Promise<{ message: string }> {
		const user = await this.getUserByEmail(firstAccess.email);

		if (firstAccess.code !== user.firstAccessToken) {
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					error: 'Código inválido ou e-mail inválido.',
				},
				HttpStatus.BAD_REQUEST,
			);
		}

		if (user.password !== null) {
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					error: `Esse e-mail ${user.email} já possui senha criada.`,
				},
				HttpStatus.BAD_REQUEST,
			);
		}

		if (user.firstAccessTokenExpiration < this.helperProvider.dayjs().toDate()) {
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					error: 'Código expirado.',
				},
				HttpStatus.BAD_REQUEST,
			);
		}

		const hash = await this.passwordHashProvider.hash(firstAccess.newPassword);

		await this.prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				password: hash,
				firstAccessToken: '',
				firstAccessTokenExpiration: null,
			},
		});

		return {
			message: 'Sua senha de acesso foi criada.',
		};
	}

	protected async generateJwtToken(payload: PayloadToken): Promise<string> {
		return await this.jwtService.signAsync(payload);
	}
}
