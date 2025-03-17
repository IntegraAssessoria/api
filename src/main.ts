import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envConfig } from './environment/env';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter({
			bodyLimit: 104857600,
			trustProxy: true,
		}),
	);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	app.enableCors({
		origin: '*',
		methods: 'GET,PUT,POST,DELETE',
		preflightContinue: false,
		optionsSuccessStatus: 204,
	});

	app.enableShutdownHooks();

	const config = new DocumentBuilder()
		.setTitle('API Documentation')
		.setVersion('1.0')
		.addTag('api')
		.addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document);

	const APP_PORT = envConfig.APP_PORT;

	await app.listen(APP_PORT, '0.0.0.0');

	app.getHttpServer().once('listening', () => {
		app.getHttpServer().emit('ready');
	});

	Logger.debug(`Swagger running on http://localhost:${APP_PORT}/docs`);
	Logger.debug(`Server running on http://localhost:${APP_PORT}`);
}
bootstrap();
