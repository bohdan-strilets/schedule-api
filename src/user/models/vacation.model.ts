import { prop } from '@typegoose/typegoose'

export class VacationModel {
	@prop()
	amountHours: number

	@prop()
	hoursLeft: number

	@prop()
	usedHours: number
}
