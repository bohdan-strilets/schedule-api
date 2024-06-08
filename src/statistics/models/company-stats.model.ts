import { prop } from '@typegoose/typegoose'

export class CompanyStatsModel {
	@prop()
	allCompany: number

	@prop()
	workExperience: number
}
