import { modelOptions, prop } from '@typegoose/typegoose'
import { MonthlyStats } from '../types/monthly-stats.type'

@modelOptions({ schemaOptions: { _id: false }, options: { allowMixed: 0 } })
export class WorkStatsModel {
	@prop({ default: [] })
	numberWorkDays: MonthlyStats[]

	@prop({ default: [] })
	numberDaysOff: MonthlyStats[]

	@prop({ default: [] })
	numberVacationDays: MonthlyStats[]

	@prop({ default: [] })
	numberSickDays: MonthlyStats[]

	@prop({ default: [] })
	numberAdditionalWorkDays: MonthlyStats[]

	@prop({ default: [] })
	numberWorkHours: MonthlyStats[]

	@prop({ default: [] })
	numberFreeHours: MonthlyStats[]

	@prop({ default: [] })
	numberVacationHours: MonthlyStats[]

	@prop({ default: [] })
	numberSickHours: MonthlyStats[]

	@prop({ default: [] })
	numberAdditionalWorkHours: MonthlyStats[]

	@prop({ default: [] })
	totalDays: MonthlyStats[]

	@prop({ default: [] })
	totalHours: MonthlyStats[]

	@prop({ default: [] })
	numberFirstShifts: MonthlyStats[]

	@prop({ default: [] })
	numberSecondShifts: MonthlyStats[]

	@prop({ default: [] })
	numberNightHours: MonthlyStats[]

	@prop({ default: [] })
	grossAmountMoneyForWorkDays: MonthlyStats[]

	@prop({ default: [] })
	netAmountMoneyForWorkDays: MonthlyStats[]

	@prop({ default: [] })
	grossAmountMoneyForVacationDays: MonthlyStats[]

	@prop({ default: [] })
	netAmountMoneyForVacationDays: MonthlyStats[]

	@prop({ default: [] })
	grossAmountMoneyForSickDays: MonthlyStats[]

	@prop({ default: [] })
	netAmountMoneyForSickDays: MonthlyStats[]

	@prop({ default: [] })
	totalMoneyEarnedGross: MonthlyStats[]

	@prop({ default: [] })
	totalMoneyEarnedNet: MonthlyStats[]

	@prop({ default: [] })
	totalTaxPaid: MonthlyStats[]
}
