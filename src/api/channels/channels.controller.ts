import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/api/auth/jwt/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ChannelService } from './channels.service';
import { ChannelCreate } from './dtos/channels-create.dto';

@Controller('channels')
@ApiBearerAuth('JWT')
export class ChannelController {
	constructor(private readonly channelService: ChannelService) {}

	@Get()
	async getAll() {
		return await this.channelService.getAll();
	}

	@UseGuards(new JwtAuthGuard(['admin']))
	@Post()
	async create(@Body() body: ChannelCreate) {
		return await this.channelService.create(body);
	}
}
