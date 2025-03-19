import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/api/auth/jwt/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MediaService } from './medias.service';
import { MediaCreate } from './dtos/medias-create.dto';
import { MediaUpdate } from './dtos/medias-update.dto';

@Controller('medias')
@ApiBearerAuth('JWT')
export class MediaController {
	constructor(private readonly mediaService: MediaService) {}

	@Get()
	async getAll() {
		return await this.mediaService.getAll();
	}

	@UseGuards(new JwtAuthGuard(['admin']))
	@Post()
	async create(@Body() body: MediaCreate) {
		return await this.mediaService.create(body);
	}

	@UseGuards(new JwtAuthGuard(['admin']))
	@Put('/:id')
	async update(@Param('id') id: string, @Body() body: MediaUpdate) {
		return await this.mediaService.update(id, body);
	}

	@UseGuards(new JwtAuthGuard(['admin']))
	@Delete('/:id')
	async delete(@Param('id') id: string) {
		return await this.mediaService.delete(id);
	}
}
