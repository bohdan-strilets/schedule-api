import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { VacationModel } from './models/vacation.model'
import { VacationController } from './vacation.controller'
import { VacationService } from './vacation.service'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: VacationModel,
				schemaOptions: {
					collection: 'Vacation',
				},
			},
		]),
	],
	controllers: [VacationController],
	providers: [VacationService],
	exports: [VacationService],
})
export class VacationModule {}
