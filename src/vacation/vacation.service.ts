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

		if (!dto) throw new BadRequestException(ErrorMessages.BAD_REQUEST)

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
		if (!dto) throw new BadRequestException(ErrorMessages.BAD_REQUEST)

		const vacationFromDb = await this.VacationModel.findById(vacationId)
		if (!vacationFromDb)
			throw new NotFoundException(ErrorMessages.NOT_FOUND_BY_ID)

		let hoursLeft = vacationFromDb.hoursLeft - dto.usedHours
		let usedHours = vacationFromDb.usedHours + dto.usedHours

		const updatedVacation = await this.VacationModel.findByIdAndUpdate(
			vacationId,
			{ hoursLeft, usedHours },
			{ new: true }
		)

		return updatedVacation
	}
}
