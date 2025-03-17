import { Injectable } from '@nestjs/common';
import { Store } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StoreService {
	constructor(private readonly prisma: PrismaService) {}

	async getAll(): Promise<Store[]> {
		return await this.prisma.store.findMany();
	}
}
