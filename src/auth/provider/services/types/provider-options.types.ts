import { TypeBaseProviderOptions } from './base-provider.options.types'

export type ProviderOptions = Pick<
	TypeBaseProviderOptions,
	'client_id' | 'client_secret' | 'scopes'
>
