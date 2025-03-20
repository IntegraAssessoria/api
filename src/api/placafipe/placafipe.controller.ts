import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SintegraService } from 'src/infrastructure/sintegra/shared/sintegra.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { PlacaFipeService } from 'src/infrastructure/placafipe/shared/placafipe.service';

@Controller('placafipe')
@ApiBearerAuth('JWT')
export class PlacaFipeController {
	constructor(private readonly placaFipe: PlacaFipeService) {}

	// @UseGuards(new JwtAuthGuard(['admin', 'seller', 'store']))
	@Get('/getquotas')
	async getquotas() {
		return await this.placaFipe.getquotas();
	}

	@Get('/:plate')
	async getPlate(@Param('plate') plate: string) {
		return await this.placaFipe.getPlate(plate);
	}
}
