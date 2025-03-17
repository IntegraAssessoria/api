import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { envConfig } from 'src/environment/env';

@Injectable()
export class RedisProvider {
	constructor(@InjectRedis() private readonly redis: Redis) {}

	async get<T>(key: string): Promise<T> {
		const value = await this.redis.get(`${envConfig.REDIS_PREFIX}:${key}`);

		if (!value) {
			return null;
		}

		return JSON.parse(value) as T;
	}

	async set<T>(key: string, value: T, time: number): Promise<T> {
		return (await this.redis.setex(`${envConfig.REDIS_PREFIX}:${key}`, time, JSON.stringify(value))) as T;
	}

	async del(key: string) {
		await this.redis.del(`${envConfig.REDIS_PREFIX}:${key}`);
	}

	async deleteKeysByPattern(pattern: string): Promise<void> {
		const keys = await this.scanKeys(pattern);

		if (keys.length > 0) {
			await this.redis.del(...keys);
		}
	}

	async scanKeys(pattern: string): Promise<string[]> {
		let cursor = '0';
		const keys: string[] = [];
		do {
			const result = await this.redis.scan(
				cursor,
				'MATCH',
				`${envConfig.REDIS_PREFIX}:${pattern}`,
				'COUNT',
				'100',
			);

			cursor = result[0];
			keys.push(...result[1]);
		} while (cursor !== '0');

		return keys;
	}

	async ttl(key: string): Promise<number> {
		return await this.redis.ttl(`${envConfig.REDIS_PREFIX}:${key}`);
	}

	async sadd(key: string, member: string, expirationTime: number): Promise<number> {
		const result = await this.redis.sadd(`${envConfig.REDIS_PREFIX}:${key}`, member);

		await this.redis.expire(`${envConfig.REDIS_PREFIX}:${key}`, expirationTime);

		return result;
	}

	async sismember(key: string, member: string): Promise<boolean> {
		const result = await this.redis.sismember(`${envConfig.REDIS_PREFIX}:${key}`, member);
		return result === 1;
	}
}
