import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	Res,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { ResponseType } from 'src/common/response.type'
import { DEFAULT_FOLDER_FOR_FILES } from 'src/common/vars/default-file-folder'
import { User } from './decorators/user.decorator'
import { ChangePasswordDto } from './dto/change-password.dto'
import { ChangeProfileDto } from './dto/change-profile.dto'
import { EmailDto } from './dto/email.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { imageValidator } from './pipes/image-validator.pipe'
import { ReturningUser } from './types/returning-user.type'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly configService: ConfigService
	) {}

	@Get('activation-email/:activationToken')
	async activationEmail(
		@Param('activationToken') activationToken: string,
		@Res({ passthrough: true }) res: Response
	): Promise<ResponseType> {
		const clientUrl = this.configService.get<string>('CLIENT_URL')
		res.redirect(`${clientUrl}/activation-success`)

		const data = await this.userService.activationEmail(activationToken)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@HttpCode(HttpStatus.OK)
	@Post('request-repeat-activation-email')
	async requestRepeatActivationEmail(
		@Body() dto: EmailDto,
		@Res({ passthrough: true }) res: Response
	): Promise<ResponseType> {
		const data = await this.userService.requestRepeatActivationEmail(dto)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Auth()
	@Patch('change-profile')
	async changeProfile(
		@Body() dto: ChangeProfileDto,
		@User('_id') _id: string,
		@Res({ passthrough: true }) res: Response
	): Promise<ResponseType<ReturningUser>> {
		const data = await this.userService.changeProfile(_id, dto)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Auth()
	@Patch('change-email')
	async changeEmail(
		@Body() dto: EmailDto,
		@User('_id') _id: string,
		@Res({ passthrough: true }) res: Response
	): Promise<ResponseType<ReturningUser>> {
		const data = await this.userService.changeEmail(_id, dto)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@HttpCode(HttpStatus.OK)
	@Post('request-reset-password')
	async requestResetPassword(
		@Body() dto: EmailDto,
		@Res({ passthrough: true }) res: Response
	): Promise<ResponseType> {
		const data = await this.userService.requestResetPassword(dto)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@HttpCode(HttpStatus.OK)
	@Post('reset-password')
	async resetPassword(
		@Body() dto: ResetPasswordDto,
		@Res({ passthrough: true }) res: Response
	): Promise<ResponseType> {
		const data = await this.userService.resetPassword(dto)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Auth()
	@Patch('change-password')
	async changePassword(
		@Body() dto: ChangePasswordDto,
		@User('_id') _id: string,
		@Res({ passthrough: true }) res: Response
	): Promise<ResponseType> {
		const data = await this.userService.changePassword(dto, _id)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Auth()
	@HttpCode(HttpStatus.OK)
	@Post('upload-avatar')
	@UseInterceptors(
		FileInterceptor('avatar', { dest: DEFAULT_FOLDER_FOR_FILES })
	)
	async uploadAvatar(
		@UploadedFile(imageValidator)
		file: Express.Multer.File,
		@User('_id') _id: string,
		@Res({ passthrough: true }) res: Response
	): Promise<ResponseType<ReturningUser>> {
		const data = await this.userService.uploadAvatar(file, _id)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Auth()
	@Delete('delete-avatar')
	async deleteAvatar(
		@User('_id') _id: string,
		@Res({ passthrough: true }) res: Response,
		@Query('avatarPublicId') avatarPublicId: string
	): Promise<ResponseType<ReturningUser>> {
		const data = await this.userService.deleteAvatar(avatarPublicId, _id)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Auth()
	@Delete('delete-profile')
	async deleteProfile(
		@User('_id') _id: string,
		@Res({ passthrough: true }) res: Response
	): Promise<ResponseType> {
		const data = await this.userService.deleteProfile(_id)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}

	@Auth()
	@Get('current-user')
	async getCurrentUser(
		@User('_id') _id: string,
		@Res({ passthrough: true }) res: Response
	): Promise<ResponseType<ReturningUser>> {
		const data = await this.userService.getCurrentUser(_id)

		if (!data.success) {
			res.status(data.statusCode)
		}

		return data
	}
}
