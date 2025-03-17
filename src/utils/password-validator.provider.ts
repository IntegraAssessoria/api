import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import * as zxcvbn from 'zxcvbn';

@Injectable()
@ValidatorConstraint({ name: 'passwordStrength', async: false })
export class PasswordStrengthValidator implements ValidatorConstraintInterface {
	validate(password: string): boolean {
		if (typeof password !== 'string' || password === undefined || password === null) {
			return false;
		}

		const result = zxcvbn(password);
		return result.score >= 3; // Score ranges from 0 to 4. 3 is a fairly strong password.
	}

	defaultMessage(): string {
		return 'Senha muito fraca';
	}
}
