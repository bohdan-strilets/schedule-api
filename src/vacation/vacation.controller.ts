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
import { AddedVacationDto } from './dto/added-vacation.dto'
import { ChangeAmountHoursDto } from './dto/change-amount-hours.dto'
import { UseVacationDto } from './dto/use-vacation.dto'
import { VacationModel } from './models/vacation.model'
import { VacationService } from './vacation.service'

@Auth()
@Controller('vacation')
export class VacationController {
	constructor(private readonly vacationService: VacationService) {}

	@Post('added')
	async added(
		@Body() dto: AddedVacationDto,
		@User('_id') _id: string,
		@Res() res: Response
	): Promise<ResponseType<VacationModel>> {
		const data = await this.vacationService.added(_id, dto)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Patch('use-vacation/:vacationId')
	async useVacation(
		@Body() dto: UseVacationDto,
		@Param('vacationId') vacationId: string,
		@Res() res: Response
	): Promise<ResponseType<VacationModel>> {
		const data = await this.vacationService.useVacation(vacationId, dto)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Patch('change-amount-hours/:vacationId')
	async changeAmountHours(
		@Body() dto: ChangeAmountHoursDto,
		@Param('vacationId') vacationId: string,
		@Res() res: Response
	): Promise<ResponseType<VacationModel>> {
		const data = await this.vacationService.changeAmountHours(vacationId, dto)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Get('by-id/:vacationId')
	async getById(
		@Param('vacationId') vacationId: string,
		@Res() res: Response
	): Promise<ResponseType<VacationModel>> {
		const data = await this.vacationService.getById(vacationId)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Get('all')
	async getAll(
		@User('_id') _id: string,
		@Res() res: Response
	): Promise<ResponseType<VacationModel[]>> {
		const data = await this.vacationService.getAll(_id)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Delete('delete/:vacationId')
	async delete(
		@Param('vacationId') vacationId: string,
		@Res() res: Response
	): Promise<ResponseType> {
		const data = await this.vacationService.delete(vacationId)

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
		const data = await this.vacationService.deleteAll(_id)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}
}
