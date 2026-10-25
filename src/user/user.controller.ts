import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param
} from '@nestjs/common'

import { Authorization } from '@/auth/decorators/auth.decorator.js'
import { Authorized } from '@/auth/decorators/authorized.decorator.js'
import { UserRole } from '@/auth/decorators/roles.decorator.js'

import { UserService } from './user.service.js'

@Controller('users')
export class UserController {
	public constructor(private readonly userService: UserService) {}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get('profile')
	public async findProfile(@Authorized('id') userId: string) {
		return this.userService.findById(userId)
	}

	@Authorization(UserRole.ADMIN)
	@HttpCode(HttpStatus.OK)
	@Get('by-id/:id')
	public async findById(@Param('id') id: string) {
		return this.userService.findById(id)
	}

	@Authorization(UserRole.ADMIN)
	@HttpCode(HttpStatus.OK)
	@Get('by-email/:email')
	public async findByEmail(@Param('email') email: string) {
		const user = await this.userService.findByEmail(email)

		if (!user) {
			throw new NotFoundException('User not found')
		}

		return user
	}

	@Authorization(UserRole.ADMIN)
	@HttpCode(HttpStatus.OK)
	@Get('by-username/:username')
	public async findByUsername(@Param('username') username: string) {
		const user = await this.userService.findByUsername(username)

		if (!user) {
			throw new NotFoundException('User not found')
		}

		return user
	}
}
