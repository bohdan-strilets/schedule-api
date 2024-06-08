import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common'
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

	@Delete('delete/:dayId')
	async delete(@Param('dayId') dayId: string) {
		return await this.calendarService.delete(dayId)
	}

	@Delete('delete-all')
	async deleteAll(@User('_id') _id: string) {
		return await this.calendarService.deleteAll(_id)
	}

	@Get('by-id/:dayId')
	async getById(@Param('dayId') dayId: string) {
		return await this.calendarService.getById(dayId)
	}

	@Get('all')
	async getAll(@User('_id') _id: string) {
		return await this.calendarService.getAll(_id)
	}
}
