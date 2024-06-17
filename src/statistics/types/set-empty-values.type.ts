import { WorkStatFields } from '../enums/work-stat-fields.enum'
import { WorkStatsModel } from '../models/work-stats.model'
import { DateComponents } from './date-components .type'

export type SetEmptyValues = {
	filteredNames: WorkStatFields[]
	workStats: WorkStatsModel
	monthYear: DateComponents
}
