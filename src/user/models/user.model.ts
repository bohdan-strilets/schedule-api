import { prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { LocationModel } from './location.model'

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

	@prop({ type: [String] })
	avatarUrls: string[]

	@prop({ type: [String] })
	posterUrls: string[]

	@prop()
	activationToken: string

	@prop({ default: false })
	isActivated: boolean
}
