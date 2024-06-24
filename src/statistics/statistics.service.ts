import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { ErrorMessages } from 'src/common/vars/error-messages'
import { StatisticsModel } from './models/statistics.model'

@Injectable()
export class StatisticsService {
	constructor(
		@InjectModel(StatisticsModel)
		private readonly StatisticsModel: ModelType<StatisticsModel>
	) {}

	async create(userId: string) {
		return await this.StatisticsModel.create({ owner: userId })
	}

	async getStat(statId: string) {
		if (!statId) new NotFoundException(ErrorMessages.NOT_FOUND_BY_ID)
		return await this.StatisticsModel.findById(statId)
	}

	async delete(userId: string) {
		const statistics = await this.StatisticsModel.findOne({ owner: userId })
		if (!statistics) throw new NotFoundException(ErrorMessages.NOT_FOUND_BY_ID)

		await this.StatisticsModel.findByIdAndDelete(statistics._id)
		return
	}
}
