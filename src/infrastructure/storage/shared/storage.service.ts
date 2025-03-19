import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { envConfig } from 'src/environment/env';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
	private readonly minioClient: Minio.Client;

	constructor() {
		this.minioClient = new Minio.Client({
			endPoint: envConfig.STORAGE_ENDPOINT,
			port: Number(envConfig.STORAGE_PORT),
			useSSL: false,
			accessKey: envConfig.STORAGE_ACCESS_KEY,
			secretKey: envConfig.STORAGE_SECRET_KEY,
			region: 'us-east-1',
		});
	}

	async uploadBase64Image(
		base64Image: string,
		fileName: string,
		folder: string,
		quality: number = 80, // Qualidade da imagem (1-100)
		width: number, // Largura da imagem
		height?: number, // Altura da imagem (opcional)
		fit?:
			| 'cover' // 'cover'  - Ajusta a imagem para cobrir completamente a área, cortando partes da imagem se necessário para manter a proporção.
			| 'contain' // 'contain' - Ajusta a imagem para caber completamente na área, mantendo a proporção e deixando espaço vazio se a proporção não coincidir.
			| 'fill' // 'fill'    - Preenche a área completamente, distorcendo a imagem se necessário, sem manter a proporção.
			| 'inside' // 'inside'  - Redimensiona a imagem para caber dentro da área especificada, mantendo a proporção e evitando corte. Pode deixar espaço vazio se necessário.
			| 'outside', // 'outside' - A imagem será redimensionada para caber fora da área especificada, mantendo a proporção, e poderá haver corte se a área for menor.

		position?:
			| 'center' // Centraliza a imagem ao fazer o corte.
			| 'top' // Alinha a imagem ao topo ao fazer o corte.
			| 'right' // Alinha a imagem à direita ao fazer o corte.
			| 'bottom' // Alinha a imagem à parte inferior ao fazer o corte.
			| 'left' // Alinha a imagem à esquerda ao fazer o corte.
			| 'top-left' // Alinha a imagem ao canto superior esquerdo ao fazer o corte.
			| 'top-right' // Alinha a imagem ao canto superior direito ao fazer o corte.
			| 'bottom-left' // Alinha a imagem ao canto inferior esquerdo ao fazer o corte.
			| 'bottom-right' // Alinha a imagem ao canto inferior direito ao fazer o corte.
			| 'entropy' // Usa um algoritmo baseado em entropia para determinar a melhor área a ser cortada, focando nas áreas com mais detalhes.
			| 'attention', // Usa um algoritmo que foca nas áreas que são mais importantes visualmente para o corte, priorizando detalhes significativos.
	): Promise<string | boolean> {
		try {
			// Accept formats
			const acceptFormats = ['jpg', 'jpeg', 'webp', 'png', 'gif'];

			// Remove o prefixo da string Base64
			const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

			// Converte a string Base64 em um buffer
			const buffer = Buffer.from(base64Data, 'base64');

			// Usa o sharp para garantir que o buffer seja uma imagem válida
			const metadata = await sharp(buffer).metadata();
			if (!metadata) {
				throw new HttpException(
					{
						status: HttpStatus.BAD_REQUEST,
						error: 'Arquivo não é uma imagem válida.',
					},
					HttpStatus.BAD_REQUEST,
				);
			}

			const { format } = metadata;

			if (!acceptFormats.includes(format)) {
				throw new HttpException(
					{
						status: HttpStatus.BAD_REQUEST,
						error: 'Arquivo não é uma imagem válida.',
					},
					HttpStatus.BAD_REQUEST,
				);
			}

			let processedBuffer: Buffer;
			let objectName: string;

			// Se a imagem for GIF, não converte; senão, converte para WEBP
			if (format === 'gif') {
				objectName = `${fileName}.gif`;
				processedBuffer = buffer; // Mantém o buffer original para GIF
			} else {
				objectName = `${fileName}.webp`;

				// Converte a imagem para WEBP usando sharp com redimensionamento e corte
				const sharpInstance = sharp(buffer).resize({
					width,
					height,
					fit,
					position,
				});

				// Aplica a conversão para WEBP com qualidade
				processedBuffer = await sharpInstance.webp({ quality }).toBuffer();
			}

			objectName = `${folder}/${objectName}`;

			// Faz o upload do buffer processado para o MinIO com o cabeçalho Content-Type correto
			await this.minioClient.putObject(
				envConfig.STORAGE_PUBLIC_BUCKET,
				objectName,
				processedBuffer,
				processedBuffer.length,
				{
					'Content-Type': format === 'gif' ? 'image/gif' : 'image/webp',
				},
			);

			return objectName;
		} catch (e) {
			console.log(e);
			return false;
		}
	}

	async uploadPdfFromPath(filePath: string, bucket: string, folder: string) {
		try {
			const fileName = path.basename(filePath); // Obtém o nome do arquivo a partir do caminho
			const objectName = `${folder}/${fileName}`;
			const fileExtension = path.extname(filePath).toLowerCase(); // Obtém a extensão do arquivo

			// Verifica se o arquivo é um PDF
			if (fileExtension !== '.pdf') {
				throw new Error('Somente arquivos PDF são permitidos para upload.');
			}

			// Lê o arquivo do sistema de arquivos
			const fileBuffer = fs.readFileSync(filePath);

			// Faz o upload para o MinIO com o Content-Type específico para PDF
			await this.minioClient.putObject(bucket, objectName, fileBuffer, fileBuffer.length, {
				'Content-Type': 'application/pdf',
			});

			return objectName;
		} catch {
			return false;
		}
	}

	async removeFile(fileName: string): Promise<boolean> {
		try {
			await this.minioClient.removeObject(envConfig.STORAGE_PUBLIC_BUCKET, fileName);
			return true;
		} catch {
			return false;
		}
	}
}
