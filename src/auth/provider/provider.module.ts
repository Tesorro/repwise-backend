import { Module } from '@nestjs/common'

import { ProviderService } from './provider.service.js'

@Module({
	providers: [ProviderService]
})
export class ProviderModule {}
