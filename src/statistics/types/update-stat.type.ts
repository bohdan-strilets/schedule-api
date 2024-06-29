import { StatName } from '../enums/stat-name.enum'
import { TypeOperation } from '../enums/type-operation.enum'
import { TodoStatUpdates } from './todo-stat-updates.type'
import { DayInfo } from './work-stat-updates.type'

export type UpdateStat = {
	date: Date
	userId: string
	type: TypeOperation
	dto: DayInfo | TodoStatUpdates
	statName: StatName
}
