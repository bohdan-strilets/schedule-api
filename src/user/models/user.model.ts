import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { CompanyModel } from 'src/company/models/company.model'
import { Gender } from '../enums/gender.enum'

export interface UserModel extends Base {}

@modelOptions({ schemaOptions: { versionKey: false } })
export class UserModel extends TimeStamps {
	@prop()
	firstName: string

	@prop()
	lastName: string

	@prop()
	dateBirth: string

	@prop({ unique: true })
	email: string

	@prop()
	password: string

	@prop({ default: Gender.OTHER })
	gender: Gender

	@prop({ type: [String] })
	avatarUrls: string[]

	@prop()
	activationToken: string

	@prop({ default: false })
	isActivated: boolean

	@prop({ ref: () => CompanyModel, default: null })
	currentPlaceWork?: Ref<CompanyModel>
}
