import { IsDateString, IsString, MaxLength, MinLength } from 'class-validator'
import {
	MAX_COMPANY_NAME,
	MIN_COMPANY_NAME,
} from 'src/common/vars/validation-rules'

export class CreateCompanyDto {
	@IsString()
	@MinLength(MIN_COMPANY_NAME)
	@MaxLength(MAX_COMPANY_NAME)
	name: string

	@IsDateString()
	startWork: Date
}
