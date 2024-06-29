import { NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { DayModel } from 'src/calendar/models/day.model'
import { ErrorMessages } from 'src/common/vars/error-messages'
import { TodoModel } from 'src/todos/models/todo.model'
import { StatName } from './enums/stat-name.enum'
import { TypeOperation } from './enums/type-operation.enum'
import { getTodoStatUpdates } from './helpers/todo-stat-updates'
import { getWorkStatUpdates } from './helpers/work-stat-updates'
import { StatisticsModel } from './models/statistics.model'
import { CalculateNightHours } from './types/calculate-night-hours.type'
import { ChangeStatField } from './types/change-stat-field.type'
import { DateComponents } from './types/date-components.type'
import { DefaultValue } from './types/default-value.type'
import { FoundValue } from './types/found-value.type'
import { GetOldValues } from './types/get-old-values.type'
import { MonthlyStats } from './types/monthly-stats.type'
import { Operands } from './types/operands .type'
import { TodoStatUpdates } from './types/todo-stat-updates.type'
import { UpdateEntry } from './types/update-entry.type'
import { UpdateStat } from './types/update-stat.type'
import { UpdateValue } from './types/update-value.type'
import { DayInfo } from './types/work-stat-updates.type'

export class StatisticsOperationsService {
	constructor(
		@InjectModel(StatisticsModel)
		private readonly StatisticsModel: ModelType<StatisticsModel>
	) {}

	private increment({ initialValue, deltaValue }: Operands) {
		return initialValue + deltaValue
	}

	private decrement({ initialValue, deltaValue }: Operands) {
		return initialValue - deltaValue
	}

	private getDate(date: Date): DateComponents {
		const month = date.getMonth()
		const year = date.getFullYear()
		return { month, year }
	}

	private foundValue({ field, monthYear }: FoundValue) {
		return field.find(
			(item) => item.month === monthYear.month && item.year === monthYear.year
		)
	}

	private updateValue({ foundValue, type, value }: UpdateValue) {
		return type === TypeOperation.INCREMENT
			? this.increment({ initialValue: foundValue.value, deltaValue: value })
			: this.decrement({ initialValue: foundValue.value, deltaValue: value })
	}

	private defaultValue({ monthYear, value }: DefaultValue) {
		return { month: monthYear.month, year: monthYear.year, value }
	}

	private getOldValues({ field, foundValue }: GetOldValues) {
		return field.filter(
			(item) => item.month !== foundValue.month || item.year !== foundValue.year
		)
	}

	private async changeStatField(options: ChangeStatField) {
		const { date, type, value, userId, fieldName, statName } = options
		const statistics = await this.StatisticsModel.findOne({ owner: userId })

		if (!statistics) throw new NotFoundException(ErrorMessages.NOT_FOUND_BY_ID)

		const stats = statistics[statName]
		const field: MonthlyStats[] = stats[fieldName]

		const monthYear = this.getDate(new Date(date))
		const foundValue = this.foundValue({ field, monthYear })

		const updateFieldName = `${statName}.${fieldName}`
		let result: MonthlyStats[] = []

		if (foundValue) {
			const newValue = this.updateValue({ foundValue, type, value })
			const updatedValue = { ...foundValue, value: newValue }
			const oldValue = this.getOldValues({ field, foundValue })
			result = [...oldValue, updatedValue]
		} else {
			const newValue = this.defaultValue({ monthYear, value })
			result = [...field, newValue]
		}

		const updateObject = { [updateFieldName]: result }
		await this.StatisticsModel.findByIdAndUpdate(statistics._id, updateObject)
	}

	private calculateNightHours({ timeRange, numberHours }: CalculateNightHours) {
		const [startStr, endStr] = timeRange.split('-')
		const startTime = parseInt(startStr.split(':')[0], 10)
		const endTime = parseInt(endStr.split(':')[0], 10)
		const MIDNIGHT = 24
		const START_NIGHT_TIME = 22

		if (startTime < START_NIGHT_TIME && numberHours < 4) {
			return 0
		}
		if (endTime < MIDNIGHT && startTime < MIDNIGHT && numberHours < 4) {
			return MIDNIGHT - START_NIGHT_TIME
		}
		return MIDNIGHT - START_NIGHT_TIME + endTime
	}

	async updateStat({ date, userId, type, dto, statName }: UpdateStat) {
		const changeStatOptions = { date, userId, type, statName }
		let updates: UpdateEntry[]

		if (statName === StatName.WORK) {
			const { timeRange, numberHours } = dto as DayInfo
			const nightHours = this.calculateNightHours({
				timeRange,
				numberHours,
			})
			updates = getWorkStatUpdates({ dayInfo: dto as DayInfo, nightHours })
		}
		if (statName === StatName.TODO) {
			const { priority, isCompleted } = dto as TodoStatUpdates
			updates = getTodoStatUpdates({
				priority,
				isCompleted,
				typeOperation: type,
			})
		}

		for (const update of updates) {
			if (update.condition) {
				for (const [fieldName, value] of update.fields) {
					await this.changeStatField({ ...changeStatOptions, fieldName, value })
				}
			}
		}
	}

	getDayInfo(day: DayModel) {
		return {
			date: day.date,
			status: day.status,
			isAdditional: day.isAdditional,
			numberHours: day.numberHours,
			timeRange: day.timeRange,
			shiftNumber: day.shiftNumber,
			grossEarning: day.grossEarning,
			netEarning: day.netEarning,
		}
	}

	getTodoInfo(todo: TodoModel) {
		return {
			priority: todo.priority,
			isCompleted: todo.isCompleted,
		}
	}
}
