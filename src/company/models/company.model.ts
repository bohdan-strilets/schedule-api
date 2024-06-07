import { Ref, prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { UserModel } from 'src/user/models/user.model'

export interface CompanyModel extends Base {}

export class CompanyModel extends TimeStamps {
	@prop({ ref: () => UserModel })
	owner: Ref<UserModel>

	@prop({ required: true })
	name: string

	@prop({ required: true })
	startWork: Date

	@prop()
	profession?: string

	@prop()
	endWork?: Date

	@prop()
	logoUrl?: string

	@prop({ default: 0 })
	salaryPerHour: number
}
