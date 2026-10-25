import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'

import type { UserService } from '@/user/user.service.js'

type User = Awaited<ReturnType<UserService['findById']>>

export const Authorized = createParamDecorator(
	(data: keyof User | undefined, ctx: ExecutionContext) => {
		const request = ctx
			.switchToHttp()
			.getRequest<Request & { user: User }>()
		const user = request.user

		return data ? user[data] : user
	}
)
