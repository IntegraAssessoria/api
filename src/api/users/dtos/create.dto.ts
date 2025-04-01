import { UserType } from '@prisma/client';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserCreateDto {
	@ApiProperty({ description: 'First name of the user', example: 'John' })
	@IsString()
	@IsNotEmpty()
	firstName: string;

	@ApiProperty({ description: 'Last name of the user', example: 'Doe' })
	@IsString()
	@IsNotEmpty()
	lastName: string;

	@ApiProperty({ description: 'Id of store' })
	@IsString()
	@IsOptional()
	storeId: string;

	@ApiProperty({ description: 'User email', example: 'john.doe@example.com' })
	@IsEmail()
	@IsNotEmpty()
	@Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
	email: string;

	@ApiProperty({
		description: 'User role',
		example: 'ADMIN',
		enum: ['ADMIN', 'store', 'seller'],
	})
	@IsString()
	@IsNotEmpty()
	@IsIn(['ADMIN', 'store', 'seller'])
	type: UserType;
}
