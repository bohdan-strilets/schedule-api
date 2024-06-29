import { Priority } from 'src/todos/enums/priority.enum'
import { TodoStatFields } from '../enums/todo-stat-fields.enum'
import { TypeOperation } from '../enums/type-operation.enum'
import { TodoStatUpdates } from '../types/todo-stat-updates.type'
import { UpdateEntry } from '../types/update-entry.type'

export const getTodoStatUpdates = ({
	priority,
	isCompleted,
	typeOperation,
}: TodoStatUpdates): UpdateEntry[] => {
	const updates: UpdateEntry[] = []

	if (priority === Priority.LOW) {
		updates.push({
			condition: true,
			fields: [
				[TodoStatFields.TODO_ALL_CREATED, 1],
				[TodoStatFields.TODO_WITH_LOW_PRIORITY, 1],
			],
		})
	} else if (priority === Priority.MEDIUM) {
		updates.push({
			condition: true,
			fields: [
				[TodoStatFields.TODO_ALL_CREATED, 1],
				[TodoStatFields.TODO_WITH_MEDIUM_PRIORITY, 1],
			],
		})
	} else if (priority === Priority.HIGH) {
		updates.push({
			condition: true,
			fields: [
				[TodoStatFields.TODO_ALL_CREATED, 1],
				[TodoStatFields.TODO_WITH_HIGH_PRIORITY, 1],
			],
		})
	}

	if (isCompleted === true) {
		updates.push({
			condition: true,
			fields: [[TodoStatFields.TODO_COMPLETED, 1]],
		})
	} else if (
		typeOperation === TypeOperation.DECREMENT &&
		isCompleted === false
	) {
		updates.push({
			condition: true,
			fields: [[TodoStatFields.TODO_COMPLETED, 1]],
		})
	}

	return updates
}
