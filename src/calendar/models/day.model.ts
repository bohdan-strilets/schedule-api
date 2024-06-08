import { Ref, prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { UserModel } from 'src/user/models/user.model'
import { ShiftNumberEnum } from '../enums/shift-number.enum'
import { StatusEnum } from '../enums/status.enum'

export interface DayModel extends Base {}

export class DayModel extends TimeStamps {
	@prop({ ref: () => UserModel })
	owner: Ref<UserModel>

	@prop({ required: true })
	date: Date

	@prop({ required: true })
	status: StatusEnum

	@prop({ default: 0 })
	numberHours?: number

	@prop()
	timeRange?: string

	@prop({ default: ShiftNumberEnum.Shift0 })
	shiftNumber?: ShiftNumberEnum

	@prop({ default: false })
	isAdditional?: boolean

	@prop({ default: 0 })
	grossEarning?: number

	@prop({ default: 0 })
	netEarning?: number
}
