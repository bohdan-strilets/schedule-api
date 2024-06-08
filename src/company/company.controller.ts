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
import { CompanyService } from './company.service'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'

@Auth()
@Controller('company')
export class CompanyController {
	constructor(private readonly companyService: CompanyService) {}

	@Post('create')
	async create(@Body() dto: CreateCompanyDto, @User('_id') _id: string) {
		return await this.companyService.create(_id, dto)
	}

	@Patch('update/:companyId')
	async update(
		@Body() dto: UpdateCompanyDto,
		@Param('companyId') companyId: string
	) {
		return await this.companyService.update(companyId, dto)
	}

	@Delete('delete/:companyId')
	async delete(@Param('companyId') companyId: string) {
		return await this.companyService.delete(companyId)
	}

	@Get('by-id/:companyId')
	async getById(@Param('companyId') companyId: string) {
		return await this.companyService.getById(companyId)
	}

	@Get('all')
	async getAll(@User('_id') _id: string) {
		return await this.companyService.getAll(_id)
	}
}
