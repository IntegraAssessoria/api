import { Injectable } from '@nestjs/common';
import { Channel } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ChannelCreate } from './dtos/channels-create.dto';
import { StorageService } from 'src/infrastructure/storage/shared/storage.service';
import { HelperProvider } from 'src/utils/helper.provider';
import { envConfig } from 'src/environment/env';

@Injectable()
export class ChannelService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly storageService: StorageService,
		private readonly helperProvider: HelperProvider,
	) {}

	private imageWidthDimension: number = 250;

	async getAll(): Promise<Channel[]> {
		return await this.prisma.channel.findMany();
	}

	async create(body: ChannelCreate) {
		const slug = this.helperProvider.cuid2(20);
		if (this.helperProvider.isBase64Image(body.image)) {
			const realWidth = this.helperProvider.dimensionsBase64Img(body.image).width;
			const image = await this.storageService.uploadBase64Image(
				body.image,
				slug,
				envConfig.STORAGE_PUBLIC_BUCKET,
				'channels',
				100,
				realWidth >= this.imageWidthDimension ? this.imageWidthDimension : realWidth,
			);
			body.image = image.toString();
		}

		return await this.prisma.channel.create({
			data: {
				id: this.helperProvider.generateDbId(),
				name: body.name,
				description: body.description,
				image: body.image,
				url: body.url,
			},
		});
		console.log(body);
	}
}
