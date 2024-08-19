import { Controller, Delete, Get, Param, Res } from '@nestjs/common'
import { Response } from 'express'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { ResponseType } from 'src/common/response.type'
import { User } from 'src/user/decorators/user.decorator'
import { StatisticsModel } from './models/statistics.model'
import { StatisticsService } from './statistics.service'

@Auth()
@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	@Get('/:statId')
	async getStat(
		@Param('statId') statId: string,
		@Res({ passthrough: true }) res: Response
	): Promise<ResponseType<StatisticsModel> | ResponseType> {
		const data = await this.statisticsService.getStat(statId)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Delete('/delete')
	async delete(
		@User('_id') _id: string,
		@Res({ passthrough: true }) res: Response
	): Promise<ResponseType> {
		const data = await this.statisticsService.delete(_id)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}
}
