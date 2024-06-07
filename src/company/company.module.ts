import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { CompanyController } from './company.controller'
import { CompanyService } from './company.service'
import { CompanyModel } from './models/company.model'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: CompanyModel,
				schemaOptions: {
					collection: 'Company',
				},
			},
		]),
	],
	controllers: [CompanyController],
	providers: [CompanyService],
})
export class CompanyModule {}
