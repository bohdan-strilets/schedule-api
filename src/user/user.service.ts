import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import * as fs from 'fs'
import { InjectModel } from 'nestjs-typegoose'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { FileType } from 'src/cloudinary/enums/file-type.enum'
import { CloudinaryFolders } from 'src/common/vars/cloudinary-folders'
import { ErrorMessages } from 'src/common/vars/error-messages'
import { PasswordService } from 'src/password/password.service'
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
		private readonly sendgridService: SendgridService,
		private readonly passwordService: PasswordService,
		private readonly cloudinaryService: CloudinaryService
	) {}

	async activationEmail(activationToken: string) {
		const user = await this.UserModel.findOne({ activationToken })

		if (!user)
			throw new NotFoundException(ErrorMessages.ACTIVATION_TOKEN_IS_WRONG)

		const activationOptions = { activationToken: null, isActivated: true }
		await this.UserModel.findByIdAndUpdate(user._id, activationOptions)

		return
	}

	async requestRepeatActivationEmail(dto: EmailDto) {
		const user = await this.UserModel.findOne({ email: dto.email })
		const activationToken = v4()

		if (!user) throw new NotFoundException(ErrorMessages.USER_NOT_FOUND)

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
		if (!userId)
			throw new UnauthorizedException(ErrorMessages.USER_IS_NOT_UNAUTHORIZED)

		const updatedUser = await this.UserModel.findByIdAndUpdate(userId, dto, {
			new: true,
		})

		if (!updatedUser) throw new NotFoundException(ErrorMessages.USER_NOT_FOUND)

		return this.returnUserFields(updatedUser)
	}

	async changeEmail(userId: string, dto: EmailDto) {
		if (!userId)
			throw new UnauthorizedException(ErrorMessages.USER_IS_NOT_UNAUTHORIZED)

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
		if (!user) throw new NotFoundException(ErrorMessages.USER_NOT_FOUND)

		user.password = ''
		user.save()

		await this.sendgridService.sendPasswordResetEmail(user.email)
		return
	}

	async resetPassword(dto: ResetPasswordDto) {
		const hashPassword = await this.passwordService.createPassword(dto.password)

		const user = await this.findByEmail(dto.email)
		if (!user) throw new NotFoundException(ErrorMessages.USER_NOT_FOUND)

		await this.UserModel.findByIdAndUpdate(user._id, { password: hashPassword })
		return
	}

	async changePassword(dto: ChangePasswordDto, userId: string) {
		const user = await this.findById(userId)
		const isValidPassword = await this.passwordService.checkPassword(
			dto.password,
			user.password
		)

		if (!user || !isValidPassword)
			throw new UnauthorizedException(ErrorMessages.USER_IS_NOT_UNAUTHORIZED)

		const hashPassword = await this.passwordService.createPassword(
			dto.newPassword
		)

		await this.UserModel.findByIdAndUpdate(userId, { password: hashPassword })
		return
	}

	async uploadAvatar(file: Express.Multer.File, userId: string) {
		const user = await this.findById(userId)
		if (!user) throw new NotFoundException(ErrorMessages.USER_NOT_FOUND)

		const avatarPath = `${CloudinaryFolders.USER_AVATAR}${userId}`
		const resultPath = await this.cloudinaryService.uploadFile(
			file,
			FileType.IMAGE,
			avatarPath
		)
		fs.unlinkSync(file.path)

		const updatedUser = await this.UserModel.findByIdAndUpdate(
			userId,
			{ avatarUrl: resultPath },
			{ new: true }
		)

		return { avatarUrl: updatedUser.avatarUrl }
	}

	async uploadPoster(file: Express.Multer.File, userId: string) {
		const user = await this.findById(userId)
		if (!user) throw new NotFoundException(ErrorMessages.USER_NOT_FOUND)

		const avatarPath = `${CloudinaryFolders.USER_POSTER}${userId}`
		const resultPath = await this.cloudinaryService.uploadFile(
			file,
			FileType.IMAGE,
			avatarPath
		)
		fs.unlinkSync(file.path)

		const updatedUser = await this.UserModel.findByIdAndUpdate(
			userId,
			{ avatarUrl: resultPath },
			{ new: true }
		)

		return { posterUrl: updatedUser.posterUrl }
	}

	async deleteProfile(userId: string) {
		const user = await this.findById(userId)
		if (!user)
			throw new UnauthorizedException(ErrorMessages.USER_IS_NOT_UNAUTHORIZED)

		await this.UserModel.findByIdAndDelete(userId)

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
