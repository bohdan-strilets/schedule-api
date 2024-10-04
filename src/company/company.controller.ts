import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	Res,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { ResponseType } from 'src/common/response.type'
import { DEFAULT_FOLDER_FOR_FILES } from 'src/common/vars/default-file-folder'
import { User } from 'src/user/decorators/user.decorator'
import { CompanyService } from './company.service'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { CompanyModel } from './models/company.model'
import { imageValidator } from './pipes/image-validator.pipe'

@Auth()
@Controller('company')
export class CompanyController {
	constructor(private readonly companyService: CompanyService) {}

	@Post('create')
	async create(
		@Body() dto: CreateCompanyDto,
		@User('_id') _id: string,
		@Res({ passthrough: true }) res: Response
	): Promise<ResponseType<CompanyModel>> {
		const data = await this.companyService.create(_id, dto)
		if (!data.success) res.status(data.statusCode)
		return data
	}

	@Patch('update/:companyId')
	async update(
		@Body() dto: UpdateCompanyDto,
		@Param('companyId') companyId: string,
		@Res({ passthrough: true }) res: Response
	): Promise<ResponseType<CompanyModel>> {
		const data = await this.companyService.update(companyId, dto)
		if (!data.success) res.status(data.statusCode)
		return data
	}

	@Delete('delete/:companyId')
	async delete(
		@Param('companyId') companyId: string,
		@Res({ passthrough: true }) res: Response
	): Promise<ResponseType> {
		const data = await this.companyService.delete(companyId)
		if (!data.success) res.status(data.statusCode)
		return data
	}

	@Delete('delete-all')
	async deleteAll(
		@User('_id') _id: string,
		@Res({ passthrough: true }) res: Response
	): Promise<ResponseType> {
		const data = await this.companyService.deleteAll(_id)
		if (!data.success) res.status(data.statusCode)
		return data
	}

	@Get('by-id/:companyId')
	async getById(
		@Param('companyId') companyId: string,
		@Res({ passthrough: true }) res: Response
	): Promise<ResponseType<CompanyModel>> {
		const data = await this.companyService.getById(companyId)
		if (!data.success) res.status(data.statusCode)
		return data
	}

	@Get('all')
	async getAll(
		@User('_id') _id: string,
		@Res({ passthrough: true }) res: Response
	): Promise<ResponseType<CompanyModel[]>> {
		const data = await this.companyService.getAll(_id)
		if (!data.success) res.status(data.statusCode)
		return data
	}

	@HttpCode(HttpStatus.OK)
	@Post('upload-logo')
	@UseInterceptors(
		FileInterceptor('company-logo', { dest: DEFAULT_FOLDER_FOR_FILES })
	)
	async uploadAvatar(
		@UploadedFile(imageValidator)
		file: Express.Multer.File,
		@User('_id') _id: string,
		@Res({ passthrough: true }) res: Response,
		@Query('companyId') companyId: string
	): Promise<ResponseType<CompanyModel>> {
		const data = await this.companyService.uploadLogo(file, companyId, _id)
		if (!data.success) res.status(data.statusCode)
		return data
	}
}
