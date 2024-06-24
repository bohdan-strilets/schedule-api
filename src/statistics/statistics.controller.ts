import { Controller, Delete, Get, Param } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { User } from 'src/user/decorators/user.decorator'
import { StatisticsService } from './statistics.service'

@Auth()
@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	@Get('/:statId')
	async getStat(@Param('statId') statId: string) {
		return await this.statisticsService.getStat(statId)
	}

	@Delete('/delete')
	async delete(@User('_id') _id: string) {
		return await this.statisticsService.delete(_id)
	}
}
