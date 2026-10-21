import { Module } from '@nestjs/common'

import { UserModule } from '@/user/user.module.js'
import { UserService } from '@/user/user.service.js'

import { AuthController } from './auth.controller.js'
import { AuthService } from './auth.service.js'

@Module({
	imports: [UserModule],
	controllers: [AuthController],
	providers: [AuthService, UserService]
})
export class AuthModule {}
