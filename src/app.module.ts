import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RedisModule } from '@nestjs-modules/ioredis';
import { envConfig } from './environment/env';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './api/auth/auth.module';
import { PrismaClient } from '@prisma/client';
import { PrismaInterceptor } from './middlewares/interceptors/prisma.interceptor';
import { UserModule } from './api/users/user.module';
import { ChannelModule } from './api/channels/channels.module';
import { MediaModule } from './api/medias/medias.module';
import { StoreModule } from './api/stores/stores.module';
import { SintegraModule } from './infrastructure/sintegra/sintegra.module';
import { VehicleModule } from './infrastructure/placafipe/placafipe.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		ScheduleModule.forRoot(),
		ThrottlerModule.forRoot([
			{
				ttl: 1000, // Tempo em segundos (1 segundo)
				limit: 30, // Limite de 5 requisições por segundo
			},
		]),
		RedisModule.forRoot({
			url: `redis://${envConfig.REDIS_USER}:${envConfig.REDIS_PASSWORD}@${envConfig.REDIS_HOST}:${envConfig.REDIS_PORT}`,
			type: 'single',
		}),
		BullModule.forRoot({
			redis: {
				host: envConfig.REDIS_HOST,
				port: envConfig.REDIS_PORT,
				username: envConfig.REDIS_USER,
				password: envConfig.REDIS_PASSWORD,
			},
		}),
		AuthModule,
		UserModule,
		StoreModule,
		ChannelModule,
		MediaModule,
		SintegraModule,
		VehicleModule,
	],
	providers: [
		{
			provide: PrismaClient,
			useValue: new PrismaClient(),
		},
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: PrismaInterceptor,
		},
	],
})
export class AppModule {}
