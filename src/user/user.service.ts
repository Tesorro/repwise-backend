import { Injectable, NotFoundException } from '@nestjs/common'
import { hash } from 'argon2'

import { PrismaService } from '@/prisma/prisma.service.js'
import type { AuthMethod } from '@/user/auth-method.js'

type UserClient = PrismaService['db']['orm']['public']['User']
type UserUpdateData = Parameters<UserClient['update']>[0]

@Injectable()
export class UserService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findById(id: string) {
		const user = await this.prismaService.db.orm.public.User.include(
			'accounts'
		).first({ id })

		if (!user) {
			throw new NotFoundException('User not found')
		}

		return user
	}

	public async findByEmail(email: string) {
		const user = await this.prismaService.db.orm.public.User.include(
			'accounts'
		).first({ email })

		return user
	}

	public async findByUsername(username: string) {
		const user = await this.prismaService.db.orm.public.User.include(
			'accounts'
		)
			.where({ username })
			.first()

		return user
	}

	public async create(
		email: string,
		password: string,
		username: string,
		name: string,
		avatar: string,
		authMethod: AuthMethod,
		isVerified: boolean
	) {
		const user = await this.prismaService.db.orm.public.User.include(
			'accounts'
		).create({
			email,
			password: password ? await hash(password) : '',
			username,
			name,
			avatar,
			authMethod,
			isVerified
		})

		return user
	}

	public async update(id: string, data: UserUpdateData) {
		return this.prismaService.db.orm.public.User.where({ id }).update(data)
	}

	public async delete(id: string) {
		return this.prismaService.db.orm.public.User.where({ id }).delete()
	}
}
