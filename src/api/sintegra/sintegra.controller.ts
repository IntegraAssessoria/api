import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SintegraService } from 'src/infrastructure/sintegra/shared/sintegra.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('sintegra')
@ApiBearerAuth('JWT')
export class SintegraController {
	constructor(private readonly sintegraService: SintegraService) {}

	@UseGuards(new JwtAuthGuard(['admin', 'seller', 'store']))
	@Get('/balance')
	async balance() {
		return await this.sintegraService.balance();
	}

	// @UseGuards(new JwtAuthGuard(['admin', 'seller', 'store']))
	@Get('/:cnpj')
	async federalRevenueCNPJ(@Param('cnpj') cnpj: string) {
		return await this.sintegraService.federalRevenueCNPJ(cnpj);
	}
}
