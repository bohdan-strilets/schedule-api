import {
	IsDateString,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	MaxLength,
	Min,
	MinLength,
} from 'class-validator'
import {
	MAX_COMPANY_NAME,
	MAX_PROFESSION_LENGTH,
	MAX_SALARY_PER_HOUR,
	MIN_COMPANY_NAME,
	MIN_PROFESSION_LENGTH,
	MIN_SALARY_PER_HOUR,
} from 'src/common/vars/validation-rules'

export class UpdateCompanyDto {
	@IsString()
	@IsOptional()
	@MinLength(MIN_COMPANY_NAME)
	@MaxLength(MAX_COMPANY_NAME)
	name?: string

	@IsDateString()
	@IsOptional()
	startWork?: Date

	@IsDateString()
	@IsOptional()
	endWork?: Date

	@IsString()
	@IsOptional()
	@MinLength(MIN_PROFESSION_LENGTH)
	@MaxLength(MAX_PROFESSION_LENGTH)
	profession?: string

	@IsNumber()
	@Min(MIN_SALARY_PER_HOUR)
	@Max(MAX_SALARY_PER_HOUR)
	@IsOptional()
	salaryPerHour?: number
}
