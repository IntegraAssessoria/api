import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ChannelService } from './channels.service';
import { ChannelController } from './channels.controller';
import { StorageModule } from 'src/infrastructure/storage/storage.module';
import { HelperProvider } from 'src/utils/helper.provider';
import { RedisProvider } from 'src/infrastructure/redis/redis';

@Module({
	imports: [StorageModule],
	providers: [PrismaService, ChannelService, HelperProvider, RedisProvider],
	controllers: [ChannelController],
	exports: [ChannelService],
})
export class ChannelModule {}
