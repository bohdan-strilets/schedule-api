import { AddedDayDto } from 'src/calendar/dto/added-day.dto'
import { TypeOperation } from '../enums/type-operation.enum'

export type UpdateStat = {
	userId: string
	type: TypeOperation
	dto: AddedDayDto
}
