import { modelOptions, prop } from '@typegoose/typegoose'
import { MonthlyStats } from '../types/monthly-stats.type'

@modelOptions({ schemaOptions: { _id: false } })
export class TodoStatsModel {
	@prop({ default: [] })
	todoAllCreated: MonthlyStats[]

	@prop({ default: [] })
	todoCompleted: MonthlyStats[]

	@prop({ default: [] })
	todoWithLowPriority: MonthlyStats[]

	@prop({ default: [] })
	todoWithMediumPriority: MonthlyStats[]

	@prop({ default: [] })
	todoWithHighPriority: MonthlyStats[]
}
