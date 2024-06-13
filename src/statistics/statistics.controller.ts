import { Controller } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { StatisticsService } from './statistics.service'

@Auth()
@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	// @Get('/:statisticsId')
	// async getStatistics(@Param('statisticsId') statisticsId: string) {
	// 	return await this.statisticsService.getStatistics(statisticsId)
	// }
}
