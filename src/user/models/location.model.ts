import { prop } from '@typegoose/typegoose'

export class LocationModel {
	@prop()
	city: string

	@prop()
	country: string

	@prop()
	postcode: string
}
