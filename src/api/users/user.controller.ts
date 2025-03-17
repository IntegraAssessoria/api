import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './services/user.service';
import { JwtAuthGuard } from 'src/api/auth/jwt/jwt-auth.guard';
import { UserCreateDto } from './dtos/create.dto';
import { UserUpdateDto } from './dtos/update.dto';
import { LoggedUser } from 'src/middlewares/decorators/logged-user.decorator';
import { LoggedUserType } from 'src/middlewares/decorators/logged-user';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@ApiBearerAuth('JWT')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UseGuards(new JwtAuthGuard(['admin', 'store', 'seller']))
	@Get()
	async getAll(@LoggedUser() loggedUser: LoggedUserType) {
		return await this.userService.getAll(loggedUser);
	}

	@UseGuards(new JwtAuthGuard(['admin', 'store']))
	@Get('/:id')
	async getUniq(@Param('id') id: string, @LoggedUser() loggedUser: LoggedUserType) {
		return await this.userService.getUniq(id, loggedUser);
	}

	@UseGuards(new JwtAuthGuard(['admin', 'store']))
	@Post()
	async create(@Body() body: UserCreateDto, @LoggedUser() loggedUser: LoggedUserType) {
		return await this.userService.create(body, loggedUser);
	}

	@UseGuards(new JwtAuthGuard(['admin', 'store']))
	@Put('/:id')
	async update(@Param('id') id: string, @Body() user: UserUpdateDto, @LoggedUser() loggedUser: LoggedUserType) {
		return await this.userService.update(id, user, loggedUser);
	}

	@UseGuards(new JwtAuthGuard(['admin', 'store']))
	@Delete('/:id')
	async remove(@Param('id') id: string, @LoggedUser() loggedUser: LoggedUserType) {
		return await this.userService.remove(id, loggedUser);
	}
}
