import {
	IsBoolean,
	IsDateString,
	IsIn,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	Max,
	Min,
} from 'class-validator'
import {
	MAX_EARNING,
	MAX_NUMBER_HOURS,
	MIN_EARNING,
	MIN_NUMBER_HOURS,
} from 'src/common/vars/validation-rules'
import { ShiftNumber } from '../enums/shift-number.enum'
import { Status } from '../enums/status.enum'

export class AddedDayDto {
	@IsDateString()
	date: Date

	@IsString()
	@IsIn(Object.values(Status))
	status: Status

	@IsString()
	companyId: string

	@IsPositive()
	@IsOptional()
	@Min(MIN_NUMBER_HOURS)
	@Max(MAX_NUMBER_HOURS)
	numberHours?: number

	@IsString()
	@IsOptional()
	timeRange?: string

	@IsNumber()
	@IsIn(Object.values(ShiftNumber))
	@IsOptional()
	shiftNumber?: ShiftNumber

	@IsBoolean()
	@IsOptional()
	isAdditional?: boolean

	@IsPositive()
	@IsOptional()
	@Min(MIN_EARNING)
	@Max(MAX_EARNING)
	grossEarning?: number

	@IsPositive()
	@IsOptional()
	@Min(MIN_EARNING)
	@Max(MAX_EARNING)
	netEarning?: number
}
