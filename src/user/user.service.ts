import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { SendgridService } from 'src/sendgrid/sendgrid.service'
import { v4 } from 'uuid'
import { ChangeProfileDto } from './dto/change-profile.dto'
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

	async changeProfile(userId: string, dto: ChangeProfileDto) {
		if (!userId) throw new UnauthorizedException('Not unauthorized')

		const updatedUser = await this.UserModel.findByIdAndUpdate(userId, dto, {
			new: true,
		})

		if (!updatedUser) throw new NotFoundException('User not found')

		return this.returnUserFields(updatedUser)
	}

	// HELPERS

	returnUserFields(user: UserModel) {
		return {
			_id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			nickname: user.nickname,
			dateBirth: user.dateBirth,
			location: user.location,
			phoneNumber: user.phoneNumber,
			email: user.email,
			gender: user.gender,
			description: user.description,
			avatarUrl: user.avatarUrl,
			posterUrl: user.posterUrl,
			isActivated: user.isActivated,
			company: user.company,
			vacation: user.vacation,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		}
	}
}
