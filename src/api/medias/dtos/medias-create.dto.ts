import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MediaCreate {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsOptional()
	image: string;
}
