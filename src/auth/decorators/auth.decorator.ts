import { applyDecorators, UseGuards } from '@nestjs/common'

import { AuthGuard } from '@/auth/guards/auth.guard.js'
import { RolesGuard } from '@/auth/guards/roles.guard.js'

import { Roles, type UserRole } from './roles.decorator.js'

export function Authorization(...roles: UserRole[]) {
	if (roles.length > 0) {
		return applyDecorators(
			Roles(...roles),
			UseGuards(AuthGuard, RolesGuard)
		)
	}

	return applyDecorators(UseGuards(AuthGuard))
}
