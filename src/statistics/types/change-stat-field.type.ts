import { StatName } from '../enums/stat-name.enum'
import { TypeOperation } from '../enums/type-operation.enum'

export type ChangeStatField = {
	date: Date
	value: number
	userId: string
	fieldName: string
	type: TypeOperation
	statName: StatName
}
