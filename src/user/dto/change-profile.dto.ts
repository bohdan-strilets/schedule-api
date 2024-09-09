import {
	IsDateString,
	IsIn,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator'
import {
	MAX_NAME_LENGTH,
	MIN_NAME_LENGTH,
} from 'src/common/vars/validation-rules'
import { Gender } from '../enums/gender.enum'

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

	@IsDateString()
	@IsOptional()
	dateBirth?: Date

	@IsString()
	@IsIn(Object.values(Gender))
	@IsOptional()
	gender?: Gender
}
