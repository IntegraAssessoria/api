import { UserCreateDto } from './create.dto';
import { IsOptional, IsString } from 'class-validator';

export class UserUpdateDto extends UserCreateDto {
	@IsString()
	@IsOptional()
	phone: string;
}
