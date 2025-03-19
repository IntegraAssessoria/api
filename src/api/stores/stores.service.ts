import { Injectable, NotFoundException } from '@nestjs/common';
import { Store } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { StoreCreate } from './dtos/stores-create.dto';
import { StorageService } from 'src/infrastructure/storage/shared/storage.service';
import { HelperProvider } from 'src/utils/helper.provider';
import { StoreUpdate } from './dtos/stores-update.dto';
import { RedisProvider } from 'src/infrastructure/redis/redis';

@Injectable()
export class StoreService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly storageService: StorageService,
		private readonly helperProvider: HelperProvider,
		private readonly redisProvider: RedisProvider,
	) {}

	private imageWidthDimension: number = 250;
	private cacheKey = 'cache:store:getAll';

	async getAll(): Promise<Store[]> {
		const cached = await this.redisProvider.get<Store[]>(this.cacheKey);
		if (cached) {
			return cached;
		}

		const items = await this.prisma.store.findMany();
		await this.redisProvider.set<Store[]>(this.cacheKey, items, 84600 * 30);
		return items;
	}

	async create(body: StoreCreate): Promise<Store> {
		if (this.helperProvider.isBase64Image(body.image)) {
			const slug = this.helperProvider.cuid2(20);
			const realWidth = this.helperProvider.dimensionsBase64Img(body.image).width;
			const image = await this.storageService.uploadBase64Image(
				body.image,
				slug,
				'stores',
				100,
				realWidth >= this.imageWidthDimension ? this.imageWidthDimension : realWidth,
			);
			body.image = image.toString();
		}

		const create = await this.prisma.store.create({
			data: {
				id: this.helperProvider.generateDbId(),
				name: body.name,
				image: body.image,
			},
		});

		await this.redisProvider.del(this.cacheKey);

		return create;
	}

	async update(id: string, body: StoreUpdate): Promise<Store> {
		const item = await this.prisma.store.findFirst({
			where: {
				id,
			},
		});

		if (!item) {
			throw new NotFoundException();
		}

		if (this.helperProvider.isBase64Image(body.image)) {
			const slug = this.helperProvider.cuid2(20);
			const realWidth = this.helperProvider.dimensionsBase64Img(body.image).width;
			const image = await this.storageService.uploadBase64Image(
				body.image,
				slug,
				'stores',
				100,
				realWidth >= this.imageWidthDimension ? this.imageWidthDimension : realWidth,
			);
			body.image = image.toString();

			if (item.image && item.image !== '') {
				await this.storageService.removeFile(item.image);
			}
		}

		const { name, image } = body;
		const update = await this.prisma.store.update({
			where: {
				id,
			},
			data: {
				name,

				image,
			},
		});

		await this.redisProvider.del(this.cacheKey);

		return update;
	}

	async delete(id: string): Promise<Store> {
		const store = await this.prisma.store.findFirst({
			where: {
				id,
			},
		});

		if (!store) {
			throw new NotFoundException();
		}

		if (store.image) {
			await this.storageService.removeFile(store.image);
		}

		const remove = await this.prisma.store.delete({
			where: {
				id,
			},
		});

		await this.redisProvider.del(this.cacheKey);

		return remove;
	}
}
