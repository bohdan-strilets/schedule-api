import {
	IsBoolean,
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
import { PriorityEnum } from '../enums/priority.enum'

export class UpdateTodoDto {
	@IsString()
	@MinLength(MIN_TASK_LENGTH)
	@MaxLength(MAX_TASK_LENGTH)
	@IsOptional()
	task?: string

	@IsString()
	@IsIn(Object.values(PriorityEnum))
	@IsOptional()
	priority?: PriorityEnum

	@IsBoolean()
	@IsOptional()
	isCompleted?: boolean

	@IsDateString()
	@IsOptional()
	targetDate?: Date
}
