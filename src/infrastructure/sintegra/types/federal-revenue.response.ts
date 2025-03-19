class SintegraActivityResponse {
	code: string;
	text: string;
}

class SintegraShareholderResponse {
	qual: string;
	qual_rep_legal: string | null;
	nome_rep_legal: string | null;
	pais_origem: string;
	nome: string;
	faixa_etaria: string;
	tax_id: string;
	tipo_socio: string;
	cod_tipo_socio: string;
	data_entrada: string;
}

class SintegraIBGEResponse {
	codigo_municipio: string;
	codigo_uf: string;
	ibge_municipio: string;
}

class SintegraCNPJGroupResponse {
	cnpj: string;
	uf: string;
	tipo: string;
}

export class SintegraCompanyResponse {
	code: string;
	status: string;
	message: string;
	cnpj: string;
	nome: string;
	fantasia: string;
	cep: string;
	uf: string;
	municipio: string;
	bairro: string;
	tipo_logradouro: string | null;
	logradouro: string;
	numero: string;
	complemento: string;
	telefone: string;
	email: string;
	capital_social: string;
	data_situacao: string;
	data_situacao_especial: string;
	abertura: string;
	motivo_situacao: string;
	sigla_natureza_juridica: string;
	natureza_juridica: string;
	situacao: string;
	situacao_especial: string;
	tipo: string;
	atividade_principal: SintegraActivityResponse[];
	atividades_secundarias: SintegraActivityResponse[];
	qsa: SintegraShareholderResponse[];
	ultima_atualizacao: string;
	efr: string;
	extra: string | null;
	porte: string;
	ibge: SintegraIBGEResponse;
	cnpjs_do_grupo: SintegraCNPJGroupResponse[];
	inscricao_municipal: string;
	version: string;
}

// Mapeamento de resposta para inglês
interface MainActivity {
	code: string;
	text: string;
}

interface SecondaryActivity {
	code: string;
	text: string;
}

interface Shareholder {
	role: string;
	legalRepresentativeRole: string | null;
	legalRepresentativeName: string | null;
	countryOfOrigin: string;
	name: string;
	ageGroup: string;
	taxId: string;
	shareholderType: string;
	shareholderTypeCode: string;
	entryDate: string;
}

interface IBGE {
	municipalityCode: string;
	stateCode: string;
	municipalityName: string;
}

interface GroupCNPJ {
	cnpj: string;
	state: string;
	type: string;
}

export interface SintegraCompanyResponseMapped {
	code: string;
	status: string;
	message: string;
	cnpj: string;
	name: string;
	fantasyName: string;
	zipCode: string;
	state: string;
	municipality: string;
	neighborhood: string;
	streetType: string | null;
	street: string;
	number: string;
	complement: string;
	phone: string;
	email: string;
	socialCapital: string;
	situationDate: string;
	specialSituationDate: string;
	openingDate: string;
	situationReason: string;
	legalNatureAbbreviation: string;
	legalNature: string;
	situation: string;
	specialSituation: string;
	type: string;
	mainActivity: MainActivity[];
	secondaryActivities: SecondaryActivity[];
	shareholders: Shareholder[];
	lastUpdate: string;
	efr: string;
	extra: string | null;
	size: string;
	ibge: IBGE;
	groupCNPJs: GroupCNPJ[];
	municipalRegistration: string;
	version: string;
}
