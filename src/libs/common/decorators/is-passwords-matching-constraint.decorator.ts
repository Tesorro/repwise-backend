import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from 'class-validator'

import type { RegisterDto } from '@/auth/dto/register.dto.js'

@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatchingConstraint implements ValidatorConstraintInterface {
	public validate(passwordRepeat: string, args: ValidationArguments) {
		const object = args.object as RegisterDto

		return object.password === passwordRepeat
	}

	public defaultMessage(validationArguments?: ValidationArguments): string {
		return 'Пароли не совпадают.'
	}
}
