import { Ref, prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { DayModel } from 'src/calendar/models/day.model'
import { UserModel } from 'src/user/models/user.model'
import { PriorityEnum } from '../enums/priority.enum'

export interface TodoModel extends Base {}

export class TodoModel extends TimeStamps {
	@prop({ ref: () => UserModel })
	owner: Ref<UserModel>

	@prop({ ref: () => DayModel })
	day: Ref<DayModel>

	@prop({ required: true })
	task: string

	@prop({ default: PriorityEnum.LOW })
	priority?: PriorityEnum

	@prop({ default: false })
	isCompleted?: boolean

	@prop()
	targetDate?: Date
}
