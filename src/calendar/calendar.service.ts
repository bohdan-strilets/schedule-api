import { HttpStatus, Injectable } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { ResponseType } from 'src/common/response.type'
import { ErrorMessages } from 'src/common/vars/error-messages'
import { StatName } from 'src/statistics/enums/stat-name.enum'
import { TypeOperation } from 'src/statistics/enums/type-operation.enum'
import { StatisticsOperationsService } from 'src/statistics/statistics-operations.service'
import { AddedDayDto } from './dto/added-day.dto'
import { UpdateDayDto } from './dto/update-day.dto'
import { DayModel } from './models/day.model'

@Injectable()
export class CalendarService {
	constructor(
		@InjectModel(DayModel) private readonly DayModel: ModelType<DayModel>,
		private readonly statisticsOperations: StatisticsOperationsService
	) {}

	async added(
		userId: string,
		dto: AddedDayDto
	): Promise<ResponseType<DayModel>> {
		this.checkDto(dto)
		const data = { ...dto, owner: userId }
		const createdDay = await this.DayModel.create(data)
		const dayInfoForStat = this.statisticsOperations.getDayInfo(createdDay)

		await this.statisticsOperations.updateStat({
			date: dto.date,
			userId,
			type: TypeOperation.INCREMENT,
			dto: dayInfoForStat,
			statName: StatName.WORK,
		})

		return {
			success: true,
			statusCode: HttpStatus.CREATED,
			data: createdDay,
		}
	}

	async update(
		dayId: string,
		dto: UpdateDayDto,
		userId: string
	): Promise<ResponseType<DayModel>> {
		this.checkDto(dto)
		const day = await this.checkDayFromDb(dayId)

		if ('_id' in day) {
			const dayInfoForStat = this.statisticsOperations.getDayInfo(day)

			if (
				dayInfoForStat.status !== dto.status ||
				dayInfoForStat.shiftNumber !== dto.shiftNumber ||
				dayInfoForStat.isAdditional !== dto.isAdditional
			) {
				await this.statisticsOperations.updateStat({
					date: dayInfoForStat.date,
					userId,
					type: TypeOperation.DECREMENT,
					dto: dayInfoForStat,
					statName: StatName.WORK,
				})
				await this.statisticsOperations.updateStat({
					date: day.date,
					userId,
					type: TypeOperation.INCREMENT,
					dto: { date: day.date, ...dto },
					statName: StatName.WORK,
				})
			}

			const updatedDay = await this.DayModel.findByIdAndUpdate(dayId, dto, {
				new: true,
			})

			return {
				success: true,
				statusCode: HttpStatus.OK,
				data: updatedDay,
			}
		}
	}

	async delete(dayId: string, userId: string): Promise<ResponseType> {
		await this.checkDayFromDb(dayId)
		const deletedDay = await this.DayModel.findByIdAndDelete(dayId)
		const dayInfoForStat = this.statisticsOperations.getDayInfo(deletedDay)

		await this.statisticsOperations.updateStat({
			date: deletedDay.date,
			userId,
			type: TypeOperation.DECREMENT,
			dto: dayInfoForStat,
			statName: StatName.WORK,
		})

		return {
			success: true,
			statusCode: HttpStatus.OK,
		}
	}

	async deleteAll(userId: string): Promise<ResponseType> {
		const allDays = await this.DayModel.find({ owner: userId })

		for (const day of allDays) {
			const dayInfoForStat = this.statisticsOperations.getDayInfo(day)
			await this.statisticsOperations.updateStat({
				date: day.date,
				userId,
				type: TypeOperation.DECREMENT,
				dto: dayInfoForStat,
				statName: StatName.WORK,
			})
		}

		await this.DayModel.deleteMany({ owner: userId })

		return {
			success: true,
			statusCode: HttpStatus.OK,
		}
	}

	async getById(dayId: string): Promise<ResponseType<DayModel>> {
		const day = await this.checkDayFromDb(dayId)

		if ('_id' in day) {
			return {
				success: true,
				statusCode: HttpStatus.OK,
				data: day,
			}
		}
	}

	async getAll(userId: string): Promise<ResponseType<DayModel[]>> {
		const days = await this.DayModel.find({ owner: userId })

		return {
			success: true,
			statusCode: HttpStatus.OK,
			data: days,
		}
	}

	// HELPERS

	private async checkDayFromDb(
		dayId: string
	): Promise<DayModel | ResponseType> {
		const dayFromDb = await this.DayModel.findById(dayId)

		if (!dayFromDb) {
			return {
				success: false,
				statusCode: HttpStatus.NOT_FOUND,
				message: ErrorMessages.NOT_FOUND_BY_ID,
			}
		}

		return dayFromDb
	}

	private checkDto(dto: any) {
		if (!dto) {
			return {
				success: false,
				statusCode: HttpStatus.BAD_REQUEST,
				message: ErrorMessages.BAD_REQUEST,
			}
		}
	}
}
