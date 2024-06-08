import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
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
	],
	controllers: [CalendarController],
	providers: [CalendarService],
})
export class CalendarModule {}
