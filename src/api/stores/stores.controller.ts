import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/api/auth/jwt/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { StoreService } from './stores.service';

@Controller('stores')
@ApiBearerAuth('JWT')
export class StoreController {
	constructor(private readonly storeService: StoreService) {}

	@UseGuards(new JwtAuthGuard(['admin']))
	@Get()
	async getAll() {
		return await this.storeService.getAll();
	}
}
