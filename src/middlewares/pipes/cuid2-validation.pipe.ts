import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { isCuid } from '@paralleldrive/cuid2';

@Injectable()
export class DbIdValidationPipe implements PipeTransform<string> {
	transform(value: string): string {
		if (!isCuid(value) || !value || value === '') {
			throw new BadRequestException(`The ID is not a valid: ${value}`);
		}
		return value;
	}
}
