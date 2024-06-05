import {
	IsDate,
	IsIn,
	IsOptional,
	IsPhoneNumber,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator'
import { validationMessage } from 'src/common/helpers/validation-message.helper'
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
	@MinLength(MIN_NAME_LENGTH, {
		message: validationMessage.minTextLength(MIN_NAME_LENGTH),
	})
	@MaxLength(MAX_NAME_LENGTH, {
		message: validationMessage.maxTextLength(MAX_NAME_LENGTH),
	})
	firstName?: string

	@IsString()
	@IsOptional()
	@MinLength(MIN_NAME_LENGTH, {
		message: validationMessage.minTextLength(MIN_NAME_LENGTH),
	})
	@MaxLength(MAX_NAME_LENGTH, {
		message: validationMessage.maxTextLength(MAX_NAME_LENGTH),
	})
	lastName?: string

	@IsString()
	@IsOptional()
	@MinLength(MIN_NAME_LENGTH, {
		message: validationMessage.minTextLength(MIN_NAME_LENGTH),
	})
	@MaxLength(MAX_NAME_LENGTH, {
		message: validationMessage.maxTextLength(MAX_NAME_LENGTH),
	})
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
	@MinLength(MIN_DESCRIPTION_LENGTH, {
		message: validationMessage.minTextLength(MIN_DESCRIPTION_LENGTH),
	})
	@MaxLength(MAX_DESCRIPTION_LENGTH, {
		message: validationMessage.maxTextLength(MAX_DESCRIPTION_LENGTH),
	})
	description?: string
}
