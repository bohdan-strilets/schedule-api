import { WorkStatsModel } from '../models/work-stats.model'

export type FindDateParams = {
	workStats: WorkStatsModel
	fieldNameFromDb: string
	month: number
	year: number
}
