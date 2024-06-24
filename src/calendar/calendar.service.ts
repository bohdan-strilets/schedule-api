import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { ErrorMessages } from 'src/common/vars/error-messages'
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

		await this.statisticsOperations.updateStat({
			userId,
			type: TypeOperation.INCREMENT,
			dto,
		})

		return await this.DayModel.create(data)
	}

	async update(dayId: string, dto: UpdateDayDto, userId: string) {
		this.checkDto(dto)
		const day = await this.checkDayFromDb(dayId)
		const dayFromDb = this.statisticsOperations.getDataForStat(day)

		if (
			dayFromDb.status !== dto.status ||
			dayFromDb.shiftNumber !== dto.shiftNumber ||
			dayFromDb.isAdditional !== dto.isAdditional
		) {
			await this.statisticsOperations.updateStat({
				userId,
				type: TypeOperation.DECREMENT,
				dto: dayFromDb,
			})
			await this.statisticsOperations.updateStat({
				userId,
				type: TypeOperation.INCREMENT,
				dto: { date: day.date, ...dto },
			})
		}

		return await this.DayModel.findByIdAndUpdate(dayId, dto, {
			new: true,
		})
	}

	async delete(dayId: string, userId: string) {
		await this.checkDayFromDb(dayId)
		const deletedDay = await this.DayModel.findByIdAndDelete(dayId)
		const dayInformation = this.statisticsOperations.getDataForStat(deletedDay)

		await this.statisticsOperations.updateStat({
			userId,
			type: TypeOperation.DECREMENT,
			dto: { date: deletedDay.date, ...dayInformation },
		})

		return
	}

	async deleteAll(userId: string) {
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

	async checkDayFromDb(dayId: string) {
		const dayFromDb = await this.DayModel.findById(dayId)
		if (!dayFromDb) throw new NotFoundException(ErrorMessages.NOT_FOUND_BY_ID)

		return dayFromDb
	}

	checkDto(dto: any) {
		if (!dto) throw new BadRequestException(ErrorMessages.BAD_REQUEST)
	}
}
