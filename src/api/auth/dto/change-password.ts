import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDTO {
	@ApiProperty({
		description: 'The verification code sent to the user for password change.',
		example: '123456',
	})
	@IsString()
	@IsNotEmpty()
	code: string;

	@ApiProperty({
		description: 'The new password that the user wants to set.',
		example: 'newPassword123',
		minLength: 6,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(6, {
		message: 'Password must be at least 6 characters long',
	})
	// @Validate(PasswordStrengthValidator)
	newPassword: string;
}
