import { Injectable } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { ShiftNumberEnum } from 'src/calendar/enums/shift-number.enum'
import { StatusEnum } from 'src/calendar/enums/status.enum'
import { StatisticsFieldsName } from './enums/statistics-fields-name.enum'
import { TypeOperationEnum } from './enums/type-operation.enum'
import statisticsGroup from './helpers/statistics-group.helper'
import { StatisticsModel } from './models/statistics.model'
import { ChangeStatisticsParams } from './types/change-statistics-params.type'
import { DecrementStatsParams } from './types/decrement-stats-params.type'
import { DefaultValueParams } from './types/default-value-params.type'
import { FindDateParams } from './types/find-date-params.type'
import { FindIndexParams } from './types/find-index-params.type'
import { IncrementStatsParams } from './types/increment-stats-params.type'
import { MonthType } from './types/month.type'
import { UpdateStatisticsParams } from './types/update-statistics-params.type'

@Injectable()
export class StatisticsService {
	constructor(
		@InjectModel(StatisticsModel)
		private readonly StatisticsModel: ModelType<StatisticsModel>
	) {}

	findDateForSelectedField(params: FindDateParams): MonthType {
		const { workStats, fieldNameFromDb, month, year } = params
		const field = workStats[fieldNameFromDb]

		const selectedField = field.find((i: MonthType) => {
			return i.month === month && i.year === year
		})

		return selectedField
	}

	findIndexForSelectedField(params: FindIndexParams) {
		const { statsForSelectedField: field, month, year } = params

		const indexValueInSelectedField = field.findIndex((i) => {
			return i.month === month && i.year === year
		})

		return indexValueInSelectedField
	}

	incrementStats(params: IncrementStatsParams) {
		const {
			statsForSelectedField: field,
			indexValueInSelectedField: index,
			selectedDate,
			dayId,
			value,
		} = params

		return (field[index] = {
			...selectedDate,
			value: [...selectedDate.value, { dayId, value }],
		})
	}

	decrementStats(params: DecrementStatsParams) {
		const {
			selectedDate,
			dayId,
			statsForSelectedField: field,
			indexValueInSelectedField: index,
		} = params

		const filteredValue = selectedDate.value.filter((i) => i.dayId === dayId)
		field[index] = { ...selectedDate, value: filteredValue }
	}

	async findAndUpdateStatisticsField(
		userId: string,
		params: UpdateStatisticsParams
	) {
		const FIELD_NAME_DB = 'workStats'
		const { month, year, fieldNameFromDb, defaultValue, value, dayId, type } =
			params

		const statistics = await this.StatisticsModel.findOne({ owner: userId })
		const workStats = statistics.workStats

		const statsForSelectedField: MonthType[] = [...workStats[fieldNameFromDb]]
		const selectedDate = this.findDateForSelectedField({
			workStats,
			fieldNameFromDb,
			month,
			year,
		})

		const indexValueInSelectedField = this.findIndexForSelectedField({
			statsForSelectedField,
			month,
			year,
		})

		if (indexValueInSelectedField !== -1) {
			type === TypeOperationEnum.INCREMENT
				? this.incrementStats({
						statsForSelectedField,
						indexValueInSelectedField,
						selectedDate,
						dayId,
						value,
					})
				: this.decrementStats({
						selectedDate,
						dayId,
						statsForSelectedField,
						indexValueInSelectedField,
					})
		} else {
			defaultValue !== 0
				? statsForSelectedField.push({
						month,
						year,
						value: [{ dayId, value: defaultValue }],
					})
				: statsForSelectedField.push({ month, year, value: [] })
		}

		const updateField = `${FIELD_NAME_DB}.${fieldNameFromDb}`
		const updateObject = { [updateField]: statsForSelectedField }
		await this.StatisticsModel.findByIdAndUpdate(statistics._id, updateObject)
	}

	calculateNightHours(timeRange: string, numberHours: number): number {
		const [startStr, endStr] = timeRange.split('-')
		const start = parseInt(startStr.split(':')[0], 10)
		const end = parseInt(endStr.split(':')[0], 10)
		const MIDNIGHT = 24
		const START_NIGHT_TIME = 22

		if (start < START_NIGHT_TIME && numberHours < 4) {
			return 0
		}
		if (end < MIDNIGHT && start < MIDNIGHT && numberHours < 4) {
			return MIDNIGHT - START_NIGHT_TIME
		}
		return MIDNIGHT - START_NIGHT_TIME + end
	}

