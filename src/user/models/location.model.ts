import { modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { _id: false } })
export class LocationModel {
	@prop()
	city: string

	@prop()
	country: string

	@prop()
	postcode: string
}
