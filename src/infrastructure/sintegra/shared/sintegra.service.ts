import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { envConfig } from 'src/environment/env';
import { SintegraBalance, SintegraBalanceResponse } from '../types/balance-response';
import { RedisProvider } from 'src/infrastructure/redis/redis';
import { HelperProvider } from 'src/utils/helper.provider';
import { SintegraCompanyResponse, SintegraCompanyResponseMapped } from '../types/federal-revenue.response';

@Injectable()
export class SintegraService {
	constructor(
		private readonly httpService: HttpService,
		private readonly redisProvider: RedisProvider,
		private readonly helperProvider: HelperProvider,
	) {}

	private TOKEN = envConfig.SINTEGRA_TOKEN;
	private URL = envConfig.SINTEGRA_URL;
	private CACHE_BALANCE_KEY = 'cache:sintegra:balance';
	private CACHE_CNPJ_KEY = 'cache:sintegra:cnpj';

	async balance(): Promise<SintegraBalance | false> {
		const cached = await this.redisProvider.get<SintegraBalance>(this.CACHE_BALANCE_KEY);

		if (cached) {
			return cached;
		}

		try {
			const apiResponse = await firstValueFrom(
				this.httpService.get<SintegraBalanceResponse>(`${this.URL}/consulta-saldo.php?token=${this.TOKEN}`),
			);

			const response = {
				availableCredits: Number(apiResponse.data.qtd_consultas_disponiveis),
			};

			await this.redisProvider.set<SintegraBalance>(this.CACHE_BALANCE_KEY, response, 30);

			return response;
		} catch {
			return false;
		}
	}

	async federalRevenueCNPJ(cnpj: string): Promise<SintegraCompanyResponseMapped | false> {
		const clearCnpj = this.helperProvider.clearFields(this.helperProvider.clearSpecial(cnpj));
		const cached = await this.redisProvider.get<SintegraCompanyResponseMapped>(`${this.CACHE_CNPJ_KEY}:${cnpj}`);

		if (cached) {
			return cached;
		}

		try {
			const apiResponse = await firstValueFrom(
				this.httpService.get<SintegraCompanyResponse>(
					`${this.URL}/execute-api.php?token=${this.TOKEN}&cnpj=${cnpj}&plugin=RF`,
				),
			);

			const mappedResponse = this.helperProvider.mapSintegraFederalRevenueFieldsToEnglish(apiResponse.data);

			await this.redisProvider.set<SintegraCompanyResponseMapped>(
				`${this.CACHE_CNPJ_KEY}:${cnpj}`,
				mappedResponse,
				86400 * 30,
			);

			return mappedResponse;
		} catch {
			return false;
		}
	}
}
