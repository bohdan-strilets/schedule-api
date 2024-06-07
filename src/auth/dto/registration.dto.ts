import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'
import {
	MAX_NAME_LENGTH,
	MAX_PASSWORD_LENGTH,
	MIN_NAME_LENGTH,
	MIN_PASSWORD_LENGTH,
} from 'src/common/vars/validation-rules'

export class RegistrationDto {
	@IsString()
	@MinLength(MIN_NAME_LENGTH)
	@MaxLength(MAX_NAME_LENGTH)
	firstName: string

	@IsString()
	@MinLength(MIN_NAME_LENGTH)
	@MaxLength(MAX_NAME_LENGTH)
	lastName: string

	@IsString()
	@IsEmail()
	email: string

	@IsString()
	@MinLength(MIN_PASSWORD_LENGTH)
	@MaxLength(MAX_PASSWORD_LENGTH)
	password: string
}
