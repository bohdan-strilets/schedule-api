import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { StatisticsModule } from 'src/statistics/statistics.module'
import { CalendarController } from './calendar.controller'
import { CalendarService } from './calendar.service'
import { DayModel } from './models/day.model'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: DayModel,
				schemaOptions: {
					collection: 'Day',
				},
			},
		]),
		StatisticsModule,
	],
	controllers: [CalendarController],
	providers: [CalendarService],
	exports: [CalendarService],
})
export class CalendarModule {}
