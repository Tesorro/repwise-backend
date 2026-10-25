import {
	BadRequestException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'

import { type TypeBaseProviderOptions } from './types/base-provider.options.types'
import { TypeUserInfo } from './types/user-info.types'

@Injectable()
export class BaseOauthService {
	private BASE_URL: string

	public constructor(private readonly options: TypeBaseProviderOptions) {}

	protected async extractUserInfo(data: any): Promise<TypeUserInfo> {
		return {
			...data,
			provider: this.options.name
		} as TypeUserInfo
	}

	public getAuthUrl() {
		const query = new URLSearchParams({
			response_type: 'code',
			client_id: this.options.client_id,
			redirect_uri: this.getRedirectUrl(),
			scope: (this.options.scopes || []).join(' '),
			access_type: 'offline',
			prompt: 'select_account'
		})

		return `${this.options.authorize_url}?${query.toString()}`
	}

	public async findUserByCode(code: string): Promise<TypeUserInfo> {
		const client_id = this.options.client_id
		const client_secret = this.options.client_secret

		const tokenQuery = new URLSearchParams({
			client_id,
			client_secret,
			redirect_uri: this.getRedirectUrl(),
			grant_type: 'authorization_code'
		})

		const tokenRequest = await fetch(this.options.access_url, {
			method: 'POST',
			body: tokenQuery.toString(),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json'
			}
		})

		const tokenResponse = await tokenRequest.json()

		if (!tokenResponse.ok) {
			throw new BadRequestException(
				`Не удалось получить пользователя с ${this.options.profile_url}: ${tokenResponse.error}`
			)
		}

		if (!tokenResponse.access_token) {
			throw new BadRequestException(
				`Нет токенов с ${this.options.access_url}: ${tokenResponse.error}. Убедитесь, что код авторизации действителен`
			)
		}

		const userRequest = await fetch(this.options.profile_url, {
			headers: {
				Authorization: `Bearer ${tokenResponse.access_token}`
			}
		})

		if (!userRequest.ok) {
			const userErrorResponse = await userRequest.text()

			throw new UnauthorizedException(
				`Не удалось получить пользователя с ${this.options.profile_url}: ${userErrorResponse}`
			)
		}

		const user = await userRequest.json()

		const userData = await this.extractUserInfo(user)

		return {
			...userData,
			access_token: tokenResponse.access_token,
			refresh_token: tokenResponse.refresh_token,
			expires_at: tokenResponse.expires_at || tokenResponse.expires_in,
			provider: this.options.name
		}
	}

	public getRedirectUrl() {
		return `${this.BASE_URL}/auth/oauth/callback/${this.options.name}`
	}

	set baseUrl(url: string) {
		this.BASE_URL = url
	}

	get name(): string {
		return this.options.name
	}

	get access_url(): string {
		return this.options.access_url
	}

	get profile_url(): string {
		return this.options.profile_url
	}

	get scopes(): string[] {
		return this.options.scopes
	}
}
