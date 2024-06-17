import { Ref, modelOptions, prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { UserModel } from 'src/user/models/user.model'
import { ShiftNumber } from '../enums/shift-number.enum'
import { Status } from '../enums/status.enum'

export interface DayModel extends Base {}

@modelOptions({ schemaOptions: { versionKey: false } })
export class DayModel extends TimeStamps {
	@prop({ ref: () => UserModel })
	owner: Ref<UserModel>

	@prop({ required: true })
	date: Date

	@prop({ required: true })
	status: Status

	@prop({ default: 0 })
	numberHours?: number

	@prop()
	timeRange?: string

	@prop({ default: ShiftNumber.SHIFT_0 })
	shiftNumber?: ShiftNumber

	@prop({ default: false })
	isAdditional?: boolean

	@prop({ default: 0 })
	grossEarning?: number

	@prop({ default: 0 })
	netEarning?: number
}
