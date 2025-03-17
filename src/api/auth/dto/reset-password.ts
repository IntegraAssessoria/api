import {} from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDTO {
	@ApiProperty({
		description: 'The email address for password reset.',
		example: 'user@example.com',
		required: false,
	})
	@IsEmail()
	@IsNotEmpty()
	email: string;
}