	async setDefaultValue(params: DefaultValueParams) {
		const { userId, fields, month, year, type } = params
		const statistics = await this.StatisticsModel.findOne({ owner: userId })

		fields.map(async (name) => {
			const existingField = statistics.workStats[name].find(
				(i: MonthType) => i.month === month && i.year === year
			)

			if (!existingField) {
				await this.findAndUpdateStatisticsField(userId, {
					month,
					year,
					fieldNameFromDb: name,
					defaultValue: 0,
					type,
				})
			}
			return
		})
	}

	async changeStatisticsForDaysAndHours(params: ChangeStatisticsParams) {
		const { dataByClient, type, dayId } = params
		const {
			owner,
			status,
			timeRange,
			shiftNumber,
			numberHours,
			isAdditional,
			netEarning,
			grossEarning,
			date,
		} = dataByClient

		const userId = String(owner)
		const year = date.getFullYear()
		const month = date.getMonth()

		const checkTypeForNumberHoursWorked =
			type === TypeOperationEnum.INCREMENT ? numberHours : -numberHours
		const checkTypeForValueWithOne =
			type === TypeOperationEnum.INCREMENT ? 1 : -1
		const checkTypeForValueWithTwelve =
			type === TypeOperationEnum.INCREMENT ? 12 : -12
		const checkTypeForValueGross =
			type === TypeOperationEnum.INCREMENT ? grossEarning : -grossEarning
		const checkTypeForValueNet =
			type === TypeOperationEnum.INCREMENT ? netEarning : -netEarning
		const totalTax = grossEarning - netEarning
		const checkTypeForTax =
			type === TypeOperationEnum.INCREMENT ? totalTax : -totalTax
		const nightHours = this.calculateNightHours(timeRange, numberHours) ?? 0
		const checkTypeForNightHours =
			type == TypeOperationEnum.INCREMENT ? nightHours : -nightHours

		if (status === StatusEnum.WORK) {
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.NUMBER_WORK_DAYS,
				defaultValue: checkTypeForValueWithOne,
				value: checkTypeForValueWithOne,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.NUMBER_WORK_HOURS,
				defaultValue: checkTypeForNumberHoursWorked,
				value: checkTypeForNumberHoursWorked,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.TOTAL_DAYS,
				defaultValue: checkTypeForValueWithOne,
				value: checkTypeForValueWithOne,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.TOTAL_HOURS,
				defaultValue: checkTypeForNumberHoursWorked,
				value: checkTypeForNumberHoursWorked,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.GROSS_AMOUNT_MONEY_FOR_WORK_DAYS,
				defaultValue: checkTypeForValueGross,
				value: checkTypeForValueGross,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.NET_AMOUNT_MONEY_FOR_WORK_DAYS,
				defaultValue: checkTypeForValueNet,
				value: checkTypeForValueNet,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.TOTAL_MONEY_EARNED_GROSS,
				defaultValue: checkTypeForValueGross,
				value: checkTypeForValueGross,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.TOTAL_MONEY_EARNED_NET,
				defaultValue: checkTypeForValueNet,
				value: checkTypeForValueNet,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.TOTAL_TAX_PAID,
				defaultValue: checkTypeForTax,
				value: checkTypeForTax,
				dayId,
				type,
			})
			await this.setDefaultValue({
				userId,
				fields: statisticsGroup.WORKS,
				month,
				year,
				type,
			})
		}
		if (status === StatusEnum.WORK && isAdditional) {
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.NUMBER_ADDITIONAL_WORK_DAYS,
				defaultValue: checkTypeForValueWithOne,
				value: checkTypeForValueWithOne,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.NUMBER_ADDITIONAL_WORK_HOURS,
				defaultValue: checkTypeForNumberHoursWorked,
				value: checkTypeForNumberHoursWorked,
				dayId,
				type,
			})
			await this.setDefaultValue({
				userId,
				fields: statisticsGroup.ADDITIONAL_WORK,
				month,
				year,
				type,
			})
		}
		if (status === StatusEnum.DAY_OFF) {
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.NUMBER_DAYS_OFF,
				defaultValue: checkTypeForValueWithOne,
				value: checkTypeForValueWithOne,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.NUMBER_FREE_HOURS,
				defaultValue: checkTypeForValueWithTwelve,
				value: checkTypeForValueWithTwelve,
				dayId,
				type,
			})
			await this.setDefaultValue({
				userId,
				fields: statisticsGroup.DAY_OFF,
				month,
				year,
				type,
			})
		}
		if (status === StatusEnum.VACATION) {
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.NUMBER_VACATION_DAYS,
				defaultValue: checkTypeForValueWithOne,
				value: checkTypeForValueWithOne,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.TOTAL_DAYS,
				defaultValue: checkTypeForValueWithOne,
				value: checkTypeForValueWithOne,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.NUMBER_VACATION_HOURS,
				defaultValue: checkTypeForNumberHoursWorked,
				value: checkTypeForNumberHoursWorked,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.TOTAL_HOURS,
				defaultValue: checkTypeForNumberHoursWorked,
				value: checkTypeForNumberHoursWorked,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb:
					StatisticsFieldsName.GROSS_AMOUNT_MONEY_FOR_VACATION_DAYS,
				defaultValue: checkTypeForValueGross,
				value: checkTypeForValueGross,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb:
					StatisticsFieldsName.NET_AMOUNT_MONEY_FOR_VACATION_DAYS,
				defaultValue: checkTypeForValueNet,
				value: checkTypeForValueNet,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.TOTAL_MONEY_EARNED_GROSS,
				defaultValue: checkTypeForValueGross,
				value: checkTypeForValueGross,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.TOTAL_MONEY_EARNED_NET,
				defaultValue: checkTypeForValueNet,
				value: checkTypeForValueNet,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.TOTAL_TAX_PAID,
				defaultValue: checkTypeForTax,
				value: checkTypeForTax,
				dayId,
				type,
			})
			await this.setDefaultValue({
				userId,
				fields: statisticsGroup.VACATION,
				month,
				year,
				type,
			})
		}
		if (status === StatusEnum.SICK_LEAVE) {
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.NUMBER_SICK_DAYS,
				defaultValue: checkTypeForValueWithOne,
				value: checkTypeForValueWithOne,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.TOTAL_DAYS,
				defaultValue: checkTypeForValueWithOne,
				value: checkTypeForValueWithOne,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.NUMBER_SICK_HOURS,
				defaultValue: checkTypeForValueWithTwelve,
				value: checkTypeForValueWithTwelve,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.TOTAL_HOURS,
				defaultValue: checkTypeForValueWithTwelve,
				value: checkTypeForValueWithTwelve,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.GROSS_AMOUNT_MONEY_FOR_SICK_DAYS,
				defaultValue: checkTypeForValueGross,
				value: checkTypeForValueGross,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.NET_AMOUNT_MONEY_FOR_SICK_DAYS,
				defaultValue: checkTypeForValueNet,
				value: checkTypeForValueNet,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.TOTAL_MONEY_EARNED_GROSS,
				defaultValue: checkTypeForValueGross,
				value: checkTypeForValueGross,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.TOTAL_MONEY_EARNED_NET,
				defaultValue: checkTypeForValueNet,
				value: checkTypeForValueNet,
				dayId,
				type,
			})
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.TOTAL_TAX_PAID,
				defaultValue: checkTypeForTax,
				value: checkTypeForTax,
				dayId,
				type,
			})
			await this.setDefaultValue({
				userId,
				fields: statisticsGroup.SICK_LEAVE,
				month,
				year,
				type,
			})
		}
		if (shiftNumber === ShiftNumberEnum.SHIFT_1) {
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.NUMBER_FIRST_SHIFTS,
				defaultValue: checkTypeForValueWithOne,
				value: checkTypeForValueWithOne,
				dayId,
				type,
			})
			await this.setDefaultValue({
				userId,
				fields: statisticsGroup.FIRST_SHIFT,
				month,
				year,
				type,
			})
		}
		if (shiftNumber === ShiftNumberEnum.SHIFT_2) {
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.NUMBER_SECOND_SHIFT,
				defaultValue: checkTypeForValueWithOne,
				value: checkTypeForValueWithOne,
				dayId,
				type,
			})
			await this.setDefaultValue({
				userId,
				fields: statisticsGroup.SECOND_SHIFT,
				month,
				year,
				type,
			})
		}
		if (shiftNumber === ShiftNumberEnum.SHIFT_2 && nightHours > 0) {
			await this.findAndUpdateStatisticsField(userId, {
				month,
				year,
				fieldNameFromDb: StatisticsFieldsName.NUMBER_NIGHT_HOURS,
				defaultValue: checkTypeForNightHours,
				value: checkTypeForNightHours,
				dayId,
				type,
			})
			await this.setDefaultValue({
				userId,
				fields: statisticsGroup.NIGHT_HOURS,
				month,
				year,
				type,
			})
		}
	}

	async deleteStatistics(statisticsId: string) {
		await this.StatisticsModel.findByIdAndDelete(statisticsId)
		return
	}

	async createStatistics(userId: string) {
		return await this.StatisticsModel.create({ owner: userId })
	}

	async getStatistics(statisticsId: string) {
		return await this.StatisticsModel.findById(statisticsId)
	}
}
