import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Req,
	Res,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { cookieKeys, cookieOptions } from 'src/common/cookie-options'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegistrationDto } from './dto/registration.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@Post('registration')
	async registration(
		@Body() dto: RegistrationDto,
		@Res({ passthrough: true }) res: Response
	) {
		const data = await this.authService.registration(dto)
		res.cookie(
			cookieKeys.REFRESH_TOKEN,
			data.tokens.refreshToken,
			cookieOptions
		)
		return data
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(
		@Body() dto: LoginDto,
		@Res({ passthrough: true }) res: Response
	) {
		const data = await this.authService.login(dto)
		res.cookie(
			cookieKeys.REFRESH_TOKEN,
			data.tokens.refreshToken,
			cookieOptions
		)
		return data
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Get('refresh-token')
	async refreshToken(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		const refreshToken = req.cookies[cookieKeys.REFRESH_TOKEN]
		const data = await this.authService.refreshToken(refreshToken)
		res.cookie(
			cookieKeys.REFRESH_TOKEN,
			data.tokens.refreshToken,
			cookieOptions
		)
		return data
	}
}
