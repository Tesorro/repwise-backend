import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import type { Request } from 'express'

import { type UserRole } from '@/auth/decorators/roles.decorator.js'
import { UserService } from '@/user/user.service'

@Injectable()
export class AuthGuard implements CanActivate {
	public constructor(private readonly userService: UserService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context
			.switchToHttp()
			.getRequest<Request & { user?: { role: UserRole } }>()

		if (typeof request.session.userId === 'undefined') {
			throw new UnauthorizedException(
				'Пожалуйста, авторизуйтесь для доступа к этому ресурсу.'
			)
		}

		const user = await this.userService.findById(request.session.userId)

		request.user = user

		return true
	}
}
