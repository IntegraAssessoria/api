export class PlacaFipePlateResponse {
	codigo: number;
	msg: string;
	placa: string;
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
	unidade_tempo: string;
}

export class PlacaFipePlateMapped {
	code: number;
	message: string;
	plate: string;
	vehicle_information: {
		brand: string;
		model: string;
		year: string;
		model_year: string;
		color: string;
		chassis: string;
		engine: string;
		city: string;
		state: string;
		segment: string;
		sub_segment: string;
		plate: string;
	};
	time: number;
	time_unit: string;
}
