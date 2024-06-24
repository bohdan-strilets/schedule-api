import { NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { DayModel } from 'src/calendar/models/day.model'
import { ErrorMessages } from 'src/common/vars/error-messages'
import { TypeOperation } from './enums/type-operation.enum'
import { getWorkStatUpdates } from './helpers/works-stat-updates'
import { StatisticsModel } from './models/statistics.model'
import { CalculateNightHours } from './types/calculate-night-hours.type'
import { ChangeStatField } from './types/change-stat-field.type'
import { DateComponents } from './types/date-components.type'
import { DefaultValue } from './types/default-value.type'
import { FoundValue } from './types/found-value.type'
import { GetOldValues } from './types/get-old-values.type'
import { MonthlyStats } from './types/monthly-stats.type'
import { Operands } from './types/operands .type'
import { UpdateStat } from './types/update-stat.type'
import { UpdateValue } from './types/update-value.type'

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
		const { date, type, value, userId, fieldName } = options
		const statistics = await this.StatisticsModel.findOne({ owner: userId })
		if (!statistics) throw new NotFoundException(ErrorMessages.NOT_FOUND_BY_ID)

		const workStats = statistics.workStats
		const field: MonthlyStats[] = workStats[fieldName]

		const monthYear = this.getDate(new Date(date))
		const foundValue = this.foundValue({ field, monthYear })

		const updateFieldName = `workStats.${fieldName}`
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

	async updateStat({ userId, type, dto }: UpdateStat) {
		const { date, numberHours, timeRange, grossEarning, netEarning } = dto
		const tax = grossEarning - netEarning
		const changeStatOptions = { date, userId, type }
		const nightHours = this.calculateNightHours({ timeRange, numberHours })
		const updates = getWorkStatUpdates({
			dto,
			tax,
			nightHours,
		})

		for (const update of updates) {
			if (update.condition) {
				for (const [fieldName, value] of update.fields) {
					await this.changeStatField({ ...changeStatOptions, fieldName, value })
				}
			}
		}
	}

	getDataForStat(dayInformation: DayModel) {
		return {
			date: dayInformation.date,
			status: dayInformation.status,
			isAdditional: dayInformation.isAdditional,
			numberHours: dayInformation.numberHours,
			timeRange: dayInformation.timeRange,
			shiftNumber: dayInformation.shiftNumber,
			grossEarning: dayInformation.grossEarning,
			netEarning: dayInformation.netEarning,
		}
	}
}
