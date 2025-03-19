import { Injectable } from '@nestjs/common';
import { createId, init } from '@paralleldrive/cuid2';
import sizeOf from 'image-size';
import * as dayjs from 'dayjs';
import { SintegraCompanyResponse } from 'src/infrastructure/sintegra/types/federal-revenue.response';

@Injectable()
export class HelperProvider {
	cuid2(length: number): string {
		const createId = init({
			random: Math.random,
			length: length,
		});

		return createId();
	}

	generateDbId(): string {
		return createId();
	}

	generateProposalUniqCode() {
		const primeiraParte = String(Math.floor(100 + Math.random() * 900));
		const ultimaParte = String(Math.floor(100 + Math.random() * 900));

		const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const parteLetras = Array.from({ length: 3 }, () => letras[Math.floor(Math.random() * letras.length)]).join('');

		return `${primeiraParte}-${parteLetras}-${ultimaParte}`;
	}

	dayjs(date?): dayjs.Dayjs {
		return dayjs(date);
	}

	clearFields(text: string): string {
		return text.replace(/[^0-9]/g, '');
	}

	// Remove special character
	clearSpecial(text: string): string {
		return text.replace(/[^a-zA-Z0-9]/g, '');
	}

	randString(length: number): string {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;

		const shuffledCharacters = characters
			.split('')
			.sort(() => 0.5 - Math.random())
			.join('');
		let result = '';

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * charactersLength);
			result += shuffledCharacters.charAt(randomIndex);
		}

		return result;
	}

	randNumber(length: number): string {
		let result = '';
		const characters = '0123456789';
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	randAuthHash(): string {
		return `${this.randString(3)}${this.randString(3)}`.toUpperCase();
	}

	validateEmail(email: string): boolean {
		const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regexEmail.test(email);
	}

	ucWords(str: string): string {
		return str
			.toLowerCase() // Converte toda a string para minúsculas
			.replace(/(?:^|\s)\S/g, (match) => match.toUpperCase()); // Converte a primeira letra de cada palavra para maiúscula
	}

	isBase64Image(str: string): boolean {
		const base64Header = 'data:image/';
		const imageFormats = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
		if (
			str.startsWith(base64Header) &&
			imageFormats.some((format) => str.indexOf(format) === base64Header.length)
		) {
			return true;
		}
		return false;
	}

	dimensionsBase64Img = (base64Image: string): { height: number; width: number; type: string } => {
		// Remova o prefixo "data:image/png;base64,"
		const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

		// Converta para um Buffer
		const buffer = Buffer.from(base64Data, 'base64');

		// Obtenha as dimensões da imagem
		const dimensions = sizeOf(buffer) as {
			height: number;
			width: number;
			type: string;
		};

		return dimensions;
	};

	// Retorna a pasta e nome do arquivo
	imageNameFromUrl = (url: string): string => {
		return url.split('public/').pop();
	};

	// Função utilizada para validar string de imagens em updates de registros
	validateImageString = (moduleName: string, image: string): boolean => {
		if (image && image !== '') {
			// Expressão regular simples para detectar URLs
			const urlPattern = /https?:\/\/[^\s]+/;

			// Verifica se contém as palavras "companies" ou "webp"
			const hasKeywords = image.includes(moduleName) && image.includes('webp');

			// Verifica se não é uma URL
			const isNotURL = !urlPattern.test(image);

			// Retorna verdadeiro se ambas as condições forem verdadeiras
			if (!hasKeywords || !isNotURL) {
				return false;
			}

			return true;
		}
	};

	minutesToSeconds = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;

		return `${minutes > 0 ? `${minutes}m ` : ''}${remainingSeconds}s`;
	};

	addMinutesToTime = (time: string, minutesToAdd: number): string => {
		const [hours, minutes] = time.split(':').map(Number);
		const date = new Date();
		date.setHours(hours, minutes);
		date.setMinutes(date.getMinutes() + minutesToAdd);

		const newHours = String(date.getHours()).padStart(2, '0');
		const newMinutes = String(date.getMinutes()).padStart(2, '0');

		return `${newHours}:${newMinutes}`;
	};

	mapSintegraFederalRevenueFieldsToEnglish = (data: SintegraCompanyResponse) => {
		return {
			code: data.code,
			status: data.status,
			message: data.message,
			cnpj: data.cnpj,
			name: data.nome, // nome -> name
			fantasyName: data.fantasia, // fantasia -> fantasyName
			zipCode: data.cep, // cep -> zipCode
			state: data.uf, // uf -> state
			municipality: data.municipio, // municipio -> municipality
			neighborhood: data.bairro, // bairro -> neighborhood
			streetType: data.tipo_logradouro, // tipo_logradouro -> streetType
			street: data.logradouro, // logradouro -> street
			number: data.numero, // numero -> number
			complement: data.complemento, // complemento -> complement
			phone: data.telefone, // telefone -> phone
			email: data.email,
			socialCapital: data.capital_social, // capital_social -> socialCapital
			situationDate: data.data_situacao, // data_situacao -> situationDate
			specialSituationDate: data.data_situacao_especial, // data_situacao_especial -> specialSituationDate
			openingDate: data.abertura, // abertura -> openingDate
			situationReason: data.motivo_situacao, // motivo_situacao -> situationReason
			legalNatureAbbreviation: data.sigla_natureza_juridica, // sigla_natureza_juridica -> legalNatureAbbreviation
			legalNature: data.natureza_juridica, // natureza_juridica -> legalNature
			situation: data.situacao, // situacao -> situation
			specialSituation: data.situacao_especial, // situacao_especial -> specialSituation
			type: data.tipo, // tipo -> type
			mainActivity: data.atividade_principal.map((activity) => ({
				code: activity.code,
				text: activity.text,
			})), // atividade_principal -> mainActivity
			secondaryActivities: data.atividades_secundarias.map((activity) => ({
				code: activity.code,
				text: activity.text,
			})), // atividades_secundarias -> secondaryActivities
			shareholders: data.qsa.map((shareholder) => ({
				role: shareholder.qual, // qual -> role
				legalRepresentativeRole: shareholder.qual_rep_legal, // qual_rep_legal -> legalRepresentativeRole
				legalRepresentativeName: shareholder.nome_rep_legal, // nome_rep_legal -> legalRepresentativeName
				countryOfOrigin: shareholder.pais_origem, // pais_origem -> countryOfOrigin
				name: shareholder.nome, // nome -> name
				ageGroup: shareholder.faixa_etaria, // faixa_etaria -> ageGroup
				taxId: shareholder.tax_id, // tax_id -> taxId
				shareholderType: shareholder.tipo_socio, // tipo_socio -> shareholderType
				shareholderTypeCode: shareholder.cod_tipo_socio, // cod_tipo_socio -> shareholderTypeCode
				entryDate: shareholder.data_entrada, // data_entrada -> entryDate
			})), // qsa -> shareholders
			lastUpdate: data.ultima_atualizacao, // ultima_atualizacao -> lastUpdate
			efr: data.efr,
			extra: data.extra,
			size: data.porte, // porte -> size
			ibge: {
				municipalityCode: data.ibge.codigo_municipio, // codigo_municipio -> municipalityCode
				stateCode: data.ibge.codigo_uf, // codigo_uf -> stateCode
				municipalityName: data.ibge.ibge_municipio, // ibge_municipio -> municipalityName
			},
			groupCNPJs: data.cnpjs_do_grupo.map((group) => ({
				cnpj: group.cnpj,
				state: group.uf, // uf -> state
				type: group.tipo, // tipo -> type
			})), // cnpjs_do_grupo -> groupCNPJs
			municipalRegistration: data.inscricao_municipal, // inscricao_municipal -> municipalRegistration
			version: data.version,
		};
	};
}
