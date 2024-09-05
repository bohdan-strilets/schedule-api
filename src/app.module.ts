import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { AuthModule } from './auth/auth.module'
import { CalendarModule } from './calendar/calendar.module'
import { CloudinaryModule } from './cloudinary/cloudinary.module'
import { CompanyModule } from './company/company.module'
import { getMongoConfig } from './config/mongo.config'
import { PasswordModule } from './password/password.module'
import { SendgridModule } from './sendgrid/sendgrid.module'
import { StatisticsModule } from './statistics/statistics.module'
import { TodosModule } from './todos/todos.module'
import { UserModule } from './user/user.module'
import { VacationModule } from './vacation/vacation.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		AuthModule,
		UserModule,
		SendgridModule,
		CloudinaryModule,
		PasswordModule,
		CompanyModule,
		VacationModule,
		CalendarModule,
		TodosModule,
		StatisticsModule,
	],
})
export class AppModule {}
