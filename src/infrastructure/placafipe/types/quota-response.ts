export class PlacaFipeQuotaResponse {
	codigo: number;
	msg: string;
	limite_diario: number;
	uso_diario: string;
	chassi: boolean;
}

export class PlacaFipeQuota {
	dailyLimit: number;
	usedToday: number;
}
