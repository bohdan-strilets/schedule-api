import { IsEmail, IsString, MinLength } from 'class-validator'

export class ResetPasswordDto {
	@IsString()
	@MinLength(6, { message: 'Minimum length 6 characters.' })
	password: string

	@IsString()
	@IsEmail()
	email: string
}
