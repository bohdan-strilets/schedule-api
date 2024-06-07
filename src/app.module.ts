import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { AuthModule } from './auth/auth.module'
import { getMongoConfig } from './config/mongo.config'
import { UserModule } from './user/user.module'
import { SendgridModule } from './sendgrid/sendgrid.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PasswordModule } from './password/password.module';
import { CompanyModule } from './company/company.module';
import { VacationModule } from './vacation/vacation.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
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
	],
})
export class AppModule {}
