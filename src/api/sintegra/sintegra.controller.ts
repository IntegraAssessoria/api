import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SintegraService } from 'src/infrastructure/sintegra/shared/sintegra.service';

@Controller('sintegra')
@ApiBearerAuth('JWT')
export class SintegraController {
	constructor(private readonly sintegraService: SintegraService) {}

	@Get('/balance')
	async balance() {
		return await this.sintegraService.balance();
	}

	@Get('/cnpj/:cnpj')
	async federalRevenueCNPJ(@Param('cnpj') cnpj: string) {
		return await this.sintegraService.federalRevenueCNPJ(cnpj);
	}
}
