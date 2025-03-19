import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class StoreCreate {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsOptional()
	image: string;
}
