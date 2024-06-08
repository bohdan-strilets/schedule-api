import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { ErrorMessages } from 'src/common/vars/error-messages'
import { AddedVacationDto } from './dto/added-vacation.dto'
import { ChangeAmountHoursDto } from './dto/change-amount-hours.dto'
import { UseVacationDto } from './dto/use-vacation.dto'
import { VacationModel } from './models/vacation.model'

@Injectable()
export class VacationService {
	constructor(
		@InjectModel(VacationModel)
		private readonly VacationModel: ModelType<VacationModel>
	) {}

	async added(userId: string, dto: AddedVacationDto) {
		const { usedHours, amountHours } = dto
		this.checkDto(dto)

		const year = new Date().getFullYear()
		const vacationFromDb = await this.VacationModel.findOne({ year })

		if (vacationFromDb)
			throw new ConflictException(ErrorMessages.VACATION_ALREADY)

		let hoursLeft = 0
		if (usedHours && usedHours > 0) {
			hoursLeft = amountHours - usedHours
		}

		const data = { ...dto, owner: userId, hoursLeft }
		return await this.VacationModel.create(data)
	}

	async useVacation(vacationId: string, dto: UseVacationDto) {
		this.checkDto(dto)
		const vacationFromDb = await this.checkVacationFromDb(vacationId)

		let hoursLeft = vacationFromDb.hoursLeft - dto.usedHours
		let usedHours = vacationFromDb.usedHours + dto.usedHours

		const updatedVacation = await this.VacationModel.findByIdAndUpdate(
			vacationId,
			{ hoursLeft, usedHours },
			{ new: true }
		)

		return updatedVacation
	}

	async changeAmountHours(vacationId: string, dto: ChangeAmountHoursDto) {
		const { amountHours } = dto
		this.checkDto(dto)
		await this.checkVacationFromDb(vacationId)

		const updatedVacation = await this.VacationModel.findByIdAndUpdate(
			vacationId,
			{ amountHours },
			{ new: true }
		)

		return updatedVacation
	}

	async getById(vacationId: string) {
		return await this.checkVacationFromDb(vacationId)
	}

	async getAll() {
		return await this.VacationModel.find()
	}

	// HELPERS

	checkDto(dto: any) {
		if (!dto) throw new BadRequestException(ErrorMessages.BAD_REQUEST)
	}

	async checkVacationFromDb(vacationId: string) {
		const vacationFromDb = await this.VacationModel.findById(vacationId)
		if (!vacationFromDb)
			throw new NotFoundException(ErrorMessages.NOT_FOUND_BY_ID)

		return vacationFromDb
	}
}
