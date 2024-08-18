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
import { ResponseType } from 'src/common/response.type'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegistrationDto } from './dto/registration.dto'
import { AuthResponse } from './types/auth-response.type'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@Post('registration')
	async registration(
		@Body() dto: RegistrationDto,
		@Res({ passthrough: true }) res: Response
	): Promise<ResponseType<AuthResponse> | ResponseType> {
		const data = await this.authService.registration(dto)

		if (data.success) {
			const refreshToken = data.data?.tokens.refreshToken
			res.cookie(cookieKeys.REFRESH_TOKEN, refreshToken, cookieOptions)
		} else {
			res.status(data.statusCode)
		}

		return data
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(
		@Body() dto: LoginDto,
		@Res({ passthrough: true }) res: Response
	): Promise<ResponseType<AuthResponse> | ResponseType> {
		const data = await this.authService.login(dto)

		if (data.success) {
			const refreshToken = data.data?.tokens.refreshToken
			res.cookie(cookieKeys.REFRESH_TOKEN, refreshToken, cookieOptions)
		} else {
			res.status(data.statusCode)
		}

		return data
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Get('refresh-token')
	async refreshToken(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	): Promise<ResponseType<AuthResponse> | ResponseType> {
		const refreshToken = req.cookies[cookieKeys.REFRESH_TOKEN]
		const data = await this.authService.refreshToken(refreshToken)

		if (data.success) {
			const refreshToken = data.data?.tokens.refreshToken
			res.cookie(cookieKeys.REFRESH_TOKEN, refreshToken, cookieOptions)
		} else {
			res.status(data.statusCode)
		}

		return data
	}
}
