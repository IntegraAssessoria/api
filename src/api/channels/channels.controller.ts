import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/api/auth/jwt/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ChannelService } from './channels.service';
import { ChannelCreate } from './dtos/channels-create.dto';
import { ChannelUpdate } from './dtos/channels-update.dto';

@Controller('channels')
@ApiBearerAuth('JWT')
export class ChannelController {
	constructor(private readonly channelService: ChannelService) {}

	@Get()
	async getAll() {
		return await this.channelService.getAll();
	}

	@UseGuards(new JwtAuthGuard(['ADMIN']))
	@Post()
	async create(@Body() body: ChannelCreate) {
		return await this.channelService.create(body);
	}

	@UseGuards(new JwtAuthGuard(['ADMIN']))
	@Put('/:id')
	async update(@Param('id') id: string, @Body() body: ChannelUpdate) {
		return await this.channelService.update(id, body);
	}

	@UseGuards(new JwtAuthGuard(['ADMIN']))
	@Delete('/:id')
	async delete(@Param('id') id: string) {
		return await this.channelService.delete(id);
	}
}
