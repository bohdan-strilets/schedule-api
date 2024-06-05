import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { compare, genSalt, hash } from 'bcryptjs'
import { InjectModel } from 'nestjs-typegoose'
import { SendgridService } from 'src/sendgrid/sendgrid.service'
import { v4 } from 'uuid'
import { ChangePasswordDto } from './dto/change-password.dto'
import { ChangeProfileDto } from './dto/change-profile.dto'
import { EmailDto } from './dto/email.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
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

	async changeEmail(userId: string, dto: EmailDto) {
		if (!userId) throw new UnauthorizedException('User not authorized')

		const activationToken = v4()
		await this.sendgridService.sendConfirmEmailLetter(
			dto.email,
			activationToken
		)
		const emailDto = { email: dto.email, activationToken, isActivated: false }
		await this.UserModel.findByIdAndUpdate(userId, emailDto, { new: true })

		return
	}

	async requestResetPassword(dto: EmailDto) {
		const user = await this.findByEmail(dto.email)
		if (!user) throw new NotFoundException('user not found')

		user.password = ''
		user.save()

		await this.sendgridService.sendPasswordResetEmail(user.email)
		return
	}

	async resetPassword(dto: ResetPasswordDto) {
		const salt = await genSalt(10)
		const hashPassword = await hash(dto.password, salt)

		const user = await this.findByEmail(dto.email)
		if (!user) throw new NotFoundException('user not found')

		await this.UserModel.findByIdAndUpdate(user._id, { password: hashPassword })
		return
	}

	async changePassword(dto: ChangePasswordDto, userId: string) {
		const user = await this.findById(userId)
		const isValidPassword = await compare(dto.password, user.password)

		if (!user || !isValidPassword)
			throw new UnauthorizedException('user not authorized')

		const salt = await genSalt(10)
		const hashPassword = await hash(dto.newPassword, salt)

		await this.UserModel.findByIdAndUpdate(userId, { password: hashPassword })
		return
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

	async findByEmail(email: string) {
		return this.UserModel.findOne({ email }).exec()
	}

	async findById(id: string) {
		return this.UserModel.findById(id).exec()
	}
}
