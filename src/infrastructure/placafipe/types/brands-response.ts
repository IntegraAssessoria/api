export class PlacaFipeBrandRequest {
	codigo: number;
	msg: string;
	tempo: number;
	unidade_tempo: string;
	dados: {
		codigo_marca: string;
		descricao: string;
		veiculo_tipo_id: string;
		veiculo_tipo: string;
	}[];
}

export class PlacaFipeBrandMapped {
	brandCode: string;
	description: string;
	vehicleTypeId: string;
	vehicleType: string;
}
