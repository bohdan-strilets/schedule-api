import { TypeOperation } from '../enums/type-operation.enum'
import { MonthlyStats } from './monthly-stats.type'

export type UpdateValue = {
	foundValue: MonthlyStats
	type: TypeOperation
	value: number
}
