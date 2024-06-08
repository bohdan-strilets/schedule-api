import { prop } from '@typegoose/typegoose'
import { MonthType } from '../types/month.type'

export class WorkStatsModel {
	@prop({ default: [] })
	numberWorkDays: MonthType[]

	@prop({ default: [] })
	numberDaysOff: MonthType[]

	@prop({ default: [] })
	numberVacationDays: MonthType[]

	@prop({ default: [] })
	numberSickDays: MonthType[]

	@prop({ default: [] })
	numberAdditionalWorkDays: MonthType[]

	@prop({ default: [] })
	numberWorkHours: MonthType[]

	@prop({ default: [] })
	numberFreeHours: MonthType[]

	@prop({ default: [] })
	numberVacationHours: MonthType[]

	@prop({ default: [] })
	numberSickHours: MonthType[]

	@prop({ default: [] })
	numberAdditionalWorkHours: MonthType[]

	@prop({ default: [] })
	totalDays: MonthType[]

	@prop({ default: [] })
	totalHours: MonthType[]

	@prop({ default: [] })
	numberFirstShifts: MonthType[]

	@prop({ default: [] })
	numberSecondShifts: MonthType[]

	@prop({ default: [] })
	numberNightHours: MonthType[]

	@prop({ default: [] })
	grossAmountMoneyForWorkDays: MonthType[]

	@prop({ default: [] })
	netAmountMoneyForWorkDays: MonthType[]

	@prop({ default: [] })
	grossAmountMoneyForVacationDays: MonthType[]

	@prop({ default: [] })
	netAmountMoneyForVacationDays: MonthType[]

	@prop({ default: [] })
	grossAmountMoneyForSickDays: MonthType[]

	@prop({ default: [] })
	netAmountMoneyForSickDays: MonthType[]

	@prop({ default: [] })
	totalMoneyEarnedGross: MonthType[]

	@prop({ default: [] })
	totalMoneyEarnedNet: MonthType[]

	@prop({ default: [] })
	totalTaxPaid: MonthType[]
}
