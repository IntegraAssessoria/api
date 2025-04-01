import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/api/auth/jwt/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { StoreService } from './stores.service';
import { StoreCreate } from './dtos/stores-create.dto';
import { StoreUpdate } from './dtos/stores-update.dto';

@Controller('stores')
@ApiBearerAuth('JWT')
export class StoreController {
	constructor(private readonly storeService: StoreService) {}

	@Get()
	async getAll() {
		return await this.storeService.getAll();
	}

	@UseGuards(new JwtAuthGuard(['ADMIN']))
	@Post()
	async create(@Body() body: StoreCreate) {
		return await this.storeService.create(body);
	}

	@UseGuards(new JwtAuthGuard(['ADMIN']))
	@Put('/:id')
	async update(@Param('id') id: string, @Body() body: StoreUpdate) {
		return await this.storeService.update(id, body);
	}

	@UseGuards(new JwtAuthGuard(['ADMIN']))
	@Delete('/:id')
	async delete(@Param('id') id: string) {
		return await this.storeService.delete(id);
	}
}
