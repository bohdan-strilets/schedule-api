import { HttpStatus, Injectable } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import * as fs from 'fs'
import { InjectModel } from 'nestjs-typegoose'
import { CalendarService } from 'src/calendar/calendar.service'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { FileType } from 'src/cloudinary/enums/file-type.enum'
import { ResponseType } from 'src/common/response.type'
import { CloudinaryFolders } from 'src/common/vars/cloudinary-folders'
import { ErrorMessages } from 'src/common/vars/error-messages'
import { CompanyService } from 'src/company/company.service'
import { PasswordService } from 'src/password/password.service'
import { SendgridService } from 'src/sendgrid/sendgrid.service'
import { StatisticsService } from 'src/statistics/statistics.service'
import { TodosService } from 'src/todos/todos.service'
import { VacationService } from 'src/vacation/vacation.service'
import { v4 } from 'uuid'
import { ChangePasswordDto } from './dto/change-password.dto'
import { ChangeProfileDto } from './dto/change-profile.dto'
import { EmailDto } from './dto/email.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { UserModel } from './models/user.model'
import { ReturningUser } from './types/returning-user.type'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
		private readonly sendgridService: SendgridService,
		private readonly passwordService: PasswordService,
		private readonly cloudinaryService: CloudinaryService,
		private readonly calendarService: CalendarService,
		private readonly companyService: CompanyService,
		private readonly statisticsService: StatisticsService,
		private readonly todosService: TodosService,
		private readonly vacationService: VacationService
	) {}

	async activationEmail(activationToken: string): Promise<ResponseType> {
		const user = await this.UserModel.findOne({ activationToken })

		if (!user) {
			return {
				success: false,
				statusCode: HttpStatus.NOT_FOUND,
				message: ErrorMessages.ACTIVATION_TOKEN_IS_WRONG,
			}
		}

		const activationOptions = { activationToken: null, isActivated: true }
		await this.UserModel.findByIdAndUpdate(user._id, activationOptions)

		return {
			success: true,
			statusCode: HttpStatus.OK,
		}
	}

	async requestRepeatActivationEmail(dto: EmailDto): Promise<ResponseType> {
		const user = await this.UserModel.findOne({ email: dto.email })
		const activationToken = v4()

		if (!user) {
			return {
				success: false,
				statusCode: HttpStatus.NOT_FOUND,
				message: ErrorMessages.USER_NOT_FOUND,
			}
		}

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

		return {
			success: true,
			statusCode: HttpStatus.OK,
		}
	}

	async changeProfile(
		userId: string,
		dto: ChangeProfileDto
	): Promise<ResponseType<ReturningUser>> {
		if (!userId) {
			return {
				success: false,
				statusCode: HttpStatus.UNAUTHORIZED,
				message: ErrorMessages.USER_IS_NOT_UNAUTHORIZED,
			}
		}

		const updatedUser = await this.UserModel.findByIdAndUpdate(userId, dto, {
			new: true,
		})

		if (!updatedUser) {
			return {
				success: false,
				statusCode: HttpStatus.NOT_FOUND,
				message: ErrorMessages.USER_NOT_FOUND,
			}
		}

		const returningUser = this.returnUserFields(updatedUser)

		return {
			success: true,
			statusCode: HttpStatus.OK,
			data: returningUser,
		}
	}

	async changeEmail(
		userId: string,
		dto: EmailDto
	): Promise<ResponseType<ReturningUser>> {
		if (!userId) {
			return {
				success: false,
				statusCode: HttpStatus.UNAUTHORIZED,
				message: ErrorMessages.USER_IS_NOT_UNAUTHORIZED,
			}
		}

		const activationToken = v4()
		await this.sendgridService.sendConfirmEmailLetter(
			dto.email,
			activationToken
		)

		const emailDto = { email: dto.email, activationToken, isActivated: false }
		const updatedUser = await this.UserModel.findByIdAndUpdate(
			userId,
			emailDto,
			{ new: true }
		)

		const returningUser = this.returnUserFields(updatedUser)

		return {
			success: true,
			statusCode: HttpStatus.OK,
			data: returningUser,
		}
	}

	async requestResetPassword(dto: EmailDto): Promise<ResponseType> {
		const user = await this.findByEmail(dto.email)

		if (!user) {
			return {
				success: false,
				statusCode: HttpStatus.NOT_FOUND,
				message: ErrorMessages.USER_NOT_FOUND,
			}
		}

		user.password = ''
		user.save()

		await this.sendgridService.sendPasswordResetEmail(user.email)

		return {
			success: true,
			statusCode: HttpStatus.OK,
		}
	}

	async resetPassword(dto: ResetPasswordDto): Promise<ResponseType> {
		const hashPassword = await this.passwordService.createPassword(dto.password)

		const user = await this.findByEmail(dto.email)

		if (!user) {
			return {
				success: false,
				statusCode: HttpStatus.NOT_FOUND,
				message: ErrorMessages.USER_NOT_FOUND,
			}
		}

		await this.UserModel.findByIdAndUpdate(user._id, { password: hashPassword })

		return {
			success: true,
			statusCode: HttpStatus.OK,
		}
	}

	async changePassword(
		dto: ChangePasswordDto,
		userId: string
	): Promise<ResponseType> {
		const user = await this.findById(userId)
		const isValidPassword = await this.passwordService.checkPassword(
			dto.password,
			user.password
		)

		if (!user || !isValidPassword) {
			return {
				success: false,
				statusCode: HttpStatus.UNAUTHORIZED,
				message: ErrorMessages.USER_IS_NOT_UNAUTHORIZED,
			}
		}

		const hashPassword = await this.passwordService.createPassword(
			dto.newPassword
		)

		await this.UserModel.findByIdAndUpdate(userId, { password: hashPassword })

		return {
			success: true,
			statusCode: HttpStatus.OK,
		}
	}

	async uploadAvatar(
		file: Express.Multer.File,
		userId: string
	): Promise<ResponseType<ReturningUser>> {
		const user = await this.findById(userId)

		if (!user) {
			return {
				success: false,
				statusCode: HttpStatus.NOT_FOUND,
				message: ErrorMessages.USER_NOT_FOUND,
			}
		}

		const avatarPath = `${CloudinaryFolders.USER_AVATAR}${userId}`
		const resultPath = await this.cloudinaryService.uploadFile(
			file,
			FileType.IMAGE,
			avatarPath
		)

		fs.unlinkSync(file.path)
		const updatedUser = await this.UserModel.findByIdAndUpdate(
			userId,
			{ $push: { avatarUrls: resultPath } },
			{ new: true }
		)

		const returningUser = this.returnUserFields(updatedUser)

		return {
			success: true,
			statusCode: HttpStatus.OK,
			data: returningUser,
		}
	}

	async deleteAvatar(
		avatarPublicId: string,
		userId: string
	): Promise<ResponseType<ReturningUser>> {
		const user = await this.findById(userId)

		if (!user) {
			return {
				success: false,
				statusCode: HttpStatus.NOT_FOUND,
				message: ErrorMessages.USER_NOT_FOUND,
			}
		}

		await this.cloudinaryService.deleteFile(avatarPublicId, FileType.IMAGE)

		const updatedAvatarArr = user.avatarUrls.filter(
			(item) => !item.includes(avatarPublicId)
		)

		const updatedUser = await this.UserModel.findByIdAndUpdate(
			userId,
			{ avatarUrls: updatedAvatarArr },
			{ new: true }
		)

		const returningUser = this.returnUserFields(updatedUser)

		return {
			success: true,
			statusCode: HttpStatus.OK,
			data: returningUser,
		}
	}

	async selectAvatar(
		avatarPublicId: string,
		userId: string
	): Promise<ResponseType<ReturningUser>> {
		const user = await this.findById(userId)
		const avatars = user.avatarUrls

		if (!user) {
			return {
				success: false,
				statusCode: HttpStatus.NOT_FOUND,
				message: ErrorMessages.USER_NOT_FOUND,
			}
		}

		const index = avatars.findIndex((item) => item.includes(avatarPublicId))
		const [removedElement] = avatars.splice(index, 1)
		avatars.push(removedElement)

		const updatedUser = await this.UserModel.findByIdAndUpdate(
			userId,
			{ avatarUrls: avatars },
			{ new: true }
		)

		const returningUser = this.returnUserFields(updatedUser)

		return {
			success: true,
			statusCode: HttpStatus.OK,
			data: returningUser,
		}
	}

	async deleteProfile(userId: string): Promise<ResponseType> {
		const user = await this.findById(userId)

		if (!user) {
			return {
				success: false,
				statusCode: HttpStatus.UNAUTHORIZED,
				message: ErrorMessages.USER_IS_NOT_UNAUTHORIZED,
			}
		}

		await this.UserModel.findByIdAndDelete(userId)

		const avatars = user.avatarUrls
		await this.deleteUserFiles(avatars)

		await this.companyService.deleteAll(userId)
		await this.calendarService.deleteAll(userId)
		await this.statisticsService.delete(userId)
		await this.todosService.deleteAll(userId)
		await this.vacationService.deleteAll(userId)

		return {
			success: true,
			statusCode: HttpStatus.OK,
		}
	}

	async getCurrentUser(userId: string): Promise<ResponseType<ReturningUser>> {
		const user = await this.findById(userId)

		if (!user) {
			return {
				success: false,
				statusCode: HttpStatus.UNAUTHORIZED,
				message: ErrorMessages.USER_IS_NOT_UNAUTHORIZED,
			}
		}

		const returningUser = this.returnUserFields(user)

		return {
			success: true,
			statusCode: HttpStatus.OK,
			data: returningUser,
		}
	}

	// HELPERS

	returnUserFields(user: UserModel): ReturningUser {
		return {
			_id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			dateBirth: user.dateBirth,
			email: user.email,
			gender: user.gender,
			avatarUrls: user.avatarUrls,
			isActivated: user.isActivated,
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

	private async deleteUserFiles(arrPath: string[]) {
		if (arrPath.length > 1) {
			const avatarsFolderPath = this.cloudinaryService.getFolderPath(arrPath[1])

			if (!avatarsFolderPath.split('/').includes('default')) {
				await this.cloudinaryService.deleteFilesAndFolder(avatarsFolderPath)
			}
		}
	}
}
