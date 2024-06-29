import { TodoStatFields } from '../enums/todo-stat-fields.enum'
import { WorkStatFields } from '../enums/work-stat-fields.enum'

type FieldUpdate = [WorkStatFields | TodoStatFields, number]

export type UpdateEntry = {
	condition: boolean
	fields: FieldUpdate[]
}
