import { IsString, MinLength } from 'class-validator'

export class ChangePasswordDto {
	@IsString()
	@MinLength(6, { message: 'Minimum length 6 characters.' })
	password: string

	@IsString()
	@MinLength(6, { message: 'Minimum length 6 characters.' })
	newPassword: string
}
