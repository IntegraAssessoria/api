import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Media } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { MediaCreate } from './dtos/medias-create.dto';
import { StorageService } from 'src/infrastructure/storage/shared/storage.service';
import { HelperProvider } from 'src/utils/helper.provider';
import { MediaUpdate } from './dtos/medias-update.dto';
import { RedisProvider } from 'src/infrastructure/redis/redis';

@Injectable()
export class MediaService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly storageService: StorageService,
		private readonly helperProvider: HelperProvider,
		private readonly redisProvider: RedisProvider,
	) {}

	private imageWidthDimension: number = 800;
	private cacheKey = 'cache:media:getAll';

	async getAll(): Promise<Media[]> {
		const cached = await this.redisProvider.get<Media[]>(this.cacheKey);
		if (cached) {
			return cached;
		}

		const items = await this.prisma.media.findMany();
		await this.redisProvider.set<Media[]>(this.cacheKey, items, 84600 * 30);
		return items;
	}

	async create(body: MediaCreate) {
		const slug = this.helperProvider.cuid2(20);
		if (this.helperProvider.isBase64Image(body.image)) {
			const realWidth = this.helperProvider.dimensionsBase64Img(body.image).width;
			const image = await this.storageService.uploadBase64Image(
				body.image,
				slug,
				'medias',
				100,
				realWidth >= this.imageWidthDimension ? this.imageWidthDimension : realWidth,
			);
			body.image = image.toString();
		}

		const media = await this.prisma.media.create({
			data: {
				id: this.helperProvider.generateDbId(),
				name: body.name,
				image: body.image,
			},
		});

		await this.redisProvider.del(this.cacheKey);
		return media;
	}

	async update(id: string, body: MediaUpdate) {
		const updatedMedia = await this.prisma.media.update({
			where: { id },
			data: { name: body.name },
		});

		await this.redisProvider.del(this.cacheKey);
		return updatedMedia;
	}

	async delete(id: string) {
		const media = await this.prisma.media.findFirst({
			where: { id },
		});

		if (!media) {
			throw new NotFoundException();
		}

		if (media.image) {
			await this.storageService.removeFile(media.image);
		}

		const remove = await this.prisma.media.delete({
			where: { id },
		});

		await this.redisProvider.del(this.cacheKey);

		return remove;
	}
}
