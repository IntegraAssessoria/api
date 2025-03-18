import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChannelCreate {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsString()
	@IsOptional()
	image: string;

	@IsString()
	@IsOptional()
	url: string;
}
