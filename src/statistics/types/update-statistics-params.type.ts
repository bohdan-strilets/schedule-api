import { TypeOperationEnum } from '../enums/type-operation.enum'

export type UpdateStatisticsParams = {
	month: number
	year: number
	fieldNameFromDb: string
	defaultValue?: number
	value?: number
	dayId?: string
	type: TypeOperationEnum
}
