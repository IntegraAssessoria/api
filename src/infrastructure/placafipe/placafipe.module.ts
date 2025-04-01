import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RedisProvider } from '../redis/redis';
import { HelperProvider } from 'src/utils/helper.provider';
import { PlacaFipeService } from './shared/placafipe.service';
import { PrismaService } from 'src/prisma.service';
import { VehicleController } from 'src/api/vehicle/vehicle.controller';

@Module({
	imports: [HttpModule],
	providers: [PlacaFipeService, RedisProvider, HelperProvider, PrismaService],
	exports: [PlacaFipeService],
	controllers: [VehicleController],
})
export class VehicleModule {}
