import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { StoreService } from './stores.service';
import { StoreController } from './stores.controller';

@Module({
	providers: [PrismaService, StoreService],
	controllers: [StoreController],
	exports: [StoreService],
})
export class StoreModule {}
