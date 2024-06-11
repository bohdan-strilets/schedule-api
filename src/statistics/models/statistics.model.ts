import { Ref, prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { UserModel } from 'src/user/models/user.model'
import { CompanyStatsModel } from './company-stats.model'
import { TodoStatsModel } from './todo-stats.model'
import { WorkStatsModel } from './work-stats.model'

export interface StatisticsModel extends Base {}

export class StatisticsModel extends TimeStamps {
	@prop({ ref: () => UserModel })
	owner: Ref<UserModel>

	@prop({ default: {} })
	workStats: WorkStatsModel

	@prop({ default: {} })
	todoStats: TodoStatsModel

	@prop({ default: {} })
	companyStats: CompanyStatsModel
}
