import { HttpStatus, Injectable } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import * as fs from 'fs'
import { InjectModel } from 'nestjs-typegoose'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { FileType } from 'src/cloudinary/enums/file-type.enum'
import { ResponseType } from 'src/common/response.type'
import { CloudinaryFolders } from 'src/common/vars/cloudinary-folders'
import { CompanyLogoUrl } from 'src/common/vars/company-logo'
import { ErrorMessages } from 'src/common/vars/error-messages'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { CompanyModel } from './models/company.model'

@Injectable()
export class CompanyService {
	constructor(
		@InjectModel(CompanyModel)
		private readonly CompanyModel: ModelType<CompanyModel>,
		private readonly cloudinaryService: CloudinaryService
	) {}

	async create(
		userId: string,
		dto: CreateCompanyDto
	): Promise<ResponseType<CompanyModel>> {
		this.checkDto(dto)
		const data = { ...dto, owner: userId, logoUrl: CompanyLogoUrl }
		const company = await this.CompanyModel.create(data)

		return {
			success: true,
			statusCode: HttpStatus.CREATED,
			data: company,
		}
	}

	async update(
		companyId: string,
		dto: UpdateCompanyDto
	): Promise<ResponseType<CompanyModel>> {
		this.checkDto(dto)
		await this.checkCompanyFromDb(companyId)

		const updatedCompany = await this.CompanyModel.findByIdAndUpdate(
			companyId,
			dto,
			{
				new: true,
			}
		)

		return {
			success: true,
			statusCode: HttpStatus.OK,
			data: updatedCompany,
		}
	}

	async delete(companyId: string): Promise<ResponseType> {
		await this.checkCompanyFromDb(companyId)
		await this.CompanyModel.findByIdAndDelete(companyId)

		return {
			success: true,
			statusCode: HttpStatus.OK,
		}
	}

	async deleteAll(userId: string): Promise<ResponseType> {
		await this.CompanyModel.deleteMany({ owner: userId })

		return {
			success: true,
			statusCode: HttpStatus.OK,
		}
	}

	async getById(companyId: string): Promise<ResponseType<CompanyModel>> {
		const company = await this.checkCompanyFromDb(companyId)

		if ('_id' in company) {
			return {
				success: true,
				statusCode: HttpStatus.OK,
				data: company,
			}
		}
	}

	async getAll(userId: string): Promise<ResponseType<CompanyModel[]>> {
		const companies = await this.CompanyModel.find({ owner: userId })

		return {
			success: true,
			statusCode: HttpStatus.OK,
			data: companies,
		}
	}

	async uploadLogo(
		file: Express.Multer.File,
		companyId: string,
		userId: string
	): Promise<ResponseType<CompanyModel>> {
		await this.checkCompanyFromDb(companyId)

		const logoPath = `${CloudinaryFolders.COMPANY_LOGO}${userId}`
		const resultPath = await this.cloudinaryService.uploadFile(
			file,
			FileType.IMAGE,
			logoPath
		)

		fs.unlinkSync(file.path)

		const updatedCompany = await this.CompanyModel.findByIdAndUpdate(
			companyId,
			{ logoUrl: resultPath },
			{ new: true }
		)

		return {
			success: true,
			statusCode: HttpStatus.OK,
			data: updatedCompany,
		}
	}

	// HELPERS

	private async checkCompanyFromDb(
		companyId: string
	): Promise<CompanyModel | ResponseType> {
		const companyFromDb = await this.CompanyModel.findById(companyId)

		if (!companyFromDb) {
			return {
				success: false,
				statusCode: HttpStatus.NOT_FOUND,
				message: ErrorMessages.NOT_FOUND_BY_ID,
			}
		}

		return companyFromDb
	}

	private checkDto(dto: any) {
		if (!dto) {
			return {
				success: false,
				statusCode: HttpStatus.BAD_REQUEST,
				message: ErrorMessages.BAD_REQUEST,
			}
		}
	}
}
