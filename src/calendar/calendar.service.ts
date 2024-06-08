import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { ErrorMessages } from 'src/common/vars/error-messages'
import { AddedDayDto } from './dto/added-day.dto'
import { UpdateDayDto } from './dto/update-day.dto'
import { DayModel } from './models/day.model'

@Injectable()
export class CalendarService {
	constructor(
		@InjectModel(DayModel) private readonly DayModel: ModelType<DayModel>
	) {}

	async added(userId: string, dto: AddedDayDto) {
		if (!dto) throw new BadRequestException(ErrorMessages.BAD_REQUEST)

		const data = { ...dto, owner: userId }
		return await this.DayModel.create(data)
	}

	async update(dayId: string, dto: UpdateDayDto) {
		if (!dto) throw new BadRequestException(ErrorMessages.BAD_REQUEST)

		const dayFromDb = await this.DayModel.findById(dayId)
		if (!dayFromDb) throw new NotFoundException(ErrorMessages.NOT_FOUND_BY_ID)

		return await this.DayModel.findByIdAndUpdate(dayId, dto, {
			new: true,
		})
	}

	async delete(dayId: string) {
		const dayFromDb = await this.DayModel.findById(dayId)
		if (!dayFromDb) throw new NotFoundException(ErrorMessages.NOT_FOUND_BY_ID)

		await this.DayModel.findByIdAndDelete(dayId)
		return
	}
}
