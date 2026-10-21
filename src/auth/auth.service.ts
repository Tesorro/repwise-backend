import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import type { Request, Response } from 'express'

import { LoginDto } from '@/auth/dto/login.dto.js'
import { RegisterDto } from '@/auth/dto/register.dto.js'
import { AuthMethod } from '@/user/auth-method.js'
import { UserService } from '@/user/user.service.js'

type User = Awaited<ReturnType<UserService['create']>>

@Injectable()
export class AuthService {
	public constructor(
		private readonly userService: UserService,
		private readonly configService: ConfigService
	) {}

	public async register(req: Request, dto: RegisterDto) {
		const { email, password, name, username } = dto

		const user = await this.userService.findByEmail(email)

		if (user) {
			throw new BadRequestException(
				'Пользователь с таким email уже существует'
			)
		}

		const existingUsername = await this.userService.findByUsername(username)

		if (existingUsername) {
			throw new BadRequestException(
				'Пользователь с таким именем пользователя уже существует'
			)
		}

		const newUser = await this.userService.create(
			email,
			password,
			username,
			name,
			'',
			AuthMethod.EMAIL,
			false
		)

		return this.saveSession(req, newUser)
	}

	public async login(req: Request, dto: LoginDto) {
		const { email, username, password } = dto

		const user = email
			? await this.userService.findByEmail(email)
			: await this.userService.findByUsername(username!)

		if (
			!user ||
			!user.password // если авторизовался через соцсети, то password будет отсутствовать
		) {
			throw new BadRequestException(
				'Пользователь не найден. Пожалуйста, проверьте ваши учетные данные.'
			)
		}

		const isPasswordValid = await verify(user.password, password)

		if (!isPasswordValid) {
			throw new UnauthorizedException(
				'Неверный пароль. Пожалуйста, попробуйте еще раз.'
			)
		}

		return this.saveSession(req, user)
	}

	public async logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Не удалось завершить сессию. Возможно, возникла ошибка на стороне сервера или сессия уже завершена.'
						)
					)
				}
				res.clearCookie(
					this.configService.getOrThrow<string>('SESSION_NAME')
				)
				resolve()
			})
		})
	}

	private async saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			req.session.userId = user.id

			req.session.save(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Не удалось сохранить сессию'
						)
					)
				}
				resolve(user)
			})
		})
	}
}
