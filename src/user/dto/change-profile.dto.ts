import {
	IsDateString,
	IsIn,
	IsOptional,
	IsPhoneNumber,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator'
import {
	MAX_DESCRIPTION_LENGTH,
	MAX_NAME_LENGTH,
	MIN_DESCRIPTION_LENGTH,
	MIN_NAME_LENGTH,
} from 'src/common/vars/validation-rules'
import { GenderEnum } from '../enums/gender.enum'

export class ChangeProfileDto {
	@IsString()
	@IsOptional()
	@MinLength(MIN_NAME_LENGTH)
	@MaxLength(MAX_NAME_LENGTH)
	firstName?: string

	@IsString()
	@IsOptional()
	@MinLength(MIN_NAME_LENGTH)
	@MaxLength(MAX_NAME_LENGTH)
	lastName?: string

	@IsString()
	@IsOptional()
	@MinLength(MIN_NAME_LENGTH)
	@MaxLength(MAX_NAME_LENGTH)
	nickname?: string

	@IsDateString()
	@IsOptional()
	dateBirth?: Date

	@IsString()
	@IsOptional()
	@IsPhoneNumber('PL')
	phoneNumber?: string

	@IsString()
	@IsIn(Object.values(GenderEnum))
	@IsOptional()
	gender?: GenderEnum

	@IsString()
	@IsOptional()
	@MinLength(MIN_DESCRIPTION_LENGTH)
	@MaxLength(MAX_DESCRIPTION_LENGTH)
	description?: string
}
