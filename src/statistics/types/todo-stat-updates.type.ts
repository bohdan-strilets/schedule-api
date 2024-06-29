import { Priority } from 'src/todos/enums/priority.enum'
import { TypeOperation } from '../enums/type-operation.enum'

export type TodoStatUpdates = {
	priority?: Priority
	isCompleted?: boolean
	typeOperation?: TypeOperation
}
