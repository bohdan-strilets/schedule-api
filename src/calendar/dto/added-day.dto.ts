import {
	IsBoolean,
	IsDateString,
	IsIn,
	IsOptional,
	IsPositive,
	IsString,
	Max,
	Min,
} from 'class-validator'
import {
	MAX_EARNING,
	MAX_NUMBER_HOURS,
	MAX_SHIFT_NUMBER,
	MIN_EARNING,
	MIN_NUMBER_HOURS,
	MIN_SHIFT_NUMBER,
} from 'src/common/vars/validation-rules'
import { ShiftNumberEnum } from '../enums/shift-number.enum'
import { StatusEnum } from '../enums/status.enum'

export class AddedDayDto {
	@IsDateString()
	date: Date

	@IsString()
	@IsIn(Object.values(StatusEnum))
	status: StatusEnum

	@IsPositive()
	@IsOptional()
	@Min(MIN_NUMBER_HOURS)
	@Max(MAX_NUMBER_HOURS)
	numberHours?: number

	@IsString()
	@IsOptional()
	timeRange?: string

	@IsPositive()
	@IsIn(Object.values(ShiftNumberEnum))
	@IsOptional()
	@Min(MIN_SHIFT_NUMBER)
	@Max(MAX_SHIFT_NUMBER)
	shiftNumber?: ShiftNumberEnum

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
