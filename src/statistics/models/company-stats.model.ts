import { modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { _id: false } })
export class CompanyStatsModel {
	@prop({ default: 0 })
	allCompany: number

	@prop({ default: 0 })
	workExperience: number
}
