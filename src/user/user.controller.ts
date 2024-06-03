import { Controller, Get, Param } from '@nestjs/common'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('activation-email/:activationToken')
	async activationEmail(@Param('activationToken') activationToken: string) {
		return await this.userService.activationEmail(activationToken)
	}
}
