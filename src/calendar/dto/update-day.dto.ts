import {
	IsBoolean,
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
import { ShiftNumberEnum } from '../enums/shift-number.enum'
import { StatusEnum } from '../enums/status.enum'

export class UpdateDayDto {
	@IsString()
	@IsIn(Object.values(StatusEnum))
	@IsOptional()
	status: StatusEnum

	@IsPositive()
	@IsOptional()
	@Min(MIN_NUMBER_HOURS)
	@Max(MAX_NUMBER_HOURS)
	numberHours?: number

	@IsString()
	@IsOptional()
	timeRange?: string

	@IsNumber()
	@IsIn(Object.values(ShiftNumberEnum))
	@IsOptional()
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
