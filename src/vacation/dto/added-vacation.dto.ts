import { IsOptional, IsPositive, Max, Min } from 'class-validator'
import {
	MAX_AMOUNT_HOURS,
	MIN_AMOUNT_HOURS,
} from 'src/common/vars/validation-rules'

export class AddedVacationDto {
	@IsPositive()
	@Min(MIN_AMOUNT_HOURS)
	@Max(MAX_AMOUNT_HOURS)
	amountHours: number

	@IsPositive()
	@IsOptional()
	@Min(MIN_AMOUNT_HOURS)
	@Max(MAX_AMOUNT_HOURS)
	usedHours?: number
}
