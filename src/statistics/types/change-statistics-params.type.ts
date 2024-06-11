import { DayModel } from 'src/calendar/models/day.model'
import { TypeOperationEnum } from '../enums/type-operation.enum'

export type ChangeStatisticsParams = {
	dataByClient: DayModel
	type: TypeOperationEnum
	dayId: string
}
