import { Body, Controller, Param, Patch, Post } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { User } from 'src/user/decorators/user.decorator'
import { CalendarService } from './calendar.service'
import { AddedDayDto } from './dto/added-day.dto'
import { UpdateDayDto } from './dto/update-day.dto'

@Auth()
@Controller('calendar')
export class CalendarController {
	constructor(private readonly calendarService: CalendarService) {}

	@Post('added')
	async added(@Body() dto: AddedDayDto, @User('_id') _id: string) {
		return await this.calendarService.added(_id, dto)
	}

	@Patch('update/:dayId')
	async update(@Body() dto: UpdateDayDto, @Param('dayId') dayId: string) {
		return await this.calendarService.update(dayId, dto)
	}
}
