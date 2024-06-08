import { prop } from '@typegoose/typegoose'

export class TodoStatsModel {
	@prop()
	todoAllCreated: number

	@prop()
	todoCompleted: number

	@prop()
	todoWithLowPriority: number

	@prop()
	todoWithMediumPriority: number

	@prop()
	todoWithHighPriority: number
}
