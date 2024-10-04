import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'
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
		CloudinaryModule,
	],
	controllers: [CompanyController],
	providers: [CompanyService],
	exports: [CompanyService],
})
export class CompanyModule {}
