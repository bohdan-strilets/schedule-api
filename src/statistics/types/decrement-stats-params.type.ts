import { MonthType } from './month.type'

export type DecrementStatsParams = {
	selectedDate: MonthType
	dayId: string
	statsForSelectedField: MonthType[]
	indexValueInSelectedField: number
}
