import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	HttpException,
	InternalServerErrorException,
	BadRequestException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class PrismaInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler) {
		return next.handle().pipe(
			catchError((error) => {
				if (error instanceof PrismaClientKnownRequestError) {
					throw new BadRequestException();
				}

				return throwError(() => (error instanceof HttpException ? error : new InternalServerErrorException()));
			}),
		);
	}
}
