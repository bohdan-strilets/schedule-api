import { Ref, modelOptions, prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { DayModel } from 'src/calendar/models/day.model'
import { UserModel } from 'src/user/models/user.model'
import { Priority } from '../enums/priority.enum'

export interface TodoModel extends Base {}

@modelOptions({ schemaOptions: { versionKey: false } })
export class TodoModel extends TimeStamps {
	@prop({ ref: () => UserModel })
	owner: Ref<UserModel>

	@prop({ ref: () => DayModel })
	day: Ref<DayModel>

	@prop({ required: true })
	task: string

	@prop({ default: Priority.LOW })
	priority?: Priority

	@prop({ default: false })
	isCompleted?: boolean

	@prop()
	targetDate?: Date
}
