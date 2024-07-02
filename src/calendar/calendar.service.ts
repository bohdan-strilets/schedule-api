import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
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

	async added(userId: string, dto: AddedDayDto) {
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

		return createdDay
	}

	async update(dayId: string, dto: UpdateDayDto, userId: string) {
		this.checkDto(dto)
		const day = await this.checkDayFromDb(dayId)
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

		return await this.DayModel.findByIdAndUpdate(dayId, dto, {
			new: true,
		})
	}

	async delete(dayId: string, userId: string) {
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

		return
	}

	async deleteAll(userId: string) {
		const allDays = await this.getAll(userId)

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
		return
	}

	async getById(dayId: string) {
		return await this.checkDayFromDb(dayId)
	}

	async getAll(userId: string) {
		return await this.DayModel.find({ owner: userId })
	}

	// HELPERS

	private async checkDayFromDb(dayId: string) {
		const dayFromDb = await this.DayModel.findById(dayId)
		if (!dayFromDb) throw new NotFoundException(ErrorMessages.NOT_FOUND_BY_ID)

		return dayFromDb
	}

	private checkDto(dto: any) {
		if (!dto) throw new BadRequestException(ErrorMessages.BAD_REQUEST)
	}
}
