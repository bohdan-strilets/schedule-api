import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { PasswordModule } from 'src/password/password.module'
import { SendgridModule } from 'src/sendgrid/sendgrid.module'
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
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
