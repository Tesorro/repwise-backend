import { Injectable, OnModuleDestroy } from '@nestjs/common'

import { db } from './db.js'

@Injectable()
export class PrismaService implements OnModuleDestroy {
	public readonly db = db

	public async onModuleDestroy(): Promise<void> {
		await this.db.close()
	}
}
