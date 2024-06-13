import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { ErrorMessages } from 'src/common/vars/error-messages'
import { TypeOperation } from 'src/statistics/enums/type-operation.enum'
import { StatisticsService } from 'src/statistics/statistics.service'
import { AddedDayDto } from './dto/added-day.dto'
import { UpdateDayDto } from './dto/update-day.dto'
import { DayModel } from './models/day.model'

@Injectable()
export class CalendarService {
	constructor(
		@InjectModel(DayModel) private readonly DayModel: ModelType<DayModel>,
		private readonly statisticsService: StatisticsService
	) {}

	async added(userId: string, dto: AddedDayDto) {
		this.checkDto(dto)
		const data = { ...dto, owner: userId }
		this.statisticsService.changeStatField({
			date: dto.date,
			type: TypeOperation.INCREMENT,
			userId,
			value: 1,
			fieldName: 'numberWorkDays',
		})
		return await this.DayModel.create(data)
	}

	async update(dayId: string, dto: UpdateDayDto) {
		this.checkDto(dto)
		await this.checkDayFromDb(dayId)

		return await this.DayModel.findByIdAndUpdate(dayId, dto, {
			new: true,
		})
	}

	async delete(dayId: string) {
		await this.checkDayFromDb(dayId)
		await this.DayModel.findByIdAndDelete(dayId)
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
