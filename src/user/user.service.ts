import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { SendgridService } from 'src/sendgrid/sendgrid.service'
import { v4 } from 'uuid'
import { EmailDto } from './dto/email.dto'
import { UserModel } from './models/user.model'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
		private readonly sendgridService: SendgridService
	) {}

	async activationEmail(activationToken: string) {
		const user = await this.UserModel.findOne({ activationToken })

		if (!user) throw new NotFoundException('Activation token is wrong')

		const activationOptions = { activationToken: null, isActivated: true }
		await this.UserModel.findByIdAndUpdate(user._id, activationOptions)

		return
	}

	async requestRepeatActivationEmail(dto: EmailDto) {
		const user = await this.UserModel.findOne({ email: dto.email })
		const activationToken = v4()

		if (!user) throw new NotFoundException('User with current email not found')

		const updatedUser = await this.UserModel.findByIdAndUpdate(
			user._id,
			{
				isActivated: false,
				activationToken,
			},
			{ new: true }
		)

		await this.sendgridService.sendConfirmEmailLetter(
			updatedUser.email,
			updatedUser.activationToken
		)

		return
	}
}
