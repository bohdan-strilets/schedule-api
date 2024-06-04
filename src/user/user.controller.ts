import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
} from '@nestjs/common'
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
}
