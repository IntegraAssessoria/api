import { Injectable } from '@nestjs/common';
import { createId, init } from '@paralleldrive/cuid2';
import sizeOf from 'image-size';
import * as dayjs from 'dayjs';

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
}
