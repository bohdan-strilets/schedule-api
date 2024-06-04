import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
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
	],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
