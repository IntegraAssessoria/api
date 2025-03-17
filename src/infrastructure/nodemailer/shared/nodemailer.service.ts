import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { sendMail } from './nodemailer';

@Injectable()
export class NodemailerService {
	constructor(@InjectQueue('nodemailer') private readonly nodemailerQueue: Queue) {}

	async sendMailQueue(email: sendMail) {
		await this.nodemailerQueue.add(email, {
			removeOnFail: false,
		});

		Logger.verbose(`E-mail adicionado a fila: ${email.subject}`);
	}
}
