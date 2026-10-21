import { SetMetadata } from '@nestjs/common'

import type { Models } from '@/prisma/contract.js'

export const ROLES_KEY = 'roles'

export type UserRole = Models.public_User['role']

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)
