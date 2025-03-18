import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ChannelService } from './channels.service';
import { ChannelController } from './channels.controller';
import { StorageModule } from 'src/infrastructure/storage/storage.module';
import { HelperProvider } from 'src/utils/helper.provider';

@Module({
	imports: [StorageModule],
	providers: [PrismaService, ChannelService, HelperProvider],
	controllers: [ChannelController],
	exports: [ChannelService],
})
export class ChannelModule {}
