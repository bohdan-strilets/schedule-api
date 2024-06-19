import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { CalendarModule } from 'src/calendar/calendar.module'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'
import { CompanyModule } from 'src/company/company.module'
import { PasswordModule } from 'src/password/password.module'
import { SendgridModule } from 'src/sendgrid/sendgrid.module'
import { StatisticsModule } from 'src/statistics/statistics.module'
import { TodosModule } from 'src/todos/todos.module'
import { VacationModule } from 'src/vacation/vacation.module'
import { UserModel } from './models/user.model'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: 'User',
				},
			},
		]),
		SendgridModule,
		PasswordModule,
		CloudinaryModule,
		CalendarModule,
		CompanyModule,
		StatisticsModule,
		TodosModule,
		VacationModule,
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
