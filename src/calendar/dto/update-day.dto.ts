import {
	IsBoolean,
	IsIn,
	IsNumber,
	IsOptional,
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

export class UpdateDayDto {
	@IsString()
	@IsIn(Object.values(Status))
	@IsOptional()
	status: Status

	@IsNumber()
	@Min(MIN_NUMBER_HOURS)
	@Max(MAX_NUMBER_HOURS)
	numberHours: number

	@IsString()
	timeRange: string

	@IsNumber()
	@IsIn(Object.values(ShiftNumber))
	shiftNumber: ShiftNumber

	@IsBoolean()
	isAdditional: boolean

	@IsNumber()
	@Min(MIN_EARNING)
	@Max(MAX_EARNING)
	grossEarning: number

	@IsNumber()
	@Min(MIN_EARNING)
	@Max(MAX_EARNING)
	netEarning: number
}
