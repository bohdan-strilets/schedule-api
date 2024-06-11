import { Controller, Get } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { User } from 'src/user/decorators/user.decorator'
import { StatisticsService } from './statistics.service'

@Auth()
@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	@Get('get-statistics')
	async getStatistics(@User('_id') _id: string) {
		return await this.statisticsService.getStatistics(_id)
	}
}
