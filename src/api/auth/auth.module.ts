import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt/constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';
import { NodemailerModule } from 'src/infrastructure/nodemailer/nodemailer.module';
import { HelperProvider } from 'src/utils/helper.provider';
import { RedisProvider } from 'src/infrastructure/redis/redis';
import { PasswordHashProvider } from 'src/utils/password-hash.provider';
import { AuthPassword } from './services/password.service';
import { AuthPasswordController } from './controllers/password.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
	imports: [
		PassportModule,
		NodemailerModule,
		JwtModule.register({
			global: true,
			secret: jwtConstants.secret,
			signOptions: { expiresIn: jwtConstants.expires },
		}),
	],
	controllers: [AuthController, AuthPasswordController],
	providers: [
		AuthService,
		JwtStrategy,
		PrismaService,
		HelperProvider,
		RedisProvider,
		PasswordHashProvider,
		AuthPassword,
	],
})
export class AuthModule {}
