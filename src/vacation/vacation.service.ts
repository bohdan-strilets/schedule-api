import { HttpStatus, Injectable } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { ResponseType } from 'src/common/response.type'
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

	async added(
		userId: string,
		dto: AddedVacationDto
	): Promise<ResponseType<VacationModel>> {
		const { usedHours, amountHours } = dto
		await this.checkDto(dto)

		const year = new Date().getFullYear()
		const vacationFromDb = await this.VacationModel.findOne({ year })

		if (vacationFromDb) {
			return {
				success: false,
				statusCode: HttpStatus.CONFLICT,
				message: ErrorMessages.VACATION_ALREADY,
			}
		}

		let hoursLeft = 0
		if (usedHours && usedHours > 0) {
			hoursLeft = amountHours - usedHours
		}

		const data = { ...dto, owner: userId, hoursLeft }
		const vacationInfo = await this.VacationModel.create(data)

		return {
			success: true,
			statusCode: HttpStatus.CREATED,
			data: vacationInfo,
		}
	}

	async useVacation(
		vacationId: string,
		dto: UseVacationDto
	): Promise<ResponseType<VacationModel>> {
		await this.checkDto(dto)
		const vacationFromDb = await this.checkVacationFromDb(vacationId)

		if ('_id' in vacationFromDb) {
			let hoursLeft = vacationFromDb.hoursLeft - dto.usedHours
			let usedHours = vacationFromDb.usedHours + dto.usedHours

			const updatedVacation = await this.VacationModel.findByIdAndUpdate(
				vacationId,
				{ hoursLeft, usedHours },
				{ new: true }
			)

			return {
				success: true,
				statusCode: HttpStatus.OK,
				data: updatedVacation,
			}
		}
	}

	async changeAmountHours(
		vacationId: string,
		dto: ChangeAmountHoursDto
	): Promise<ResponseType<VacationModel>> {
		const { amountHours } = dto
		await this.checkDto(dto)
		await this.checkVacationFromDb(vacationId)

		const updatedVacation = await this.VacationModel.findByIdAndUpdate(
			vacationId,
			{ amountHours },
			{ new: true }
		)

		return {
			success: true,
			statusCode: HttpStatus.OK,
			data: updatedVacation,
		}
	}

	async getById(vacationId: string): Promise<ResponseType<VacationModel>> {
		const vacationInfo = await this.checkVacationFromDb(vacationId)

		if ('_id' in vacationInfo) {
			return {
				success: true,
				statusCode: HttpStatus.OK,
				data: vacationInfo,
			}
		}
	}

	async getAll(userId: string): Promise<ResponseType<VacationModel[]>> {
		const vacations = await this.VacationModel.find({ owner: userId })

		return {
			success: true,
			statusCode: HttpStatus.OK,
			data: vacations,
		}
	}

	async delete(vacationId: string): Promise<ResponseType> {
		await this.checkVacationFromDb(vacationId)
		await this.VacationModel.findByIdAndDelete(vacationId)

		return {
			success: true,
			statusCode: HttpStatus.OK,
		}
	}

	async deleteAll(userId: string): Promise<ResponseType> {
		await this.VacationModel.deleteMany({ owner: userId })

		return {
			success: true,
			statusCode: HttpStatus.OK,
		}
	}

	// HELPERS

	private async checkDto(dto: any): Promise<ResponseType> {
		if (!dto) {
			return {
				success: false,
				statusCode: HttpStatus.BAD_REQUEST,
				message: ErrorMessages.BAD_REQUEST,
			}
		}
	}

	private async checkVacationFromDb(
		vacationId: string
	): Promise<VacationModel | ResponseType> {
		const vacationFromDb = await this.VacationModel.findById(vacationId)

		if (!vacationFromDb) {
			return {
				success: false,
				statusCode: HttpStatus.NOT_FOUND,
				message: ErrorMessages.NOT_FOUND_BY_ID,
			}
		}

		return vacationFromDb
	}
}
