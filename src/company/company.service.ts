import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { ErrorMessages } from 'src/common/vars/error-messages'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { CompanyModel } from './models/company.model'

@Injectable()
export class CompanyService {
	constructor(
		@InjectModel(CompanyModel)
		private readonly CompanyModel: ModelType<CompanyModel>
	) {}

	async create(userId: string, dto: CreateCompanyDto) {
		if (!dto) throw new BadRequestException(ErrorMessages.BAD_REQUEST)

		const data = { ...dto, owner: userId }
		return await this.CompanyModel.create(data)
	}

	async update(companyId: string, dto: UpdateCompanyDto) {
		if (!dto) throw new BadRequestException(ErrorMessages.BAD_REQUEST)

		const updatedCompany = await this.CompanyModel.findByIdAndUpdate(
			companyId,
			dto,
			{ new: true }
		)

		return updatedCompany
	}

	async delete(companyId: string) {
		const companyFromDb = await this.CompanyModel.findById(companyId)
		if (!companyFromDb)
			throw new NotFoundException(ErrorMessages.NOT_FOUND_BY_ID)

		await this.CompanyModel.findByIdAndDelete(companyId)
		return
	}
}
