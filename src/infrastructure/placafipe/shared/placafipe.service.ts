import { HttpService } from '@nestjs/axios';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { envConfig } from 'src/environment/env';
import { RedisProvider } from 'src/infrastructure/redis/redis';
import { HelperProvider } from 'src/utils/helper.provider';
import { PlacaFipeQuota, PlacaFipeQuotaResponse } from '../types/quota-response';
import { PlacaFipePlateMapped, PlacaFipePlateResponse } from '../types/plate-response';
import { PlacaFipeBrandMapped, PlacaFipeBrandRequest } from '../types/brands-response';
import {
	PlacaFipeModelDataResponse,
	PlacaFipeModelResponse,
	PlacaFipeModelResponseMapped,
} from '../types/models-response';

@Injectable()
export class PlacaFipeService {
	constructor(
		private readonly httpService: HttpService,
		private readonly redisProvider: RedisProvider,
		private readonly helperProvider: HelperProvider,
	) {}

	private TOKEN = envConfig.PLACA_FIPE_TOKEN;
	private URL = envConfig.PLACA_FIPE_URL;
	private CACHE_QUOTA_KEY = 'cache:vehicle:quota';
	private CACHE_PLATE_KEY = 'cache:vehicle:plate';
	private CACHE_BRAND_KEY = 'cache:vehicle:brand';
	private CACHE_MODELS_KEY = 'cache:vehicle:models';

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
		const clearPlate = this.helperProvider.clearSpecial(plate).toUpperCase();
		const cached = await this.redisProvider.get<PlacaFipePlateMapped>(`${this.CACHE_PLATE_KEY}:${clearPlate}`);

		if (cached) {
			return cached;
		}

		try {
			const apiResponse = await firstValueFrom(
				this.httpService.post<PlacaFipePlateResponse>(
					`${this.URL}/getplacafipe`,
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

	async getBrands() {
		const cached = await this.redisProvider.get<PlacaFipeBrandMapped[]>(this.CACHE_BRAND_KEY);

		if (cached) {
			return cached;
		}

		try {
			const apiResponse = await firstValueFrom(
				this.httpService.post<PlacaFipeBrandRequest>(
					`${this.URL}/get-marcas`,
					{ token: this.TOKEN },
					{ headers: { 'Content-Type': 'application/json' } },
				),
			);

			const brands: PlacaFipeBrandMapped[] = [];
			if (apiResponse.data.dados.length > 0) {
				apiResponse.data.dados.forEach((item) => {
					brands.push({
						brandCode: item.codigo_marca,
						description: item.descricao,
						vehicleType: item.veiculo_tipo,
						vehicleTypeId: item.veiculo_tipo_id,
					});
				});

				await this.redisProvider.set<PlacaFipeBrandMapped[]>(this.CACHE_BRAND_KEY, brands, 84600 * 30);

				return brands;
			}

			return [];
		} catch {
			return [];
		}
	}

	async getModels(brandCode: string): Promise<PlacaFipeModelResponseMapped[]> {
		const cached = await this.redisProvider.get<PlacaFipeModelResponseMapped[]>(
			`${this.CACHE_MODELS_KEY}:${brandCode}`,
		);

		if (cached) {
			return cached;
		}

		try {
			const apiResponse = await firstValueFrom(
				this.httpService.post<PlacaFipeModelResponse>(
					`${this.URL}/get-modelos`,
					{ token: this.TOKEN, codigo_marca: brandCode },
					{ headers: { 'Content-Type': 'application/json' } },
				),
			);

			if (apiResponse.data.dados.length > 0) {
				const vehicleModels: PlacaFipeModelResponseMapped[] = apiResponse.data.dados.map((item) => ({
					modelCode: item.codigo_modelo,
					description: item.descricao,
					fipeCode: item.codigo_fipe,
					brand: item.marca_descricao,
				}));

				await this.redisProvider.set<PlacaFipeModelResponseMapped[]>(
					`${this.CACHE_MODELS_KEY}:${brandCode}`,
					vehicleModels,
					86400 * 30,
				);

				return vehicleModels;
			} else {
				return [];
			}
		} catch {
			return [];
		}
	}
}
