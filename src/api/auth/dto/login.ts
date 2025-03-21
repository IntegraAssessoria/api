import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Login {
	@ApiProperty({
		description: 'The email address of the user.',
		example: 'user@example.com',
	})
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		description: 'The password for the user.',
		example: 'password123',
	})
	@IsString()
	@IsNotEmpty()
	password: string;
}
