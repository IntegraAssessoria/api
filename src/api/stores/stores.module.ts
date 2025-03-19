import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { StoreService } from './stores.service';
import { StoreController } from './stores.controller';
import { StorageModule } from 'src/infrastructure/storage/storage.module';
import { HelperProvider } from 'src/utils/helper.provider';
import { RedisProvider } from 'src/infrastructure/redis/redis';

@Module({
	imports: [StorageModule],
	providers: [PrismaService, StoreService, HelperProvider, RedisProvider],
	controllers: [StoreController],
	exports: [StoreService],
})
export class StoreModule {}
