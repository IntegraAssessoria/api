import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordHashProvider {
	private readonly TIME_COST = 6; // Custo de tempo aumentado
	private readonly MEMORY_COST = 2 ** 16; // 64 MB de memória

	async hash(input: string): Promise<string> {
		return await argon2.hash(input, {
			type: argon2.argon2id,
			timeCost: this.TIME_COST,
			memoryCost: this.MEMORY_COST,
			parallelism: 1,
		});
	}

	async comparer(password: string, hash: string): Promise<boolean> {
		return await argon2.verify(hash, password);
	}
}
