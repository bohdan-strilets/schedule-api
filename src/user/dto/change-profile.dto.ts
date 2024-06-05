import {
	IsDate,
	IsIn,
	IsOptional,
	IsPhoneNumber,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator'
import { GenderEnum } from '../enums/gender.enum'

export class ChangeProfileDto {
	@IsString()
	@IsOptional()
	@MinLength(2, { message: 'Minimum length 2 characters.' })
	@MaxLength(70, { message: 'Maximum length 70 characters.' })
	firstName?: string

	@IsString()
	@IsOptional()
	@MinLength(2, { message: 'Minimum length 2 characters.' })
	@MaxLength(70, { message: 'Maximum length 70 characters.' })
	lastName?: string

	@IsString()
	@IsOptional()
	@MinLength(2, { message: 'Minimum length 2 characters.' })
	@MaxLength(100, { message: 'Maximum length 100 characters.' })
	nickname?: string

	@IsDate()
	@IsOptional()
	dateBirth?: Date

	@IsString()
	@IsOptional()
	@IsPhoneNumber('PL')
	phoneNumber?: string

	@IsString()
	@IsIn([GenderEnum])
	@IsOptional()
	gender?: GenderEnum

	@IsString()
	@IsOptional()
	@MinLength(10, { message: 'Minimum length 10 characters.' })
	@MaxLength(1000, { message: 'Maximum length 1000 characters.' })
	description?: string
}
