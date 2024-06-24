import { AddedDayDto } from 'src/calendar/dto/added-day.dto'
import { WorkStatFields } from '../enums/work-stat-fields.enum'

export type WorkStatUpdates = {
	dto: AddedDayDto
	tax: number
	nightHours: number
}

type FieldUpdate = [WorkStatFields, number]

export type UpdateEntry = {
	condition: boolean
	fields: FieldUpdate[]
}
