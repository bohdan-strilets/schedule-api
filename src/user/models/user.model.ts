import { prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { LocationModel } from './location.model'
import { VacationModel } from './vacation.model'

export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
	@prop()
	firstName: string

	@prop()
	lastName: string

	@prop()
	nickname: string

	@prop()
	dateBirth: Date

	@prop()
	location: LocationModel

	@prop()
	phoneNumber: string

	@prop({ unique: true })
	email: string

	@prop()
	password: string

	@prop()
	gender: string

	@prop()
	description: string

	@prop()
	avatarUrls: string[]

	@prop()
	posterUrls: string[]

	@prop()
	activationToken: string

	@prop({ default: false })
	isActivated: boolean

	@prop()
	vacation: VacationModel
}
