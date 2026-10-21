import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MinLength,
	ValidateIf
} from 'class-validator'

export class LoginDto {
	@ValidateIf(dto => !dto.username)
	@IsString({ message: 'Email должен быть строкой.' })
	@IsEmail({}, { message: 'Некорректный формат email.' })
	@IsNotEmpty({ message: 'Email обязателен для заполнения.' })
	email?: string

	@ValidateIf(dto => !dto.email)
	@IsString({ message: 'Имя пользователя должно быть строкой.' })
	@IsNotEmpty({ message: 'Имя пользователя обязательно для заполнения.' })
	username?: string

	@IsString({ message: 'Пароль должен быть строкой.' })
	@IsNotEmpty({ message: 'Поле пароль не может быть пустым.' })
	@MinLength(6, { message: 'Пароль должен содержать не менее 6 символов.' })
	password: string
}
