import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RedisProvider } from '../redis/redis';
import { HelperProvider } from 'src/utils/helper.provider';
import { PlacaFipeService } from './shared/placafipe.service';
import { PlacaFipeController } from 'src/api/placafipe/placafipe.controller';

@Module({
	imports: [HttpModule],
	providers: [PlacaFipeService, RedisProvider, HelperProvider],
	exports: [PlacaFipeService],
	controllers: [PlacaFipeController],
})
export class PlacaFipeModule {}
