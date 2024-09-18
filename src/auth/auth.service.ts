import { HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { ResponseType } from 'src/common/response.type'
import { DefaultAvatarUrl } from 'src/common/vars/default-avatar'
import { ErrorMessages } from 'src/common/vars/error-messages'
import { PasswordService } from 'src/password/password.service'
import { SendgridService } from 'src/sendgrid/sendgrid.service'
import { StatisticsService } from 'src/statistics/statistics.service'
import { UserModel } from 'src/user/models/user.model'
import { UserService } from 'src/user/user.service'
import { v4 } from 'uuid'
import { LoginDto } from './dto/login.dto'
import { RegistrationDto } from './dto/registration.dto'
import { AuthResponse } from './types/auth-response.type'
import { Tokens } from './types/tokens.type'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
		private readonly jwtService: JwtService,
		private readonly sendgridService: SendgridService,
		private readonly userService: UserService,
		private readonly passwordService: PasswordService,
		private readonly statisticsService: StatisticsService
	) {}

	async registration(
		dto: RegistrationDto
	): Promise<ResponseType<AuthResponse> | ResponseType> {
		const { firstName, lastName, email, password } = dto
		const userFromDb = await this.userService.findByEmail(email)

		if (userFromDb) {
			return {
				success: false,
				statusCode: HttpStatus.CONFLICT,
				message: ErrorMessages.EMAIL_IN_USE,
			}
		}

		const hashPassword = await this.passwordService.createPassword(password)
		const activationToken = v4()

		const createdUser = await this.UserModel.create({
			firstName,
			lastName,
			email,
			activationToken,
			password: hashPassword,
			avatarUrls: [DefaultAvatarUrl],
		})

		await this.statisticsService.create(String(createdUser._id))
		await this.sendgridService.sendConfirmEmailLetter(
			createdUser.email,
			createdUser.activationToken
		)

		const tokens = await this.createTokenPair(String(createdUser._id))
		const returningUser = this.userService.returnUserFields(createdUser)

		return {
			success: true,
			statusCode: HttpStatus.CREATED,
			data: { user: returningUser, tokens },
		}
	}

	async login(
		dto: LoginDto
	): Promise<ResponseType<AuthResponse> | ResponseType> {
		const { email, password } = dto
		const user = await this.validateUser(email, password)

		if ('_id' in user) {
			const tokens = await this.createTokenPair(String(user?._id))
			const returningUser = this.userService.returnUserFields(user)

			return {
				success: true,
				statusCode: HttpStatus.OK,
				data: { user: returningUser, tokens },
			}
		}
	}

	async refreshToken(
		refreshToken: string
	): Promise<ResponseType<AuthResponse> | ResponseType> {
		if (!refreshToken) {
			return {
				success: false,
				statusCode: HttpStatus.UNAUTHORIZED,
				message: ErrorMessages.USER_IS_NOT_UNAUTHORIZED,
			}
		}

		const checkedToken = await this.jwtService.verifyAsync(refreshToken)

		if (!checkedToken) {
			return {
				success: false,
				statusCode: HttpStatus.UNAUTHORIZED,
				message: ErrorMessages.INVALID_TOKEN,
			}
		}

		const userFromDb = await this.userService.findById(checkedToken._id)

		if (!userFromDb) {
			return {
				success: false,
				statusCode: HttpStatus.NOT_FOUND,
				message: ErrorMessages.USER_NOT_FOUND,
			}
		}

		const tokens = await this.createTokenPair(String(userFromDb._id))
		const returningUser = this.userService.returnUserFields(userFromDb)

		return {
			success: true,
			statusCode: HttpStatus.OK,
			data: { user: returningUser, tokens },
		}
	}

	// HELPERS

	async createTokenPair(userId: string): Promise<Tokens> {
		const data = { _id: userId }

		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '15d',
		})

		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '1h',
		})

		return { refreshToken, accessToken }
	}

	async validateUser(
		email: string,
		password: string
	): Promise<UserModel | ResponseType> {
		const user = await this.userService.findByEmail(email)

		if (!user) {
			return {
				success: false,
				statusCode: HttpStatus.BAD_REQUEST,
				message: ErrorMessages.EMAIL_IS_WRONG,
			}
		}

		const isValidPassword = await this.passwordService.checkPassword(
			password,
			user.password
		)

		if (!isValidPassword) {
			return {
				success: false,
				statusCode: HttpStatus.BAD_REQUEST,
				message: ErrorMessages.PASSWORD_IS_WRONG,
			}
		}

		if (!user.isActivated) {
			return {
				success: false,
				statusCode: HttpStatus.BAD_REQUEST,
				message: ErrorMessages.EMAIL_IS_NOT_ACTIVATED,
			}
		}

		return user
	}
}
