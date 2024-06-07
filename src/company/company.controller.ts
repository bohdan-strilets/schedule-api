import { Body, Controller, Post } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { User } from 'src/user/decorators/user.decorator'
import { CompanyService } from './company.service'
import { CreateCompanyDto } from './dto/create-company.dto'

@Controller('company')
export class CompanyController {
	constructor(private readonly companyService: CompanyService) {}

	@Auth()
	@Post('create')
	async create(@Body() dto: CreateCompanyDto, @User('_id') _id: string) {
		return await this.companyService.create(_id, dto)
	}
}
