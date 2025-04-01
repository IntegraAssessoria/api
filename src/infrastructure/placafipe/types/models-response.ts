export class PlacaFipeModelDataResponse {
	codigo_modelo: string;
	descricao: string;
	codigo_fipe: string;
	marca_descricao: string;
}

export class PlacaFipeModelResponse {
	codigo: number;
	msg: string;
	tempo: number;
	unidade_tempo: string;
	dados: PlacaFipeModelDataResponse[];
}

export class PlacaFipeModelResponseMapped {
	modelCode: string;
	description: string;
	fipeCode: string;
	brand: string;
}
