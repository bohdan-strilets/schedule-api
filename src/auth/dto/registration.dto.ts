import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class RegistrationDto {
	@IsString()
	@MinLength(2, { message: 'Minimum length 2 characters.' })
	@MaxLength(70, { message: 'Maximum length 70 characters.' })
	firstName: string

	@IsString()
	@MinLength(2, { message: 'Minimum length 2 characters.' })
	@MaxLength(70, { message: 'Maximum length 70 characters.' })
	lastName: string

	@IsString()
	@IsEmail()
	email: string

	@IsString()
	@MinLength(6, { message: 'Minimum length 6 characters.' })
	password: string
}
