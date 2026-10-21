import type { PrismaService } from '@/prisma/prisma.service.js'

type UserAuthMethod = NonNullable<
	Parameters<
		PrismaService['db']['orm']['public']['User']['create']
	>[0]['authMethod']
>

export const AuthMethod = {
	GOOGLE: 'GOOGLE',
	EMAIL: 'EMAIL',
	YANDEX: 'YANDEX'
} as const satisfies Record<string, UserAuthMethod>

export type AuthMethod = (typeof AuthMethod)[keyof typeof AuthMethod]
