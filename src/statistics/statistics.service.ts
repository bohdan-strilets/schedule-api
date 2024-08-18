import { HttpStatus, Injectable } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { ResponseType } from 'src/common/response.type'
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

	async getStat(
		statId: string
	): Promise<ResponseType<StatisticsModel> | ResponseType> {
		if (!statId) {
			return {
				success: false,
				statusCode: HttpStatus.NOT_FOUND,
				message: ErrorMessages.NOT_FOUND_BY_ID,
			}
		}

		const stat = await this.StatisticsModel.findById(statId)

		return {
			success: true,
			statusCode: HttpStatus.OK,
			data: stat,
		}
	}

	async delete(userId: string): Promise<ResponseType> {
		const statistics = await this.StatisticsModel.findOne({ owner: userId })

		if (!statistics) {
			return {
				success: false,
				statusCode: HttpStatus.NOT_FOUND,
				message: ErrorMessages.NOT_FOUND_BY_ID,
			}
		}

		await this.StatisticsModel.findByIdAndDelete(statistics._id)

		return {
			success: true,
			statusCode: HttpStatus.OK,
		}
	}
}
