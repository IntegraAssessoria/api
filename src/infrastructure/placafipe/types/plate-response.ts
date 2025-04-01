export class PlacaFipePlateResponse {
	codigo: number;
	msg: string;
	fipe: {
		similaridade: string;
		correspondencia: string;
		marca: string;
		modelo: string;
		ano_modelo: number;
		codigo_fipe: string;
		codigo_marca: string;
		codigo_modelo: string;
		mes_referencia: string;
		combustivel: string;
		valor: string;
		desvalorizometro: string;
		unidade_valor: string;
	}[];
	informacoes_veiculo: {
		marca: string;
		modelo: string;
		ano: string;
		ano_modelo: string;
		cor: string;
		chassi: string;
		motor: string;
		municipio: string;
		uf: string;
		segmento: string;
		sub_segmento: string;
		placa: string;
	};
	tempo: number;
	undiade_tempo: string;
	unidade_tempo: string;
	algoritmo: string;
	placa: string;
}

export class PlacaFipePlateMapped {
	fipe: {
		similarity: string;
		match: string;
		brand: string;
		model: string;
		modelYear: number;
		fipeCode: string;
		brandCode: string;
		modelCode: string;
		referenceMonth: string;
		fuel: string;
		value: string;
		depreciationMeter: string;
		valueUnit: string;
	};
	vehicleInformation: {
		brand: string;
		model: string;
		year: string;
		modelYear: string;
		color: string;
		chassis: string;
		engine: string;
		city: string;
		state: string;
		segment: string;
		subSegment: string;
		licensePlate: string;
	};
}
