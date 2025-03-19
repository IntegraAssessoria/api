import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MediaService } from './medias.service';
import { MediaController } from './medias.controller';
import { StorageModule } from 'src/infrastructure/storage/storage.module';
import { HelperProvider } from 'src/utils/helper.provider';
import { RedisProvider } from 'src/infrastructure/redis/redis';

@Module({
	imports: [StorageModule],
	providers: [PrismaService, MediaService, HelperProvider, RedisProvider],
	controllers: [MediaController],
	exports: [MediaService],
})
export class MediaModule {}
