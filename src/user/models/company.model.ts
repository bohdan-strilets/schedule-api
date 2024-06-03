import { prop } from '@typegoose/typegoose'

export class CompanyModel {
	@prop()
	name: string

	@prop()
	profession: string

	@prop()
	startWork: Date

	@prop()
	endWork: Date

	@prop()
	logoUrl: string

	@prop()
	salaryPerHour: number
}
