import { BadRequestException, Injectable } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { ErrorMessages } from 'src/common/vars/error-messages'
import { AddedDayDto } from './dto/added-day.dto'
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
}
