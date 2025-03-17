import { Process, Processor, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import * as nodemailer from 'nodemailer';
import { sendMail } from '../shared/nodemailer';
import { Logger } from '@nestjs/common';
import { envConfig } from 'src/environment/env';

@Processor('nodemailer')
export class BullNodemailerServiceProcessor {
	private transporter: nodemailer.Transporter;
	constructor() {
		this.transporter = nodemailer.createTransport({
			host: envConfig.SMTP_HOST,
			port: envConfig.SMTP_PORT,
			secure: true,
			auth: {
				user: envConfig.SMTP_USER,
				pass: envConfig.SMTP_PASS,
			},
		});
	}

	@Process()
	async processJob(job: Job<sendMail>): Promise<void> {
		try {
			const { fromName, destination, subject, message } = job.data;

			await this.transporter.sendMail({
				from: `${fromName} <no.reply@textilpro.com.br`,
				to: destination,
				subject: subject,
				html: `<!DOCTYPE html>
						<html>
						<head>
							<meta charset="UTF-8">
							<meta name="viewport" content="width=device-width, initial-scale=1.0">
							<title>Confirmação de Conta</title>
							<style>
								body {
									font-family: Arial, sans-serif;
									background-color: #f4f4f4;
									margin: 30px;
									padding: 0;
								}
								.container {
									max-width: 600px;
									margin: 20px auto;
									background: #ffffff;
									padding: 20px;
									border-radius: 8px;
									box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
									text-align: center;
								}
								h1 {
									color: #333;
								}
								p {
									color: #666;
									font-size: 16px;
								}
								.button {
									display: inline-block;
									padding: 12px 20px;
									margin: 20px 0;
									color: #fff;
									background: #007BFF;
									text-decoration: none;
									font-size: 16px;
									border-radius: 5px;
								}
								.button:hover {
									background: #0056b3;
								}
								.footer {
									margin-top: 20px;
									font-size: 14px;
									color: #999;
								}
							</style>
						</head>
						<body>
							<div class="container">
								<p>${message}</p>
								<br />
								<div><small>Se você não solicitou este e-mail, ignore esta mensagem.</small></div>
								<div class="footer">&copy; 2025 ${envConfig.SITE_NAME}. Todos os direitos reservados.</div>
							</div>
						</body>
						</html>
						`,
			});

			Logger.verbose(`E-mail enviado pela fila: ${job.data.subject} | ${job.data.destination}`);
		} catch (e) {
			Logger.error(e);
		}
	}

	@OnQueueFailed()
	async onQueueFailed(job: Job<sendMail>): Promise<void> {
		console.log(`Falha na fila nodemailer: ${job.data.subject} | ${job.data.destination}`);
	}
}
