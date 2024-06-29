import { Status } from 'src/calendar/enums/status.enum'

export type DayInfo = {
	date: Date
	status: Status
	numberHours: number
	grossEarning: number
	netEarning: number
	isAdditional: boolean
	shiftNumber: number
	timeRange: string
}

export type WorkStatUpdates = {
	dayInfo: DayInfo
	nightHours: number
}
