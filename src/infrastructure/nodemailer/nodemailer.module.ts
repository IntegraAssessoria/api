import { Module } from '@nestjs/common';
import { NodemailerService } from './shared/nodemailer.service';
import { BullModule } from '@nestjs/bull';
import { BullNodemailerServiceProcessor } from './bull/bull.processor';

const QUEUE_NAME = 'nodemailer';

@Module({
	imports: [
		BullModule.registerQueue({
			name: QUEUE_NAME,
			defaultJobOptions: {
				attempts: 3,
				backoff: {
					type: 'exponential',
					delay: 1000,
				},
				removeOnComplete: true,
			},
		}),
	],
	providers: [NodemailerService, BullNodemailerServiceProcessor],
	exports: [NodemailerService],
})
export class NodemailerModule {}
