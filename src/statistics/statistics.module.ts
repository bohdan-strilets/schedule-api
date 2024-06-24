import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { StatisticsModel } from './models/statistics.model'
import { StatisticsOperationsService } from './statistics-operations.service'
import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: StatisticsModel,
				schemaOptions: {
					collection: 'Statistics',
				},
			},
		]),
	],
	controllers: [StatisticsController],
	providers: [StatisticsService, StatisticsOperationsService],
	exports: [StatisticsService, StatisticsOperationsService],
})
export class StatisticsModule {}
