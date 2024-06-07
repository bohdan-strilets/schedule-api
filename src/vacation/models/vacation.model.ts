import { Ref, prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { UserModel } from 'src/user/models/user.model'

export interface VacationModel extends Base {}

export class VacationModel extends TimeStamps {
	@prop({ ref: () => UserModel })
	owner: Ref<UserModel>

	@prop({ default: new Date().getFullYear(), unique: true })
	year: number

	@prop({ default: 0 })
	amountHours: number

	@prop({ default: 0 })
	hoursLeft: number

	@prop({ default: 0 })
	usedHours: number
}
