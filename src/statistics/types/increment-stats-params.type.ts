import { MonthType } from './month.type'

export type IncrementStatsParams = {
	statsForSelectedField: MonthType[]
	indexValueInSelectedField: number
	selectedDate: MonthType
	dayId: string
	value: number
}
