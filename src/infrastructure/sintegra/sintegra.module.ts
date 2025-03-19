import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SintegraService } from './shared/sintegra.service';
import { SintegraController } from 'src/api/sintegra/sintegra.controller';
import { RedisProvider } from '../redis/redis';
import { HelperProvider } from 'src/utils/helper.provider';

@Module({
	imports: [HttpModule],
	providers: [SintegraService, RedisProvider, HelperProvider],
	exports: [SintegraService],
	controllers: [SintegraController],
})
export class SintegraModule {}
