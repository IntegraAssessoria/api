import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { envConfig } from 'src/environment/env';
import { RedisProvider } from 'src/infrastructure/redis/redis';
import { HelperProvider } from 'src/utils/helper.provider';
import { PlacaFipeQuota, PlacaFipeQuotaResponse } from '../types/quota-response';
import { PlacaFipePlateMapped, PlacaFipePlateResponse } from '../types/plate-response';

@Injectable()
export class PlacaFipeService {
	constructor(
		private readonly httpService: HttpService,
		private readonly redisProvider: RedisProvider,
		private readonly helperProvider: HelperProvider,
	) {}

	private TOKEN = envConfig.PLACA_FIPE_TOKEN;
	private URL = envConfig.PLACA_FIPE_URL;
	private CACHE_QUOTA_KEY = 'cache:placafipe:quota';
	private CACHE_PLATE_KEY = 'cache:placafipe:cnpj';

	async getquotas(): Promise<PlacaFipeQuota | { error: string }> {
		const cached = await this.redisProvider.get<PlacaFipeQuota>(this.CACHE_QUOTA_KEY);

		if (cached) {
			return cached;
		}

		try {
			const apiResponse = await firstValueFrom(
				this.httpService.post<PlacaFipeQuotaResponse>(
					`${this.URL}/getquotas`,
					{
						token: this.TOKEN,
					},
					{
						headers: {
							'Content-Type': 'application/json',
						},
					},
				),
			);

			const response: PlacaFipeQuota = {
				dailyLimit: apiResponse.data.limite_diario,
				usedToday: Number(apiResponse.data.uso_diario),
			};

			await this.redisProvider.set<PlacaFipeQuota>(this.CACHE_QUOTA_KEY, response, 30);

			return response;
		} catch {
			return {
				error: 'Erro ao buscar informações da quota',
			};
		}
	}

	async getPlate(plate: string): Promise<PlacaFipePlateMapped | { error: string }> {
		const clearPlate = this.helperProvider.clearSpecial(plate);
		const cached = await this.redisProvider.get<PlacaFipePlateMapped>(`${this.CACHE_PLATE_KEY}:${clearPlate}`);

		if (cached) {
			return cached;
		}

		try {
			const apiResponse = await firstValueFrom(
				this.httpService.post<PlacaFipePlateResponse>(
					`${this.URL}/getplaca`,
					{
						token: this.TOKEN,
						placa: clearPlate,
					},
					{
						headers: {
							'Content-Type': 'application/json',
						},
					},
				),
			);

			const mappedResponse = this.helperProvider.mapPlacaFipePlateToEnglish(apiResponse.data);

			await this.redisProvider.set<PlacaFipePlateMapped>(
				`${this.CACHE_PLATE_KEY}:${clearPlate}`,
				mappedResponse,
				86400 * 30,
			);

			return mappedResponse;
		} catch {
			return {
				error: 'Erro ao buscar informações do veículo',
			};
		}
	}
}
