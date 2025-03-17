import { config } from 'dotenv';
config({ path: '.env' });

export const envConfig = {
	APP_PORT: process.env.APP_PORT,
	SITE_NAME: process.env.SITE_NAME,
	FRONTEND_URL: process.env.FRONTEND_URL,

	DATABASE_URL: process.env.DATABASE_URL,
	// Auth
	JWT_SECTRET: process.env.JWT_SECTRET,
	JWT_EXPIRES: Number(process.env.JWT_EXPIRES),

	// Redis
	REDIS_HOST: process.env.REDIS_HOST,
	REDIS_PORT: Number(process.env.REDIS_PORT),
	REDIS_USER: process.env.REDIS_USER,
	REDIS_PASSWORD: process.env.REDIS_PASSWORD,
	REDIS_PREFIX: process.env.REDIS_PREFIX,

	// Placa Fipe
	PLACA_FIPE_URL: process.env.PLACA_FIPE_URL,
	PLACA_FIPE_TOKEN: process.env.PLACA_FIPE_TOKEN,

	// SintegraWS
	SINTEGRA_TOKEN: process.env.SINTEGRA_TOKEN,

	// Minio
	STORAGE_PROVIDER: process.env.STORAGE_PROVIDER,
	STORAGE_ENDPOINT: process.env.STORAGE_ENDPOINT,
	STORAGE_PORT: process.env.STORAGE_PORT,
	STORAGE_ACCESS_KEY: process.env.STORAGE_ACCESS_KEY,
	STORAGE_SECRET_KEY: process.env.STORAGE_SECRET_KEY,
	STORAGE_PUBLIC_BUCKET: process.env.STORAGE_PUBLIC_BUCKET,

	// Nodemailer
	SMTP_HOST: process.env.SMTP_HOST,
	SMTP_USER: process.env.SMTP_USER,
	SMTP_PASS: process.env.SMTP_PASS,
	SMTP_PORT: Number(process.env.SMTP_PORT),
};
