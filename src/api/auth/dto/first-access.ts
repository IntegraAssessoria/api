import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class FirstAccessDTO {
	@ApiProperty({
		description: 'E-mail address of the user',
		example: 'user@example.com',
	})
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		description: 'Code received by email',
		example: '1234-5678',
	})
	@IsString()
	@IsNotEmpty()
	code: string;

	@ApiProperty({
		description: 'New password of the user',
		example: 'MySecurePass123#%@',
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(6, {
		message: 'Password must be at least 6 characters long',
	})
	newPassword: string;
}
