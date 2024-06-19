import { Controller, Delete, Get, Param } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { StatisticsService } from './statistics.service'

@Auth()
@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	@Get('/:statId')
	async getStat(@Param('statId') statId: string) {
		return await this.statisticsService.getStat(statId)
	}

	@Delete('/:statId')
	async delete(@Param('statId') statId: string) {
		return await this.statisticsService.delete(statId)
	}
}
