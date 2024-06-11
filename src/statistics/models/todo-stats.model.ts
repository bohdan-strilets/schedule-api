import { modelOptions, prop } from '@typegoose/typegoose'
import { MonthType } from '../types/month.type'

@modelOptions({ schemaOptions: { _id: false } })
export class TodoStatsModel {
	@prop({ default: [] })
	todoAllCreated: MonthType[]

	@prop({ default: [] })
	todoCompleted: MonthType[]

	@prop({ default: [] })
	todoWithLowPriority: MonthType[]

	@prop({ default: [] })
	todoWithMediumPriority: MonthType[]

	@prop({ default: [] })
	todoWithHighPriority: MonthType[]
}
