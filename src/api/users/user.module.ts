import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

import { NodemailerModule } from 'src/infrastructure/nodemailer/nodemailer.module';
import { HelperProvider } from 'src/utils/helper.provider';
import { RedisProvider } from 'src/infrastructure/redis/redis';
import { UserNotificationService } from './services/notification.service';
import { UserValidationService } from './services/user-validation.service';
import { PrismaService } from 'src/prisma.service';

@Module({
	imports: [NodemailerModule],
	providers: [
		UserService,
		UserNotificationService,
		UserValidationService,
		PrismaService,
		HelperProvider,
		RedisProvider,
	],
	controllers: [UserController],
	exports: [UserService],
})
export class UserModule {}
