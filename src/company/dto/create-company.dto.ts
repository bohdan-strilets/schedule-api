import { IsDate, IsString, MaxLength, MinLength } from 'class-validator'
import { validationMessage } from 'src/common/helpers/validation-message.helper'
import {
	MAX_COMPANY_NAME,
	MIN_COMPANY_NAME,
} from 'src/common/vars/validation-rules'

export class CreateCompanyDto {
	@IsString()
	@MinLength(MIN_COMPANY_NAME, {
		message: validationMessage.minTextLength(MIN_COMPANY_NAME),
	})
	@MaxLength(MAX_COMPANY_NAME, {
		message: validationMessage.minTextLength(MAX_COMPANY_NAME),
	})
	name: string

	@IsDate()
	startWork: Date
}
