import {
	IsDateString,
	IsIn,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator'
import {
	MAX_TASK_LENGTH,
	MIN_TASK_LENGTH,
} from 'src/common/vars/validation-rules'
import { Priority } from '../enums/priority.enum'

export class CreateTodoDto {
	@IsString()
	day: string

	@IsString()
	@MinLength(MIN_TASK_LENGTH)
	@MaxLength(MAX_TASK_LENGTH)
	task: string

	@IsString()
	@IsIn(Object.values(Priority))
	@IsOptional()
	priority?: Priority

	@IsDateString()
	@IsOptional()
	targetDate: Date
}
