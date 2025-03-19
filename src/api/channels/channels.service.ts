import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Channel } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ChannelCreate } from './dtos/channels-create.dto';
import { StorageService } from 'src/infrastructure/storage/shared/storage.service';
import { HelperProvider } from 'src/utils/helper.provider';
import { ChannelUpdate } from './dtos/channels-update.dto';
import { RedisProvider } from 'src/infrastructure/redis/redis';

@Injectable()
export class ChannelService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly storageService: StorageService,
		private readonly helperProvider: HelperProvider,
		private readonly redisProvider: RedisProvider,
	) {}

	private imageWidthDimension: number = 250;
	private cacheKey = 'cache:channel:getAll';

	async getAll(): Promise<Channel[]> {
		const cached = await this.redisProvider.get<Channel[]>(this.cacheKey);
		if (cached) {
			return cached;
		}

		const items = await this.prisma.channel.findMany();
		await this.redisProvider.set<Channel[]>(this.cacheKey, items, 84600 * 30);
		return items;
	}

	async create(body: ChannelCreate): Promise<Channel> {
		const slug = this.helperProvider.cuid2(20);
		if (this.helperProvider.isBase64Image(body.image)) {
			const realWidth = this.helperProvider.dimensionsBase64Img(body.image).width;
			const image = await this.storageService.uploadBase64Image(
				body.image,
				slug,
				'channels',
				100,
				realWidth >= this.imageWidthDimension ? this.imageWidthDimension : realWidth,
			);
			body.image = image.toString();
		}

		const create = await this.prisma.channel.create({
			data: {
				id: this.helperProvider.generateDbId(),
				name: body.name,
				description: body.description,
				image: body.image,
				url: body.url,
			},
		});

		await this.redisProvider.del(this.cacheKey);

		return create;
	}

	async update(id: string, body: ChannelUpdate): Promise<Channel> {
		const { description, name, url } = body;
		const update = await this.prisma.channel.update({
			where: {
				id,
			},
			data: {
				description,
				name,
				url,
			},
		});

		await this.redisProvider.del(this.cacheKey);

		return update;
	}

	async delete(id: string): Promise<Channel> {
		const channel = await this.prisma.channel.findFirst({
			where: {
				id,
			},
		});

		if (!channel) {
			throw new NotFoundException();
		}

		if (channel.image) {
			await this.storageService.removeFile(channel.image);
		}

		const remove = await this.prisma.channel.delete({
			where: {
				id,
			},
		});

		await this.redisProvider.del(this.cacheKey);

		return remove;
	}
}
