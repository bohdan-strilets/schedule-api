import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Res,
} from '@nestjs/common'
import { Response } from 'express'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { ResponseType } from 'src/common/response.type'
import { User } from 'src/user/decorators/user.decorator'
import { CalendarService } from './calendar.service'
import { AddedDayDto } from './dto/added-day.dto'
import { UpdateDayDto } from './dto/update-day.dto'
import { DayModel } from './models/day.model'

@Auth()
@Controller('calendar')
export class CalendarController {
	constructor(private readonly calendarService: CalendarService) {}

	@Post('added')
	async added(
		@Body() dto: AddedDayDto,
		@User('_id') _id: string,
		@Res() res: Response
	): Promise<ResponseType<DayModel>> {
		const data = await this.calendarService.added(_id, dto)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Patch('update/:dayId')
	async update(
		@Body() dto: UpdateDayDto,
		@Param('dayId') dayId: string,
		@User('_id') _id: string,
		@Res() res: Response
	): Promise<ResponseType<DayModel>> {
		const data = await this.calendarService.update(dayId, dto, _id)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Delete('delete/:dayId')
	async delete(
		@Param('dayId') dayId: string,
		@User('_id') _id: string,
		@Res() res: Response
	): Promise<ResponseType> {
		const data = await this.calendarService.delete(dayId, _id)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Delete('delete-all')
	async deleteAll(
		@User('_id') _id: string,
		@Res() res: Response
	): Promise<ResponseType> {
		const data = await this.calendarService.deleteAll(_id)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Get('by-id/:dayId')
	async getById(
		@Param('dayId') dayId: string,
		@Res() res: Response
	): Promise<ResponseType<DayModel>> {
		const data = await this.calendarService.getById(dayId)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Get('all')
	async getAll(
		@User('_id') _id: string,
		@Res() res: Response
	): Promise<ResponseType<DayModel[]>> {
		const data = await this.calendarService.getAll(_id)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}
}
