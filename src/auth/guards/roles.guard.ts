import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'

import { ROLES_KEY, type UserRole } from '@/auth/decorators/roles.decorator.js'

@Injectable()
export class RolesGuard implements CanActivate {
	public constructor(private readonly reflector: Reflector) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		])
		const request = context
			.switchToHttp()
			.getRequest<Request & { user?: { role: UserRole } }>()

		if (!roles) return true

		if (!request.user || !roles.includes(request.user.role)) {
			throw new ForbiddenException(
				'Недостаточно прав. У вас нет прав доступа к этому ресурсу.'
			)
		}

		return true
	}
}
