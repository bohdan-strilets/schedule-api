import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { User } from './decorators/user.decorator'
import { ChangeProfileDto } from './dto/change-profile.dto'
import { EmailDto } from './dto/email.dto'
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
}
