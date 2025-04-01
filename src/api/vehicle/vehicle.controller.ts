import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SintegraService } from 'src/infrastructure/sintegra/shared/sintegra.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { PlacaFipeService } from 'src/infrastructure/placafipe/shared/placafipe.service';

@Controller('vehicle')
@ApiBearerAuth('JWT')
export class VehicleController {
	constructor(private readonly placaFipe: PlacaFipeService) {}

	@UseGuards(new JwtAuthGuard(['ADMIN']))
	@Get('/getquotas')
	async getquotas() {
		return await this.placaFipe.getquotas();
	}

	@UseGuards(new JwtAuthGuard())
	@Get('/plate/:plate')
	async getPlate(@Param('plate') plate: string) {
		return await this.placaFipe.getPlate(plate);
	}

	@UseGuards(new JwtAuthGuard())
	@Get('/brands')
	async getBrands() {
		return await this.placaFipe.getBrands();
	}

	// @UseGuards(new JwtAuthGuard())
	@Get('/models/:brandCode')
	async getModels(@Param('brandCode') brandCode: string) {
		return await this.placaFipe.getModels(brandCode);
	}
}
