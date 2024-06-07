import { Injectable } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { VacationModel } from './models/vacation.model'

@Injectable()
export class VacationService {
	constructor(
		@InjectModel(VacationModel)
		private readonly VacationModel: ModelType<VacationModel>
	) {}
}
