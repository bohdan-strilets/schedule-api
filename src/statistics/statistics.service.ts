import { Injectable } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { TypeOperation } from './enums/type-operation.enum'
import { StatisticsModel } from './models/statistics.model'
import { ChangeStatField } from './types/change-stat-field.type'
import { DateComponents } from './types/date-components .type'
import { DefaultValue } from './types/default-value.type'
import { FoundValue } from './types/found-value.type'
import { MonthlyStats } from './types/monthly-stats.type'
import { Operands } from './types/operands .type'
import { UpdateValue } from './types/update-value.type'

@Injectable()
export class StatisticsService {
	constructor(
		@InjectModel(StatisticsModel)
		private readonly StatisticsModel: ModelType<StatisticsModel>
	) {}

	increment({ value1, value2 }: Operands) {
		return value1 + value2
	}

	decrement({ value1, value2 }: Operands) {
		return value1 - value2
	}

	getDate(date: Date): DateComponents {
		const month = date.getMonth()
		const year = date.getFullYear()
		return { month, year }
	}

	foundValue({ field, monthYear }: FoundValue) {
		return field.find((item) => {
			item.month === monthYear.month && item.year === monthYear.year
		})
	}

	updateValue({ foundValue, type, value }: UpdateValue) {
		return type === TypeOperation.INCREMENT
			? this.increment({ value1: foundValue.value, value2: value })
			: this.decrement({ value1: foundValue.value, value2: value })
	}

	defaultValue({ monthYear, value }: DefaultValue) {
		return { month: monthYear.month, year: monthYear.year, value }
	}

	async changeStatField(options: ChangeStatField) {
		const { date, type, value, userId, fieldName } = options
		const statistics = await this.StatisticsModel.findOne({ owner: userId })
		const workStats = statistics.workStats
		const field: MonthlyStats[] = workStats[fieldName]
		const monthYear = this.getDate(new Date(date))
		const foundValue = this.foundValue({ field, monthYear })
		const newValue = this.defaultValue({ monthYear, value })

		foundValue
			? (foundValue.value = this.updateValue({ foundValue, type, value }))
			: field.push(newValue)

		await statistics.save()
	}

	async createStatistics(userId: string) {
		return await this.StatisticsModel.create({ owner: userId })
	}
}
