import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'
import {
	MAX_PASSWORD_LENGTH,
	MIN_PASSWORD_LENGTH,
} from 'src/common/vars/validation-rules'

export class ResetPasswordDto {
	@IsString()
	@MinLength(MIN_PASSWORD_LENGTH)
	@MaxLength(MAX_PASSWORD_LENGTH)
	password: string

	@IsString()
	@IsEmail()
	email: string
}
