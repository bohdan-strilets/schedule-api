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
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { DEFAULT_FOLDER_FOR_FILES } from 'src/common/vars/default-file-folder'
import { User } from './decorators/user.decorator'
import { ChangePasswordDto } from './dto/change-password.dto'
import { ChangeProfileDto } from './dto/change-profile.dto'
import { EmailDto } from './dto/email.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { imageValidator } from './pipes/image-validator.pipe'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('activation-email/:activationToken')
	async activationEmail(@Param('activationToken') activationToken: string) {
		return await this.userService.activationEmail(activationToken)
	}

	@HttpCode(HttpStatus.OK)
	@Post('request-repeat-activation-email')
	async requestRepeatActivationEmail(@Body() dto: EmailDto) {
		return await this.userService.requestRepeatActivationEmail(dto)
	}

	@Auth()
	@Patch('change-profile')
	async changeProfile(@Body() dto: ChangeProfileDto, @User('_id') _id: string) {
		return await this.userService.changeProfile(_id, dto)
	}

	@Auth()
	@Patch('change-email')
	async changeEmail(@Body() dto: EmailDto, @User('_id') _id: string) {
		return await this.userService.changeEmail(_id, dto)
	}

	@HttpCode(HttpStatus.OK)
	@Post('request-reset-password')
	async requestResetPassword(@Body() dto: EmailDto) {
		return await this.userService.requestResetPassword(dto)
	}

	@HttpCode(HttpStatus.OK)
	@Post('reset-password')
	async resetPassword(@Body() dto: ResetPasswordDto) {
		return await this.userService.resetPassword(dto)
	}

	@Auth()
	@Patch('change-password')
	async changePassword(
		@Body() dto: ChangePasswordDto,
		@User('_id') _id: string
	) {
		return await this.userService.changePassword(dto, _id)
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
		@User('_id') _id: string
	) {
		return await this.userService.uploadAvatar(file, _id)
	}

	@Auth()
	@HttpCode(HttpStatus.OK)
	@Post('upload-poster')
	@UseInterceptors(
		FileInterceptor('poster', { dest: DEFAULT_FOLDER_FOR_FILES })
	)
	async uploadPoster(
		@UploadedFile(imageValidator)
		file: Express.Multer.File,
		@User('_id') _id: string
	) {
		return await this.userService.uploadPoster(file, _id)
	}

	@Auth()
	@Delete('delete-profile')
	async deleteProfile(@User('_id') _id: string) {
		return await this.userService.deleteProfile(_id)
	}
}
