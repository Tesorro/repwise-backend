import { SetMetadata } from '@nestjs/common'

import type { Models } from '@/prisma/contract.js'

export const ROLES_KEY = 'roles'

export const UserRole = {
	ADMIN: 'ADMIN',
	USER: 'USER'
} as const satisfies Record<string, Models.public_User['role']>

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)
