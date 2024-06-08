import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { CompanyLogoUrl } from 'src/common/vars/company-logo'
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
		this.checkDto(dto)
		const data = { ...dto, owner: userId, logoUrl: CompanyLogoUrl }
		return await this.CompanyModel.create(data)
	}

	async update(companyId: string, dto: UpdateCompanyDto) {
		this.checkDto(dto)
		await this.checkCompanyFromDb(companyId)

		return await this.CompanyModel.findByIdAndUpdate(companyId, dto, {
			new: true,
		})
	}

	async delete(companyId: string) {
		await this.checkCompanyFromDb(companyId)
		await this.CompanyModel.findByIdAndDelete(companyId)
		return
	}

	async getById(companyId: string) {
		return await this.checkCompanyFromDb(companyId)
	}

	async getAll(userId: string) {
		return await this.CompanyModel.find({ owner: userId })
	}

	// HELPERS

	async checkCompanyFromDb(companyId: string) {
		const companyFromDb = await this.CompanyModel.findById(companyId)
		if (!companyFromDb)
			throw new NotFoundException(ErrorMessages.NOT_FOUND_BY_ID)

		return companyFromDb
	}

	checkDto(dto: any) {
		if (!dto) throw new BadRequestException(ErrorMessages.BAD_REQUEST)
	}
}
